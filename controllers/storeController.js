const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');

exports.listStores = async (req, res) => {
  const { name, address,ratings, sort = 'id', order = 'ASC', limit = 100, offset = 0 } = req.query;
  try {
    const rows = await storeModel.listStores({ filter: { name, address,ratings }, sort, order, limit, offset });
    // for each store, optionally include user's own rating if user is logged in
    if (req.user) {
      const userId = req.user.id;
      const withUserRatings = await Promise.all(rows.map(async s => {
        const ur = await require('../models/ratingModel').getUserRatingForStore(userId, s.id);
        return { ...s, user_rating: ur ? ur.rating : null, user_rating_id: ur ? ur.id : null };
      }));
      return res.json(withUserRatings);
    }
    res.json(rows);
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

exports.ownerDashboard = async (req, res) => {
  // store_owner should have store_id in their user record, or we accept query store_id
  const userId = req.user.id;
  const { store_id } = req.query;
  const storeId = store_id; // expected to be passed or user.store_id in DB (not implemented fetch here)
  if (!storeId) return res.status(400).json({ message: 'store_id required' });
  try {
    const ratings = await ratingModel.listRatingsForStore(storeId, { sort: 'created_at', order: 'DESC', limit: 1000, offset: 0 });
    const avg = await ratingModel.avgRatingForStore(storeId);
    res.json({ average_rating: avg, ratings });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};
