const express = require('express');
const router = express.Router();
const { resetPassword } = require('../controllers/authController');
const { sendPasswordResetEmail,register,login,updateUserFcmToken } = require('../controllers/authController');


router.post('/reset', sendPasswordResetEmail);
router.post('/resetPassword', resetPassword);
router.post('/register',register);
router.post('/login',login);
router.post('/updateuserfcmtoken',updateUserFcmToken);

module.exports = router;