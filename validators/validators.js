const { body } = require('express-validator');

const nameRules = body('name')
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be 20-60 characters');

const addressRules = body('address')
  .optional()
  .isLength({ max: 400 })
  .withMessage('Address must be at most 400 characters');

const emailRule = body('email')
  .isEmail().withMessage('Invalid email');

const passwordRule = body('password')
  .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 chars')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character');

module.exports = {
  signupValidator: [nameRules, emailRule, addressRules, passwordRule],
  loginValidator: [body('email').isEmail(), body('password').exists()],
  createUserByAdminValidator: [nameRules, emailRule, addressRules, passwordRule, body('role').isIn(['admin','user','store_owner'])],
  storeCreateValidator: [
    body('name').isLength({ min: 1 }).withMessage('Store name required'),
    body('email').optional().isEmail(),
    body('address').optional().isLength({ max: 400 })
  ],
  ratingValidator: [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('comment').optional().isLength({ max: 1000 })
  ]
};
