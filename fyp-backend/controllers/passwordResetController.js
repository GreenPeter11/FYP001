const crypto = require('crypto');
const bcrypt = require('bcrypt');
const pool = require('../db');
const passwordResetModel = require('../models/passwordResetModel');
const userModel = require('../models/userModel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const requestReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await passwordResetModel.createResetToken({ user_id: user.user_id, token, expires_at });
    // Send email with reset link (token)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'FYP ResearchHub Password Reset',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset Password</a></p>`
    });
    res.json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;
    const reset = await passwordResetModel.getResetByToken(token);
    if (!reset || reset.used_at || new Date(reset.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const password_hash = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [password_hash, reset.user_id]);
    await passwordResetModel.markResetUsed(reset.reset_id);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  requestReset,
  resetPassword,
}; 