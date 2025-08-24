const { validationResult } = require('express-validator');
const ratingModel = require('../models/ratingModel');
const storeModel = require('../models/storeModel');

exports.submitOrUpdateRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const user_id = req.user.id;
  const { store_id } = req.params;
  const { rating } = req.body;

  // ensure store exists
  const store = await storeModel.getStoreById(store_id);
  if (!store) return res.status(404).json({ message: 'Store not found' });

  try {
    const result = await ratingModel.createOrUpdateRating({ user_id, store_id, rating });
    res.json({ message: 'Rating submitted', result });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserRatingForStore = async (req, res) => {
  const user_id = req.user.id;
  const { store_id } = req.params;
  const rating = await ratingModel.getUserRatingForStore(user_id, store_id);
  res.json({ rating });
};
