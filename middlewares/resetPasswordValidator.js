const { body } = require('express-validator');

// Validation middleware for login
exports.resetPasswordValidator = [
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];