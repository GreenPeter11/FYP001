const pool = require('../db');

const createQuestion = async (question) => {
  const { title, content, user_id, school, tags } = question;
  const result = await pool.query(
    `INSERT INTO questions (title, content, user_id, school, tags)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, content, user_id, school, tags]
  );
  return result.rows[0];
};

const getAllQuestions = async () => {
  const result = await pool.query('SELECT * FROM questions ORDER BY created_at DESC');
  return result.rows;
};

const getQuestionById = async (question_id) => {
  const result = await pool.query('SELECT * FROM questions WHERE question_id = $1', [question_id]);
  return result.rows[0];
};

const updateQuestion = async (question_id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in updates) {
    fields.push(`${key} = $${idx}`);
    values.push(updates[key]);
    idx++;
  }
  values.push(question_id);
  const result = await pool.query(
    `UPDATE questions SET ${fields.join(', ')} WHERE question_id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0];
};

const deleteQuestion = async (question_id) => {
  await pool.query('DELETE FROM questions WHERE question_id = $1', [question_id]);
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
}; 