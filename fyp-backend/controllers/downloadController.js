const downloadModel = require('../models/downloadModel');

const addDownload = async (req, res) => {
  try {
    const { project_id, user_id } = req.body;
    const ip_address = req.ip;
    const user_agent = req.headers['user-agent'];
    if (!project_id || !user_id) {
      return res.status(400).json({ message: 'Project ID and user ID are required' });
    }
    const download = await downloadModel.addDownload({ project_id, user_id, ip_address, user_agent });
    res.status(201).json({ message: 'Download logged', download });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getDownloadsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const downloads = await downloadModel.getDownloadsByProject(projectId);
    res.json({ downloads });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getDownloadCountByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const count = await downloadModel.getDownloadCountByProject(projectId);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  addDownload,
  getDownloadsByProject,
  getDownloadCountByProject,
}; 