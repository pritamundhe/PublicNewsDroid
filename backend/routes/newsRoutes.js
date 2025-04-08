const express = require('express');
const router = express.Router();
const upload=require("../middleware/upload");
const { addNews,commentController,updateNewsStatus,fetchNews, fetch } = require('../controllers/newsController');  

router.post("/add", upload.array("files", 5), addNews);  // Ensure 'addNews' exists in your controller
router.post('/addcomment',commentController.createComment);
router.post('/addcomment/:commentId/like',commentController.likeComment);
router.post('/addcomment/:commentId/dislike',commentController.dislikeComment);

router.patch('/update-status', updateNewsStatus);

router.get('/fetch', fetchNews);
router.get('/fetc', fetch);

module.exports = router;
