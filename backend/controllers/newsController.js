const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const News = require('../models/News');
const getLocation = require('../utils/location');
const analyzeContent = require('../utils/analyzeContent');

dotenv.config();

const app = express();
app.use(express.json());



const addNews = async (req, res) => {
  const { title, content, category, author, images, videos } = req.body;

  if (!title || !content || !category || !author) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isToxic = await analyzeContent(content);
  const location = await getLocation();
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

module.exports = {
  addNews,
};
