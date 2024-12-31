const express = require('express');
const router = express.Router();
const { addNews,commentController } = require('../controllers/newsController');  // Ensure this import is correct

router.post('/add', addNews);  // Ensure 'addNews' exists in your controller
router.post('/addcomment',commentController.createComment);
router.post('/addcomment/:commentId/like',commentController.likeComment);
router.post('/addcomment/:commentId/dislike',commentController.dislikeComment);

module.exports = router;
