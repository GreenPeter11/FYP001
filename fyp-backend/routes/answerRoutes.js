const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
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

// Update answer
router.put('/:id', authenticateToken, answerController.updateAnswer);
// Delete answer
router.delete('/:id', authenticateToken, answerController.deleteAnswer);

module.exports = router; 