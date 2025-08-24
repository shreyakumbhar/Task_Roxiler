const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middlewares/auth');
const { ratingValidator } = require('../validators/validators');

router.post('/:store_id', auth, ratingValidator, ratingController.submitOrUpdateRating);
router.get('/:store_id/my', auth, ratingController.getUserRatingForStore,);

module.exports = router;
