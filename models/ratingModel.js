const pool = require('../db');

async function getUserRatingForStore(user_id, store_id) {
  const [rows] = await pool.query(`SELECT * FROM ratings WHERE user_id=? AND store_id=?`, [user_id, store_id]);
  return rows[0];
}

async function createOrUpdateRating({ user_id, store_id, rating, comment }) {
  // try update
  const existing = await getUserRatingForStore(user_id, store_id);
  if (existing) {
    const [r] = await pool.query(`UPDATE ratings SET rating=?, WHERE id=?`, [rating, comment, existing.id]);
    return { updated: true, id: existing.id };
  } else {
    const [r] = await pool.query(`INSERT INTO ratings (user_id, store_id, rating) VALUES (?,?,?)`, [user_id, store_id, rating]);
    return { created: true, id: r.insertId };
  }
}

async function listRatingsForStore(store_id, { sort = 'created_at', order = 'DESC', limit = 100, offset = 0 }) {
  const [rows] = await pool.query(
    `SELECT r.*, u.name as user_name, u.email as user_email FROM ratings r JOIN users u ON r.user_id=u.id WHERE r.store_id=? ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
    [store_id, Number(limit), Number(offset)]
  );
  return rows;
}

async function countRatings() {
  const [rows] = await pool.query(`SELECT COUNT(*) as cnt FROM ratings`);
  return rows[0].cnt;
}

async function avgRatingForStore(store_id) {
  const [rows] = await pool.query(`SELECT IFNULL(ROUND(AVG(rating),2),0) as avg_rating FROM ratings WHERE store_id=?`, [store_id]);
  return rows[0].avg_rating;
}

module.exports = { getUserRatingForStore, createOrUpdateRating, listRatingsForStore, countRatings, avgRatingForStore };
