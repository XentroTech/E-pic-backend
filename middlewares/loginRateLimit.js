const rateLimit = require('express-rate-limit');

const loginRequestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // 3 times 
    message: 'Too many Login requests, please try again later',
});

module.exports = loginRequestLimiter;