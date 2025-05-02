const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    location: {
        type: {
            lat: { type: Number },
            lon: { type: Number },
        },
        required: false,
    },
    code: {
        type: Number,
        required: false
    },
    preferences: {
        categories: [{ type: String }],
        language: { type: String, default: 'en' },
    },
    savedArticles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    mobile: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    dob: {
        day: { type: String },
        month: { type: String },
        year: { type: String }
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    city: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    fcmToken: {
        type: String
    }, 
});

module.exports = mongoose.model('User', UserSchema);
