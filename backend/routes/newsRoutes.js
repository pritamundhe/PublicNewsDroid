const express = require('express');
const router = express.Router();
const { addNews } = require('../controllers/newsController');  // Ensure this import is correct

router.post('/add', addNews);  // Ensure 'addNews' exists in your controller

module.exports = router;
