// routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
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

// Add or update rating (protected)
router.post('/', authenticateToken, ratingController.addOrUpdateRating);
// Get ratings for a project
router.get('/:projectId', ratingController.getRatingsByProject);

module.exports = router; 