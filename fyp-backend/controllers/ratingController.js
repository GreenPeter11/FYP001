const ratingModel = require('../models/ratingModel');

const addOrUpdateRating = async (req, res) => {
  try {
    const { project_id, rating, review_text } = req.body;
    const user_id = req.user.user_id;
    if (!project_id || !rating) {
      return res.status(400).json({ message: 'Project ID and rating are required' });
    }
    const newRating = await ratingModel.addOrUpdateRating({ project_id, user_id, rating, review_text });
    res.status(201).json({ message: 'Rating submitted', rating: newRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getRatingsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const ratings = await ratingModel.getRatingsByProject(projectId);
    res.json({ ratings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  addOrUpdateRating,
  getRatingsByProject,
}; 