const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const asyncHandler = require('../middlewares/errorHandler/asyncHandler');

// Controller'ın register metodunu asyncHandler ile sarıyoruz
router.post('/register', asyncHandler(authController.register.bind(authController)));
router.post('/send-verification-email', asyncHandler(authController.sendVerificationEmail.bind(authController)));
router.post('/verify-email', asyncHandler(authController.verifyEmail.bind(authController)));


router.get('/health', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

router.get('/time', asyncHandler(authController.getTime.bind(authController)));

module.exports = router;