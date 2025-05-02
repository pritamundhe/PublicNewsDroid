const express = require('express');
const User = require('../models/User');
const News = require('../models/News');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
};

const deactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { isActive: false },
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deactivated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error deactivating user" });
    }
};

const reactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { isActive: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User reactivated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error reactivating user" });
    }
};

const getFlaggedContent = async (req, res) => {
    try {
        const flaggedNews = await News.find({ flaggedByAI: true })
            .sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'username'
            });


        res.status(200).json(flaggedNews);
    } catch (error) {
        res.status(500).json({ error: "Error fetching flagged content" });
    }
};

const getNewsAnalytics = async (req, res) => {
    try {
        const totalNews = await News.countDocuments();
        const approvedNews = await News.countDocuments({ status: "Approved" });
        const flaggedNews = await News.countDocuments({ flaggedByAI: true });

        res.status(200).json({
            totalNews,
            approvedNews,
            flaggedNews,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error fetching news analytics" });
    }
};



module.exports = {
    getAllUsers,
    deactivateUser,
    reactivateUser,
    getFlaggedContent,
    getNewsAnalytics
}  