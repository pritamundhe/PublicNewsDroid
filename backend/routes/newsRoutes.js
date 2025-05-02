const express = require('express');
const router = express.Router();
const upload=require("../middleware/upload");
const { addNews,commentController,updateNewsStatus,fetchNews, fetch,fetchUserNews, fetchCurrentNews, updatePoll,incrementViews,getHighlights } = require('../controllers/newsController');  

router.post("/add", upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 3 },
  ]), addNews);
router.post('/addcomment',commentController.createComment);
router.post('/addcomment/:commentId/like',commentController.likeComment);
router.post('/addcomment/:commentId/dislike',commentController.dislikeComment);
router.post('/updatePoll',updatePoll);

router.patch('/update-status', updateNewsStatus);
router.put('/increment-view/:newsId',incrementViews );

router.get('/fetchcomments/:newsId', commentController.getCommentsByArticle);
router.get('/fetch', fetchNews);
router.get('/fetc', fetch);
router.get('/fetchusernews', fetchUserNews);
router.get('/fetchcurrentnews/:id', fetchCurrentNews);
router.get('/gethighlights',getHighlights);

module.exports = router;
