const pool = require('../db');

const addDownload = async ({ project_id, user_id, ip_address, user_agent }) => {
  const result = await pool.query(
    `INSERT INTO project_downloads (project_id, user_id, ip_address, user_agent)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [project_id, user_id, ip_address, user_agent]
  );
  return result.rows[0];
};

const getDownloadsByProject = async (project_id) => {
  const result = await pool.query('SELECT * FROM project_downloads WHERE project_id = $1', [project_id]);
  return result.rows;
};

const getDownloadCountByProject = async (project_id) => {
  const result = await pool.query('SELECT COUNT(*) FROM project_downloads WHERE project_id = $1', [project_id]);
  return parseInt(result.rows[0].count, 10);
};

module.exports = {
  addDownload,
  getDownloadsByProject,
  getDownloadCountByProject,
}; 