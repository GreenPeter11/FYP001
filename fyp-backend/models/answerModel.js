const pool = require('../db');

const createAnswer = async (answer) => {
  const { question_id, user_id, content } = answer;
  const result = await pool.query(
    `INSERT INTO answers (question_id, user_id, content)
     VALUES ($1, $2, $3) RETURNING *`,
    [question_id, user_id, content]
  );
  return result.rows[0];
};

const getAnswersByQuestionId = async (question_id) => {
  const result = await pool.query('SELECT * FROM answers WHERE question_id = $1 ORDER BY created_at ASC', [question_id]);
  return result.rows;
};

const updateAnswer = async (answer_id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in updates) {
    fields.push(`${key} = $${idx}`);
    values.push(updates[key]);
    idx++;
  }
  values.push(answer_id);
  const result = await pool.query(
    `UPDATE answers SET ${fields.join(', ')} WHERE answer_id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0];
};

const deleteAnswer = async (answer_id) => {
  await pool.query('DELETE FROM answers WHERE answer_id = $1', [answer_id]);
};

module.exports = {
  createAnswer,
  getAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
}; 