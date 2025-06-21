const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const register = async (req, res) => {
  try {
    const { full_name, email, student_id, password, school, department, role } = req.body;
    if (!full_name || !email || !student_id || !password || !school) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({ full_name, email, student_id, password_hash, school, department, role });
    res.status(201).json({ message: 'User registered successfully', user: { ...user, password_hash: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Login successful', token, user: { ...user, password_hash: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const user = await userModel.findUserById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: { ...user, password_hash: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
}; 