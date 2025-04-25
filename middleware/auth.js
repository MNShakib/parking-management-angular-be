const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
//console.log('JWT_SECRET in auth.js:', process.env.JWT_SECRET);

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(400).json({ message: 'No token provided.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'Invalid token at split.' });

  // console.log('Auth Header:', authHeader);
  // console.log('Token:', token);
  // console.log('JWT_SECRET:', JWT_SECRET);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  // 🔥 Make sure this secret matches
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
