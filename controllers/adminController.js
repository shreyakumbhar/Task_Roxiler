// const pool = require('../db');

// async function getUserRatingForStore(user_id, store_id) {
//   const [rows] = await pool.query(`SELECT * FROM ratings WHERE user_id=? AND store_id=?`, [user_id, store_id]);
//   return rows[0];
// }

// async function createOrUpdateRating({ user_id, store_id, rating, comment }) {
//   // try update
//   const existing = await getUserRatingForStore(user_id, store_id);
//   if (existing) {
//     const [r] = await pool.query(`UPDATE ratings SET rating=?, comment=? WHERE id=?`, [rating, comment, existing.id]);
//     return { updated: true, id: existing.id };
//   } else {
//     const [r] = await pool.query(`INSERT INTO ratings (user_id, store_id, rating, comment) VALUES (?,?,?,?)`, [user_id, store_id, rating, comment]);
//     return { created: true, id: r.insertId };
//   }
// }

// async function listRatingsForStore(store_id, { sort = 'created_at', order = 'DESC', limit = 100, offset = 0 }) {
//   const [rows] = await pool.query(
//     `SELECT r.*, u.name as user_name, u.email as user_email FROM ratings r JOIN users u ON r.user_id=u.id WHERE r.store_id=? ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
//     [store_id, Number(limit), Number(offset)]
//   );
//   return rows;
// }

// async function countRatings() {
//   const [rows] = await pool.query(`SELECT COUNT(*) as cnt FROM ratings`);
//   return rows[0].cnt;
// }

// async function avgRatingForStore(store_id) {
//   const [rows] = await pool.query(`SELECT IFNULL(ROUND(AVG(rating),2),0) as avg_rating FROM ratings WHERE store_id=?`, [store_id]);
//   return rows[0].avg_rating;
// }

// module.exports = { getUserRatingForStore, createOrUpdateRating, listRatingsForStore, countRatings, avgRatingForStore };


const pool = require('../db');

// ---------------- USER MANAGEMENT ----------------
async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)",
      [name, email, password, role || "user"]
    );
    res.status(201).json({ message: "User created", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listUsers(req, res) {
  const [rows] = await pool.query("SELECT id, name, email, role FROM users");
  res.json(rows);
}

async function getUserDetails(req, res) {
  const { id } = req.params;
  const [rows] = await pool.query("SELECT id, name, email, role FROM users WHERE id=?", [id]);
  if (!rows[0]) return res.status(404).json({ message: "User not found" });
  res.json(rows[0]);
}

// ---------------- STORE MANAGEMENT ----------------
async function createStore(req, res) {
  try {
    const { name, location } = req.body;
    const [result] = await pool.query(
      "INSERT INTO stores (name, location) VALUES (?,?)",
      [name, location]
    );
    res.status(201).json({ message: "Store created", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listStores(req, res) {
  const [rows] = await pool.query("SELECT * FROM stores");
  res.json(rows);
}

// ---------------- DASHBOARD ----------------
async function dashboardCounts(req, res) {
  const [[{ cnt: users }]] = await pool.query("SELECT COUNT(*) as cnt FROM users");
  const [[{ cnt: stores }]] = await pool.query("SELECT COUNT(*) as cnt FROM stores");
  const [[{ cnt: ratings }]] = await pool.query("SELECT COUNT(*) as cnt FROM ratings");

  res.json({ users, stores, ratings });
}

// ---------------- EXPORT ----------------
module.exports = {
  createUser,
  listUsers,
  getUserDetails,
  createStore,
  listStores,
  dashboardCounts,
};
