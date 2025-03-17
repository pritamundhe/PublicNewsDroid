const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const News = require('../models/News');
const getLocation = require('../utils/location');
const analyzeContent = require('../utils/analyzeContent');
const Comment = require('../models/Comment');
const { chatWithGPT } = require('../utils/chatgpt');
const { getLocationFromIPAPI } = require('../utils/getLoc');

dotenv.config();

const app = express();
app.use(express.json());



const addNews = async (req, res) => {
  const { title, content, category, author, images, videos } = req.body;

  if (!title || !content || !category || !author) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  (async () => {
    const prompt = "Extract any offensive words from the sentence: 'i will hate you. only give offensive word from this sentence'";
    try {
      const response = await chatWithGPT(prompt);
      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  })();

  const isToxic = await analyzeContent(content);
  const location = await getLocation();
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

  try {
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







module.exports = {
  addNews,
  commentController,
};
