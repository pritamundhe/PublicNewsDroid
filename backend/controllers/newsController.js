const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const News = require("../models/News");
const User = require("../models/User");
const getLocation = require("../utils/location");
const analyzeContent = require("../utils/analyzeContent");
const Comment = require("../models/Comment");
const getGeoLocation = require("../utils/getLoc");
const nodemailer = require("nodemailer");
const classifyContent = require("../utils/chatgpt");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const { sendNotification } = require("../config/firebase");
const { Types, isValidObjectId } = require("mongoose");

dotenv.config();

const app = express();
app.use(express.json());

// const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const addNews = async (req, res) => {
  const { title, content, category, author, images, videos } = req.body;

  if (!title || !content || !category || !author) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Function to calculate a region code based on 10km radius
  function getRegionCode(lat, lon) {
    const RADIUS_KM = 10;
    const latStep = RADIUS_KM / 111; // ≈ 0.09 degrees
    const lonStep = RADIUS_KM / (111 * Math.cos(lat * Math.PI / 180)); // Adjust for curvature
    const latRegion = Math.floor(lat / latStep);
    const lonRegion = Math.floor(lon / lonStep);
    return latRegion * 100000 + lonRegion;
  }

  try {
    const user = await User.findById(author);
    if (!user) {
      return res.status(400).json({ error: "Invalid author ID. User not found." });
    }


    const location = await getGeoLocation().catch((err) => {
      console.error("Error getting location:", err);
      return {};
    });

    const extractedKeywords = await classifyContent(content).catch((err) => {
      console.error("Error extracting keywords:", err);
      return [];
    });
    const keywords = extractedKeywords.map(item => item.tag);

    const isToxic = await analyzeContent(content);
    const contentStatus = isToxic ? "Rejected" : "Approved";

    let imageUrls = [];
    let videoUrls = [];

    if (req.files) {
      try {
        const imageFiles = req.files.images || [];
        const videoFiles = req.files.videos || [];

        const uploadPromises = [];

        imageFiles.forEach((file) => {
          const uploadPromise = cloudinary.uploader.upload(file.path, {
            folder: "news/images",
            resource_type: "image",
          }).then((result) => {
            imageUrls.push(result.secure_url);
            return fs.promises.unlink(file.path);
          });
          uploadPromises.push(uploadPromise);
        });

        videoFiles.forEach((file) => {
          const uploadPromise = cloudinary.uploader.upload(file.path, {
            folder: "news/videos",
            resource_type: "video",
          }).then((result) => {
            videoUrls.push(result.secure_url);
            return fs.promises.unlink(file.path);
          });
          uploadPromises.push(uploadPromise);
        });

        await Promise.all(uploadPromises);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ success: false, message: "Failed to upload media" });
      }
    }


    // 🧠 Generate region code based on lat/lon
    const latitude = parseFloat(location.latitude || "0");
    const longitude = parseFloat(location.longitude || "0");
    const regionCode = getRegionCode(latitude, longitude);

    const newNews = new News({
      title,
      content,
      category,
      author,
      images: imageUrls,
      videos: videoUrls,
      location: {
        latitude: location.latitude || "",
        longitude: location.longitude || "",
        ip: location.ip || "",
        timezone: location.timezone || "",
        accuracy: location.accuracy || 0,
        city: location.city || "",
        asn: location.asn || 0,
        organization: location.organization || "",
        area_code: location.area_code || "",
        organization_name: location.organization_name || "",
        country_code: location.country_code || "",
        country_code3: location.country_code3 || "",
        continent_code: location.continent_code || "",
        country: location.country || "",
        region: location.region || "",
      },
      code: regionCode,
      keywords,
      flaggedByAI: isToxic,
      flaggedReason: isToxic ? "Offensive Content" : "",
      status: contentStatus,
      code: regionCode, // ✅ region code based on 10km circle
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "contact.skillswap@gmail.com",
        pass: "mtmstfcenrryopyi",
      },
    });

    const mailOptions = {
      from: "contact.skillswap@gmail.com",
      to: "pritammundhe00@gmail.com",
      subject: "Offensive Language Detected in News Submission",
      html: `
            <html>
                <body>
                    <h2>⚠ Offensive Language Detected</h2>
                    <p>Your recent news submission has been flagged for offensive content.</p>
                    <h3>📌 News Title:</h3>
                    <p>${title}</p>
                    <h3>👤 Added by:</h3>
                    <p>${user.username}</p>
                    <p>If you believe this is a mistake, please contact support.</p>
                    <a href="mailto:support@skillswap.com">Contact Support</a>
                </body>
            </html>
        `
    };

    if (isToxic) {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error sending email' });
        }
        return res.status(200).json({ message: 'Email sent successfully' });
      });
    }

    const savedNews = await newNews.save();

    if (isToxic) {
      const adminUsers = await User.find({ role: "admin" });
      adminUsers.forEach(async (adminUser) => {
        if (adminUser.fcmToken) {
          await sendNotification(
            adminUser.fcmToken,
            "News Flagged",
            `Review the flagged news: ${savedNews.title}`
          );
        }
      });
    } else {
      const interestedUsers = await User.find({
        "preferences.categories": category,
        fcmToken: { $exists: true, $ne: null }
      });
      console.log(interestedUsers);

      const userTokens = interestedUsers.map((users) => users.fcmToken);
      if (userTokens.length > 0) {
        await sendNotification(userTokens, "Breaking News!", `${title}`);
      }
    }

    res.status(201).json(savedNews);
  } catch (error) {
    console.error("Error saving news:", error);
    res.status(500).send("Server error");
  }
};



const commentController = {
  // Create a new comment
  createComment: async (req, res) => {
    try {
      const { newsId, userId, content, parentCommentId } = req.body;

      // Validate required fields
      if (!newsId || !userId || !content) {
        return res
          .status(400)
          .json({ message: "News ID, User ID, and content are required." });
      }

      const isToxic = await analyzeContent(content);
      const contentStatus = isToxic ? "Rejected" : "Approved";

      // Create a new comment
      const newComment = new Comment({
        newsId,
        userId,
        content,
        parentCommentId: parentCommentId || null,
        flaggedByAI: isToxic,
        flaggedReason: isToxic ? "Offensive Content" : "",
        status: contentStatus,
      });

      await newComment.save();

      res
        .status(201)
        .json({
          message: "Comment created successfully!",
          comment: newComment,
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating comment.", error: error.message });
    }
  },

  // Get comments for a specific article
  getCommentsByArticle: async (req, res) => {
    try {
      const { newsId } = req.params;

      // Validate newsId
      if (!newsId) {
        return res.status(400).json({ message: "news ID is required." });
      }

      const comments = await Comment.find({ newsId }).sort({ createdAt: -1 });

      res.status(200).json({ comments });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching comments.", error: error.message });
    }
  },

  // Update a comment
  updateComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;

      // Validate required fields
      if (!commentId || !content) {
        return res
          .status(400)
          .json({ message: "Comment ID and content are required." });
      }

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
      );

      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      res
        .status(200)
        .json({
          message: "Comment updated successfully!",
          comment: updatedComment,
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating comment.", error: error.message });
    }
  },

  // Delete a comment
  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;

      // Validate commentId
      if (!commentId) {
        return res.status(400).json({ message: "Comment ID is required." });
      }

      const deletedComment = await Comment.findByIdAndDelete(commentId);

      if (!deletedComment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      res.status(200).json({ message: "Comment deleted successfully!" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting comment.", error: error.message });
    }
  },

  // Like a comment
  likeComment: async (req, res) => {
    try {
      const { commentId } = req.params;

      // Validate commentId
      if (!commentId) {
        return res.status(400).json({ message: "Comment ID is required." });
      }

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { likes: 1 } },
        { new: true }
      );

      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      res
        .status(200)
        .json({ message: "Comment liked!", comment: updatedComment });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error liking comment.", error: error.message });
    }
  },

  // Dislike a comment
  dislikeComment: async (req, res) => {
    try {
      const { commentId } = req.params;

      // Validate commentId
      if (!commentId) {
        return res.status(400).json({ message: "Comment ID is required." });
      }

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { dislikes: 1 } },
        { new: true }
      );

      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      res
        .status(200)
        .json({ message: "Comment disliked!", comment: updatedComment });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error disliking comment.", error: error.message });
    }
  },
};

// Admin Approve or Reject News
const updateNewsStatus = async (req, res) => {
  const { id, status, reviewComment } = req.body;

  if (!id || !["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const updatedNews = await News.findByIdAndUpdate(
      id,
      {
        status,
        reviewComment:
          status === "Rejected" ? reviewComment || "No comment provided" : "",
      },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ error: "News not found" });
    }

    res.status(200).json(updatedNews);
  } catch (error) {
    console.error('Error updating news status:', error);
    res.status(500).send('Server error');
  }
};

const fetch = async (req, res) => {
  const userid = req.query.userid;

  try {
    // Validate userid
    if (!userid || typeof userid !== "string") {
      return res.status(400).json({ message: "Invalid or missing userid" });
    }

    // 1. Find the user by ID
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Ensure the user has a code
    const userCode = user.code;
    console.log("Username:", user.username);
    console.log("Region Code:", userCode);

    if (userCode === undefined || userCode === null) {
      return res.status(400).json({ message: "User does not have a valid region code" });
    }

    // 3. Fetch news with matching code
    const news = await News.find({ code: userCode });

    // 4. Return the news list
    res.status(200).json({ success: true, news });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



const fetchNews = async (req, res) => {
  const { category, location, latitude, longitude, keywords, startDate, endDate, source } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (location) filter['location.city'] = location;
  if (latitude && longitude) {
    filter['location.latitude'] = parseFloat(latitude);
    filter['location.longitude'] = parseFloat(longitude);
  }
  if (keywords) filter.content = { $regex: keywords, $options: 'i' };
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }
  if (source) filter.author = source;

  try {
    const newsArticles = await News.find(filter).sort({ createdAt: -1 });
    res.status(200).json(newsArticles);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).send('Server error');
  }
};

const fetchUserNews = async (req, res) => {
  const { userId } = req.query;
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const userNews = await News.find({ author: new Types.ObjectId(userId) });

    if (userNews.length > 0) {
      res.status(200).json(userNews);
    } else {
      res.status(404).json({ message: "No news found for this user." });
    }
  } catch (error) {
    console.error("Error fetching user news:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  addNews,
  commentController,
  updateNewsStatus,
  fetchNews,
  fetch,
  fetchUserNews
};
