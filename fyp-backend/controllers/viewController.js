const viewModel = require('../models/viewModel');

const addView = async (req, res) => {
  try {
    const { project_id, user_id } = req.body;
    const ip_address = req.ip;
    const user_agent = req.headers['user-agent'];
    if (!project_id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }
    const view = await viewModel.addView({ project_id, user_id, ip_address, user_agent });
    res.status(201).json({ message: 'View logged', view });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getViewsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const views = await viewModel.getViewsByProject(projectId);
    res.json({ views });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getViewCountByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const count = await viewModel.getViewCountByProject(projectId);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  addView,
  getViewsByProject,
  getViewCountByProject,
}; 