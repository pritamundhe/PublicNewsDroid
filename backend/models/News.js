const mongoose = require('mongoose');

const PollOptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
  code: { 
    type: Number, 
    required: true 
  },
  keywords: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
  },
  tags: [String],
  views: { type: Number, default: 0 },

  // 💬 Polls
  poll: {
    question: { type: String },
    options: [PollOptionSchema],
  },

  // ✅ Moderation
  flaggedByAI: Boolean,
  flaggedReason: String,

  isTrending: { type: Boolean, default: false },
  source: { type: String },

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },

  // 📊 Engagement
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    laugh: { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 3;
}

const News = mongoose.model('News', NewsSchema);
module.exports = News;
