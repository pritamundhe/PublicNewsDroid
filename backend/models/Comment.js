
const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    newsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'News', // Reference to the Article model
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to the User model
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // Reference to another comment for replies
        default: null,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    flaggedByAI: Boolean,
    flaggedReason: String,
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Add pre-save middleware to update the updatedAt field
commentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create and export the Comment model
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
