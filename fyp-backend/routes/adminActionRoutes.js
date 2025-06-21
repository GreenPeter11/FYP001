// routes/adminActionRoutes.js
const express = require('express');
const router = express.Router();
const adminActionController = require('../controllers/adminActionController');
const jwt = require('jsonwebtoken');

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Log admin action (protected)
router.post('/', authenticateToken, adminActionController.logAdminAction);
// Get all admin actions (protected)
router.get('/', authenticateToken, adminActionController.getAdminActions);

module.exports = router; 