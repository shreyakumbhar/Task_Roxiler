const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');
const { createUserByAdminValidator, storeCreateValidator } = require('../validators/validators');

router.use(auth, roles(['admin']));

router.post('/users', createUserByAdminValidator, adminController.createUser);
router.post('/stores', storeCreateValidator, adminController.createStore);
router.get('/dashboard-counts', adminController.dashboardCounts);
router.get('/users', adminController.listUsers);
router.get('/stores', adminController.listStores);
router.get('/users/:id', adminController.getUserDetails);

module.exports = router;
