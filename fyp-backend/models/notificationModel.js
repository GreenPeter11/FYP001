const pool = require('../db');

const getNotificationsByUser = async (user_id) => {
  const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
  return result.rows;
};

const markAsRead = async (notification_id) => {
  const result = await pool.query('UPDATE notifications SET is_read = TRUE WHERE notification_id = $1 RETURNING *', [notification_id]);
  return result.rows[0];
};

module.exports = {
  getNotificationsByUser,
  markAsRead,
}; 