// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const { signupValidator, loginValidator } = require('../validators/validators');
// const { validationResult } = require('express-validator');

// router.post('/signup', signupValidator, authController.signup);
// router.post('/login', loginValidator, authController.login);

// // change password (all logged-in users)
// const auth = require('../middlewares/auth');
// router.post('/change-password', auth, authController.changePassword);

// module.exports = router;






// const express = require('express');
// const router = express.Router();

// const authController = require('../controllers/authController');

// // temp no validators, no auth
// router.post('/signup', authController.signup);
// router.post('/login', authController.login);
// router.post('/change-password', authController.changePassword);

// module.exports = router;

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
