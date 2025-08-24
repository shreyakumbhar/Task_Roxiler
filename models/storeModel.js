const pool = require('../db');

async function createStore({ name, email, address,ratings, owner_user_id = null }) {
  const [res] = await pool.query(`INSERT INTO stores (name,email,address,ratings,owner_user_id) VALUES (?,?,?,?,?)`, [name, email, address,ratings, owner_user_id]);
  return { id: res.insertId };
}

async function getStoreById(id) {
  const [rows] = await pool.query(`SELECT * FROM stores WHERE id = ?`, [id]);
  return rows[0];
}

async function listStores({ filter = {}, sort = 'id', order = 'ASC', limit = 100, offset = 0 }) {
  let sql = `SELECT s.*, 
    (SELECT IFNULL(ROUND(AVG(r.rating),2),0) FROM ratings r WHERE r.store_id = s.id) as average_rating
    FROM stores s WHERE 1=1`;
  const params = [];
  if (filter.name) { sql += ' AND s.name LIKE ?'; params.push(`%${filter.name}%`); }
  if (filter.address) { sql += ' AND s.address LIKE ?'; params.push(`%${filter.address}%`); }
  sql += ` ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));
  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = { createStore, getStoreById, listStores };
