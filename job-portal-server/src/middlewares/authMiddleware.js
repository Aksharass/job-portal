// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET; // ✅ matches your .env key

console.log('Loaded SECRET_KEY:', SECRET_KEY ? 'OK' : 'MISSING!');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization'); // "Bearer <token>"
  console.log('Token received:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // ✅ Extract token only

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    console.log('Verified user:', verified); // contains id, role, etc.
    req.user = verified;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isEmployer = (req, res, next) => {
  console.log('User role:', req.user?.role);
  if (req.user?.role !== 'employer') {
    return res.status(403).json({ message: 'Access denied. Employers only.' });
  }
  next();
};

const protect = (req, res, next) => {
  next();
};

module.exports = {
  verifyToken,
  isEmployer,
  protect,
};
