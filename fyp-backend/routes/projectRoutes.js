const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
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

// Get all projects
router.get('/', projectController.getAllProjects);
// Get single project
router.get('/:id', projectController.getProjectById);
// Create project (protected)
router.post('/', authenticateToken, projectController.createProject);
// Update project (protected)
router.put('/:id', authenticateToken, projectController.updateProject);
// Delete project (protected)
router.delete('/:id', authenticateToken, projectController.deleteProject);

module.exports = router; 