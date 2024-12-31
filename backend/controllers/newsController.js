const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const News = require('../models/News');
const Comment = require('../models/Comment');

dotenv.config();

const app = express();
app.use(express.json());

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!HF_API_KEY) {
  console.error('Hugging Face API Key is missing');
  process.exit(1);
}

const analyzeContent = async (content) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/unitary/toxic-bert',
      { inputs: content },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    );

    const toxicLabel = response.data[0].find(
      label => label.label === 'toxic' || label.label === 'severe_toxic'
    );

    const toxicityThreshold = 0.005;

    if (toxicLabel && toxicLabel.score > toxicityThreshold) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error analyzing content:', error);
    return false;
  }
};

const addNews = async (req, res) => {
  const { title, content, category, author, images, videos, location } = req.body;

  if (!title || !content || !category || !author) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isToxic = await analyzeContent(content);

  const contentStatus = isToxic ? 'Rejected' : 'Approved';

  const newNews = new News({
    title,
    content,
    category,
    author,
    images,
    videos,
    location,
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
