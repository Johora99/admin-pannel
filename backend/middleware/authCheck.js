// middleware/authCheck.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function jwtAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
async function checkUserExistsAndNotBlocked(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('_id status');
    if (!user) {
      return res.status(401).json({ message: 'User not found. Please login.' });
    }
    if (user.status === 'deleted') {
      return res.status(401).json({ message: 'User deleted. Please login again.' });
    }
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'User blocked.' });
    }
    req.userStatus = user.status;
    next();
  } catch (e) {
    console.error('Error in checkUserExistsAndNotBlocked:', e);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { jwtAuth, checkUserExistsAndNotBlocked };
