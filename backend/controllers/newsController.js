const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const News = require('../models/News');

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

module.exports = {
  addNews,
};
