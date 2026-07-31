const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Check if system default user exists, if not seed admin
    let user = await User.findOne({ email });
    if (!user && email === 'admin@cime.edu') {
      user = await User.create({
        email: 'admin@cime.edu',
        password: 'password',
        role: role || 'admin',
        name: 'Firoj Naik'
      });
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: role || user.role,
        name: user.name
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
