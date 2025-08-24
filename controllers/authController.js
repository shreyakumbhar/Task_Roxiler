








const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';

// ================== SIGNUP ==================
async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    const [existing] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)',
      [name, email, hashedPassword, role || null]
    );

    return res.status(201).json({ message: 'User registered', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// ================== LOGIN ==================
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email , role: user.role}, JWT_SECRET, { expiresIn: '1h' });

    return res.json({ token, message: 'Login successful',success:true,user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// ================== CHANGE PASSWORD ==================
async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    const validPass = await bcrypt.compare(oldPassword, user.password);
    if (!validPass) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password=? WHERE id=?', [hashed, userId]);

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { signup, login, changePassword };
