const express = require("express");
const { getAllUsers, deactivateUser,reactivateUser, getFlaggedContent,getNewsAnalytics} = require("../controllers/adminController");

const router = express.Router();


router.get("/getallusers", getAllUsers);

router.put("/deactivate/:userId", deactivateUser);
router.put("/reactivate/:userId", reactivateUser);
router.get("/flagged", getFlaggedContent);
router.get("/getnewsanalystics", getNewsAnalytics);

module.exports = router;