require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const connectDB = require('./config/db');
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('Cohort ERP API is running dynamically...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
