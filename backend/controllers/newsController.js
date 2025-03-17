const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const News = require('../models/News');
const User = require('../models/User');
const getLocation = require('../utils/location');
const analyzeContent = require('../utils/analyzeContent');
const Comment = require('../models/Comment');
const getGeoLocation = require('../utils/getLoc');
const nodemailer = require('nodemailer');


dotenv.config();

const app = express();
app.use(express.json());


const addNews = async (req, res) => {
  const { title, content, category, author, images, videos } = req.body;

  if (!title || !content || !category || !author) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const user = await User.findById(author);
  const isToxic = await analyzeContent(content);
  const location = await getGeoLocation();
  console.log(user.username);
  console.log(location);
  
  const contentStatus = isToxic ? 'Rejected' : 'Approved';

  const newNews = new News({
    title,
    content,
    category,
    author,
    images,
    videos,
    location: {
      latitude: location.latitude, // Store latitude
      longitude: location.longitude, // Store longitude
      ip: location.ip,  // Store IP address
      timezone: location.timezone,  // Store timezone
      accuracy: location.accuracy,  // Store accuracy
      city: location.city,  // Store city
      asn: location.asn,  // Store ASN
      organization: location.organization,  // Store organization
      area_code: location.area_code,  // Store area code
      organization_name: location.organization_name,  // Store organization name
      country_code: location.country_code,  // Store country code
      country_code3: location.country_code3,  // Store 3-letter country code
      continent_code: location.continent_code,  // Store continent code
      country: location.country,  // Store country
      region: location.region,  // Store region
    },
    flaggedByAI: isToxic,
    flaggedReason: isToxic ? 'Offensive Content' : '',
    status: contentStatus,
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
    to: "pritammundhe00@gmail.com", // User's email dynamically fetched
    subject: "Offensive Language Detected in News Submission",
    html: `
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="600px" cellspacing="0" cellpadding="0" border="0" style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                                <tr>
                                    <td align="center">
                                        <h2 style="color: #e63946; margin-bottom: 10px;">⚠ Offensive Language Detected</h2>
                                        <p style="color: #333; font-size: 16px; line-height: 1.6;">Your recent news submission has been flagged for offensive content.</p>
                                        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h3 style="color: #1d3557; margin-bottom: 5px;">📌 News Title:</h3>
                                        <p style="padding: 10px; border-radius: 5px; font-size: 16px; color: #333;">${title}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h3 style="color: #1d3557; margin-bottom: 5px;">👤 Added by:</h3>
                                        <p style="padding: 10px; border-radius: 5px; font-size: 16px; color: #333;">${user.username}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 20px;">
                                        <p style="color: #666; font-size: 14px;">If you believe this is a mistake, please contact support.</p>
                                        <a href="mailto:support@skillswap.com" style="display: inline-block; background: #e63946; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Contact Support</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `
};

  try {
    if(isToxic){
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                return res.status(500).json({message: 'Error sending email'});
            }
            return res.status(200).json({message: 'Email sent successfully'});
        });
    }
    const savedNews = await newNews.save();
    res.status(201).json(savedNews);
  } catch (error) {
    console.error('Error saving news:', error);
    res.status(500).send('Server error');
  }
};

const commentController = {

    // Create a new comment
    createComment: async (req, res) => {
        try {
            const { newsId, userId, content, parentCommentId } = req.body;

            // Validate required fields
            if (!newsId || !userId || !content) {
                return res.status(400).json({ message: 'News ID, User ID, and content are required.' });
            }


            const isToxic = await analyzeContent(content);
            const contentStatus = isToxic ? 'Rejected' : 'Approved';

            // Create a new comment
            const newComment = new Comment({
                newsId,
                userId,
                content,
                parentCommentId: parentCommentId || null,
                flaggedByAI: isToxic,
                flaggedReason: isToxic ? 'Offensive Content' : '',
                status: contentStatus,
            });

            await newComment.save();

            res.status(201).json({ message: 'Comment created successfully!', comment: newComment });
        } catch (error) {
            res.status(500).json({ message: 'Error creating comment.', error: error.message });
        }
    },

    // Get comments for a specific article
    getCommentsByArticle: async (req, res) => {
        try {
            const { newsId } = req.params;

            // Validate newsId
            if (!newsId) {
                return res.status(400).json({ message: 'news ID is required.' });
            }

            const comments = await Comment.find({ newsId }).sort({ createdAt: -1 });

            res.status(200).json({ comments });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching comments.', error: error.message });
        }
    },

    // Update a comment
    updateComment: async (req, res) => {
        try {
            const { commentId } = req.params;
            const { content } = req.body;

            // Validate required fields
            if (!commentId || !content) {
                return res.status(400).json({ message: 'Comment ID and content are required.' });
            }

            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { content },
                { new: true }
            );

            if (!updatedComment) {
                return res.status(404).json({ message: 'Comment not found.' });
            }

            res.status(200).json({ message: 'Comment updated successfully!', comment: updatedComment });
        } catch (error) {
            res.status(500).json({ message: 'Error updating comment.', error: error.message });
        }
    },

    // Delete a comment
    deleteComment: async (req, res) => {
        try {
            const { commentId } = req.params;

            // Validate commentId
            if (!commentId) {
                return res.status(400).json({ message: 'Comment ID is required.' });
            }

            const deletedComment = await Comment.findByIdAndDelete(commentId);

            if (!deletedComment) {
                return res.status(404).json({ message: 'Comment not found.' });
            }

            res.status(200).json({ message: 'Comment deleted successfully!' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting comment.', error: error.message });
        }
    },

    // Like a comment
    likeComment: async (req, res) => {
        try {
            const { commentId } = req.params;

            // Validate commentId
            if (!commentId) {
                return res.status(400).json({ message: 'Comment ID is required.' });
            }


            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { $inc: { likes: 1 } },
                { new: true }
            );

            if (!updatedComment) {
                return res.status(404).json({ message: 'Comment not found.' });
            }

            res.status(200).json({ message: 'Comment liked!', comment: updatedComment });
        } catch (error) {
            res.status(500).json({ message: 'Error liking comment.', error: error.message });
        }
    },

    // Dislike a comment
    dislikeComment: async (req, res) => {
        try {
            const { commentId } = req.params;

            // Validate commentId
            if (!commentId) {
                return res.status(400).json({ message: 'Comment ID is required.' });
            }
            

            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                { $inc: { dislikes: 1 } },
                { new: true }
            );

            if (!updatedComment) {
                return res.status(404).json({ message: 'Comment not found.' });
            }

            res.status(200).json({ message: 'Comment disliked!', comment: updatedComment });
        } catch (error) {
            res.status(500).json({ message: 'Error disliking comment.', error: error.message });
        }
    },
};

// Admin Approve or Reject News
const updateNewsStatus = async (req, res) => {
    const { id, status, reviewComment } = req.body;
  
    if (!id || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
  
    try {
      const updatedNews = await News.findByIdAndUpdate(
        id,
        { 
          status, 
          reviewComment: status === 'Rejected' ? reviewComment || 'No comment provided' : '' 
        },
        { new: true }
      );
  
      if (!updatedNews) {
        return res.status(404).json({ error: 'News not found' });
      }
  
      res.status(200).json(updatedNews);
    } catch (error) {
      console.error('Error updating news status:', error);
      res.status(500).send('Server error');
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


module.exports = {
  addNews,
  commentController,
  updateNewsStatus,
  fetchNews
};
