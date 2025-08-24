const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');

router.get('/', auth, storeController.listStores); // accessible to logged users; you can also allow public by removing auth
router.get('/owner-dashboard', auth, roles(['store_owner']), storeController.ownerDashboard);

module.exports = router;
