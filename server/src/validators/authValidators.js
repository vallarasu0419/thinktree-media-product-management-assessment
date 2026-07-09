const { body } = require('express-validator');

const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/~`;']/;

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must include at least 1 uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must include at least 1 lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must include at least 1 number')
    .matches(SPECIAL_CHAR_REGEX)
    .withMessage('Password must include at least 1 special character'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerRules, loginRules };
