//  const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
//   const token = authHeader.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = payload; // { id, role, iat, exp }
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };



const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔑 Attach user info to request
    req.user = decoded;
 console.log("req.user :", req.user.role); 
    console.log("Decoded User:", decoded); 
    // check in console
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};
