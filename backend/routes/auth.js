const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token payload
    const payload = { 
      user: { 
        id: user.id,
        username: user.username 
      } 
    };

    // Sign the token
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '2h' }
    );
    
    return res.json({ token });
  } catch (err) {
    console.error('Error in /login:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: 'User already exists with that username or email' });
    }

    // Create a new user
    user = new User({
      username,
      email,
      password
    });

    // Save user to database (password will be hashed by pre-save hook)
    await user.save();

    // Create JWT token payload
    const payload = { 
      user: { 
        id: user.id,
        username: user.username 
      } 
    };

    // Sign the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '2h' }
    );

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Error in /register:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
