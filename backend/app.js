const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-render-url.onrender.com'],
  credentials: true,
}));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// API routes (твой backend)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from server' });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});