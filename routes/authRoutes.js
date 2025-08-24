
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { signupValidator, loginValidator } = require('../validators/validators');
const auth = require('../middlewares/auth');

// Routes
router.post('/signup', signupValidator, authController.signup);
router.post('/login', loginValidator, authController.login);
router.post('/change-password', auth, authController.changePassword);

module.exports = router;
