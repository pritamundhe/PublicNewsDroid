const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: [String],
  videos: [String],
  location: {
    latitude: String,
    longitude: String,
    ip: String,
    timezone: String,
    accuracy: Number,
    city: String,
    asn: Number,
    organization: String,
    area_code: String,
    organization_name: String,
    country_code: String,
    country_code3: String,
    continent_code: String,
    country: String,
    region: String,
  },
  flaggedByAI: Boolean,
  flaggedReason: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
}, { timestamps: true });

const News = mongoose.model('News', NewsSchema);

module.exports = News;
