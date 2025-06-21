const pool = require('../db');

const createUser = async (user) => {
  const { full_name, email, student_id, password_hash, school, department, role } = user;
  const result = await pool.query(
    `INSERT INTO users (full_name, email, student_id, password_hash, school, department, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [full_name, email, student_id, password_hash, school, department, role || 'student']
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findUserById = async (user_id) => {
  const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
}; 