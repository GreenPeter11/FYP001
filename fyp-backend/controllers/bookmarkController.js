const bookmarkModel = require('../models/bookmarkModel');

const addBookmark = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { project_id, question_id } = req.body;
    if (!project_id && !question_id) {
      return res.status(400).json({ message: 'Project ID or Question ID is required' });
    }
    const bookmark = await bookmarkModel.addBookmark({ user_id, project_id, question_id });
    res.status(201).json({ message: 'Bookmark added', bookmark });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const removeBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    await bookmarkModel.removeBookmark(id);
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getBookmarksByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const bookmarks = await bookmarkModel.getBookmarksByUser(user_id);
    res.json({ bookmarks });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  addBookmark,
  removeBookmark,
  getBookmarksByUser,
}; 