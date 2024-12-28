const express = require('express');
const router = express.Router();
const { resetPassword } = require('../controllers/authController');
const { sendPasswordResetEmail,register,login } = require('../controllers/authController');


router.post('/reset', sendPasswordResetEmail);
router.post('/resetPassword', resetPassword);
router.post('/register',register);
router.post('/login',login);

module.exports = router;