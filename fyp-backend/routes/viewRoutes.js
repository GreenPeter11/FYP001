const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

// Log a view
router.post('/', viewController.addView);
// Get all views for a project
router.get('/:projectId', viewController.getViewsByProject);
// Get view count for a project
router.get('/:projectId/count', viewController.getViewCountByProject);

module.exports = router; 