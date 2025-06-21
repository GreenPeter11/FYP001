const projectModel = require('../models/projectModel');

const createProject = async (req, res) => {
  try {
    const project = req.body;
    // Optionally, get user_id from req.user if using auth
    const newProject = await projectModel.createProject(project);
    res.status(201).json({ message: 'Project created', project: newProject });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await projectModel.getAllProjects();
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await projectModel.getProjectById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await projectModel.updateProject(id, updates);
    res.json({ message: 'Project updated', project: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await projectModel.deleteProject(id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
}; 