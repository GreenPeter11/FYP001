const pool = require('../db');

const addBookmark = async ({ user_id, project_id, question_id }) => {
  const result = await pool.query(
    `INSERT INTO bookmarks (user_id, project_id, question_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, project_id) DO NOTHING
     RETURNING *`,
    [user_id, project_id || null, question_id || null]
  );
  return result.rows[0];
};

const removeBookmark = async (bookmark_id) => {
  await pool.query('DELETE FROM bookmarks WHERE bookmark_id = $1', [bookmark_id]);
};

const getBookmarksByUser = async (user_id) => {
  const result = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1', [user_id]);
  return result.rows;
};

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarksByUser,
}; 