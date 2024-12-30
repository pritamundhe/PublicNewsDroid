const express = require('express');
const router = express.Router();
const { resetPassword } = require('../controllers/authController');
<<<<<<< HEAD
const { sendPasswordResetEmail } = require('../controllers/authController');

router.post('/reset', sendPasswordResetEmail);
router.post('/resetPassword', resetPassword);
=======
const { sendPasswordResetEmail,register,login } = require('../controllers/authController');


router.post('/reset', sendPasswordResetEmail);
router.post('/resetPassword', resetPassword);
router.post('/register',register);
router.post('/login',login);
>>>>>>> 4aac19d7e9d999abfdad3e8ea648931932553cb6

module.exports = router;