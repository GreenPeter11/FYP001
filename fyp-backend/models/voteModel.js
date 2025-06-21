const pool = require('../db');

const voteQuestion = async ({ question_id, user_id, vote_type }) => {
  const result = await pool.query(
    `INSERT INTO question_votes (question_id, user_id, vote_type)
     VALUES ($1, $2, $3)
     ON CONFLICT (question_id, user_id)
     DO UPDATE SET vote_type = EXCLUDED.vote_type, created_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [question_id, user_id, vote_type]
  );
  return result.rows[0];
};

const voteAnswer = async ({ answer_id, user_id, vote_type }) => {
  const result = await pool.query(
    `INSERT INTO answer_votes (answer_id, user_id, vote_type)
     VALUES ($1, $2, $3)
     ON CONFLICT (answer_id, user_id)
     DO UPDATE SET vote_type = EXCLUDED.vote_type, created_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [answer_id, user_id, vote_type]
  );
  return result.rows[0];
};

module.exports = {
  voteQuestion,
  voteAnswer,
}; 