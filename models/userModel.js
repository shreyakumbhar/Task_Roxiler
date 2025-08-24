const pool = require('../db');

async function createUser({ name, email, password, address, role = 'user', store_id = null }) {
  const [res] = await pool.query(
    `INSERT INTO users (name,email,password,address,role,store_id) VALUES (?,?,?,?,?,?)`,
    [name, email, password, address, role, store_id]
  );
  return { id: res.insertId };
}

async function findUserByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await pool.query(`SELECT id,name,email,address,role,store_id,created_at FROM users WHERE id = ?`, [id]);
  return rows[0];
}

async function updatePassword(id, hashed) {
  await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [hashed, id]);
}

async function listUsers({ filter = {}, sort = 'id', order = 'ASC', limit = 100, offset = 0 }) {
  let sql = `SELECT id,name,email,address,role,store_id,created_at FROM users WHERE 1=1`;
  const params = [];
  if (filter.name) { sql += ' AND name LIKE ?'; params.push(`%${filter.name}%`); }
  if (filter.email) { sql += ' AND email LIKE ?'; params.push(`%${filter.email}%`); }
  if (filter.address) { sql += ' AND address LIKE ?'; params.push(`%${filter.address}%`); }
  if (filter.role) { sql += ' AND role = ?'; params.push(filter.role); }
  sql += ` ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));
  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = { createUser, findUserByEmail, findUserById, updatePassword, listUsers };
