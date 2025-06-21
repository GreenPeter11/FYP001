// index.js
// Main entry point for the backend server. 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const viewRoutes = require('./routes/viewRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const voteRoutes = require('./routes/voteRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminActionRoutes = require('./routes/adminActionRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FYP ResearchHub Backend API is running!');
});

// TODO: Add routes here
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/views', viewRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin-actions', adminActionRoutes);
app.use('/api/password-reset', passwordResetRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 