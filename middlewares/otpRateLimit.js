const rateLimit = require('express-rate-limit');

const otpRequestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 times 
    
    message: 'Too many OTP requests, please try again after 15 minutes',
});

module.exports = otpRequestLimiter;