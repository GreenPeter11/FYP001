const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');
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

// Log a download (protected)
router.post('/', authenticateToken, downloadController.addDownload);
// Get all downloads for a project
router.get('/:projectId', downloadController.getDownloadsByProject);
// Get download count for a project
router.get('/:projectId/count', downloadController.getDownloadCountByProject);

module.exports = router; 