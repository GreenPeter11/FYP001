const questionModel = require('../models/questionModel');

const createQuestion = async (req, res) => {
  try {
    const question = req.body;
    // Optionally, get user_id from req.user if using auth
    const newQuestion = await questionModel.createQuestion(question);
    res.status(201).json({ message: 'Question created', question: newQuestion });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await questionModel.getAllQuestions();
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await questionModel.getQuestionById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ question });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await questionModel.updateQuestion(id, updates);
    res.json({ message: 'Question updated', question: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await questionModel.deleteQuestion(id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
}; 