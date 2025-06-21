const voteModel = require('../models/voteModel');

const voteQuestion = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { question_id, vote_type } = req.body;
    if (!question_id || !vote_type) {
      return res.status(400).json({ message: 'Question ID and vote type are required' });
    }
    const vote = await voteModel.voteQuestion({ question_id, user_id, vote_type });
    res.status(201).json({ message: 'Vote recorded', vote });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const voteAnswer = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { answer_id, vote_type } = req.body;
    if (!answer_id || !vote_type) {
      return res.status(400).json({ message: 'Answer ID and vote type are required' });
    }
    const vote = await voteModel.voteAnswer({ answer_id, user_id, vote_type });
    res.status(201).json({ message: 'Vote recorded', vote });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  voteQuestion,
  voteAnswer,
}; 