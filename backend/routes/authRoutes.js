const express = require('express');
const router = express.Router();
const { resetPassword } = require('../controllers/authController');
const { sendPasswordResetEmail } = require('../controllers/authController');

router.post('/reset', sendPasswordResetEmail);
router.post('/resetPassword', resetPassword);

module.exports = router;