
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
