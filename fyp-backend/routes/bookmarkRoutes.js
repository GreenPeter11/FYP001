const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
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

// Add bookmark (protected)
router.post('/', authenticateToken, bookmarkController.addBookmark);
// Remove bookmark (protected)
router.delete('/:id', authenticateToken, bookmarkController.removeBookmark);
// Get bookmarks for user (protected)
router.get('/me', authenticateToken, bookmarkController.getBookmarksByUser);

module.exports = router; 