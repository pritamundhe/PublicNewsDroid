const express = require('express');
const router = express.Router();
const upload=require("../middleware/upload");
const { addNews,commentController,updateNewsStatus,fetchNews, fetch,fetchUserNews } = require('../controllers/newsController');  

router.post("/add", upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 3 },
  ]), addNews);
router.post('/addcomment',commentController.createComment);
router.post('/addcomment/:commentId/like',commentController.likeComment);
router.post('/addcomment/:commentId/dislike',commentController.dislikeComment);

router.patch('/update-status', updateNewsStatus);

router.get('/fetch', fetchNews);
router.get('/fetc', fetch);
router.get('/fetchusernews', fetchUserNews);

module.exports = router;
