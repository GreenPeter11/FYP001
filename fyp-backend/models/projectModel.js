const pool = require('../db');

const createProject = async (project) => {
  const {
    title, abstract, full_description, user_id, school, department, submission_year,
    keywords, supervisor_names, team_members, project_file_path, project_file_size, status
  } = project;
  const result = await pool.query(
    `INSERT INTO projects (title, abstract, full_description, user_id, school, department, submission_year, keywords, supervisor_names, team_members, project_file_path, project_file_size, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [title, abstract, full_description, user_id, school, department, submission_year, keywords, supervisor_names, team_members, project_file_path, project_file_size, status || 'pending']
  );
  return result.rows[0];
};

const getAllProjects = async () => {
  const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
  return result.rows;
};

const getProjectById = async (project_id) => {
  const result = await pool.query('SELECT * FROM projects WHERE project_id = $1', [project_id]);
  return result.rows[0];
};

const updateProject = async (project_id, updates) => {
  // Only allow certain fields to be updated
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in updates) {
    fields.push(`${key} = $${idx}`);
    values.push(updates[key]);
    idx++;
  }
  values.push(project_id);
  const result = await pool.query(
    `UPDATE projects SET ${fields.join(', ')} WHERE project_id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0];
};

const deleteProject = async (project_id) => {
  await pool.query('DELETE FROM projects WHERE project_id = $1', [project_id]);
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
}; 