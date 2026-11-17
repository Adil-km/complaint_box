const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const geminiRoutes = require('./routes/geminiRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/chat', geminiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Complaint Box API is running on Vercel' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;