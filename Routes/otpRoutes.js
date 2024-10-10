const express = require('express');
const { sendOtp, verifyOtp } = require('../Controllers/otpController');
const otpRateLimit = require('../middlewares/otpRateLimit')


const router = express.Router()

router.post('/sendOtp', otpRateLimit, sendOtp);
router.post('/verifyOtp', verifyOtp);

module.exports = router;
