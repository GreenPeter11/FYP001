const pool = require('../db');

const addOrUpdateRating = async ({ project_id, user_id, rating, review_text }) => {
  const result = await pool.query(
    `INSERT INTO project_ratings (project_id, user_id, rating, review_text)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (project_id, user_id)
     DO UPDATE SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [project_id, user_id, rating, review_text]
  );
  return result.rows[0];
};

const getRatingsByProject = async (project_id) => {
  const result = await pool.query('SELECT * FROM project_ratings WHERE project_id = $1', [project_id]);
  return result.rows;
};

module.exports = {
  addOrUpdateRating,
  getRatingsByProject,
}; 