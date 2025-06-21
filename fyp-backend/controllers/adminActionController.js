const adminActionModel = require('../models/adminActionModel');

const logAdminAction = async (req, res) => {
  try {
    const admin_user_id = req.user.user_id;
    const { action_type, target_user_id, target_project_id, target_question_id, target_answer_id, reason } = req.body;
    if (!action_type) {
      return res.status(400).json({ message: 'Action type is required' });
    }
    const action = await adminActionModel.logAdminAction({
      admin_user_id,
      action_type,
      target_user_id,
      target_project_id,
      target_question_id,
      target_answer_id,
      reason
    });
    res.status(201).json({ message: 'Admin action logged', action });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAdminActions = async (req, res) => {
  try {
    const actions = await adminActionModel.getAdminActions();
    res.json({ actions });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  logAdminAction,
  getAdminActions,
}; 