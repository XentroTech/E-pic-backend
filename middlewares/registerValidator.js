const { body } = require('express-validator');

// Registration validation middleware
exports.registerValidator = [
  // Validate email
  body('email')
    .isEmail().withMessage('Please provide a valid email address'),

  // Validate username (alphanumeric, min 3 chars, max 15 chars)
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 15 }).withMessage('Username must be between 3 and 15 characters')
    .isAlphanumeric().withMessage('Username must contain only letters and numbers'),

  // Validate password (min 6 chars, must contain a number and special character)
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*_]/).withMessage('Password must contain at least one special character'),

   // Validate mobile number
  body('mobile')
    .isMobilePhone().withMessage('Please provide a valid mobile number')
];
