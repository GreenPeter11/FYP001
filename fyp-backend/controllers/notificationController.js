const notificationModel = require('../models/notificationModel');

const getNotificationsByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const notifications = await notificationModel.getNotificationsByUser(user_id);
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationModel.markAsRead(id);
    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getNotificationsByUser,
  markAsRead,
}; 