// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendConfirmationEmail } = require('../utils/mailer');
const { jwtAuth, checkUserExistsAndNotBlocked } = require('../middleware/authCheck');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, password required.' });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      normalizedEmail: email.trim().toLowerCase(),
      passwordHash,
      status: 'unverified',
    });

    await newUser.save();

    res.json({ message: 'Registered. Confirmation email will be sent.' });

    // send email asynchronously
    (async () => {
      try {
        const token = jwt.sign({ email: newUser.email }, process.env.EMAIL_TOKEN_SECRET, { expiresIn: '7d' });
      // Link should hit backend /confirm-email
     const link = `${process.env.BACKEND_URL}/api/auth/confirm-email?token=${token}`;
    await sendConfirmationEmail(newUser.email, link);
      } catch (e) {
        console.error('Email sending failed:', e);
      }
    })();

  } catch (err) {
    console.error(err);
    if (err.code === 11000)
      return res.status(400).json({ message: 'Email already exists.' });
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// CONFIRM EMAIL
router.get('/confirm-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send('Invalid link');

    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
    const user = await User.findOne({ normalizedEmail: decoded.email.toLowerCase() });
    if (!user) return res.status(404).send('User not found');

    if (user.status === 'unverified') {
      user.status = 'active';
      await user.save();
    }

    // Redirect to frontend login page with query param
    res.redirect(`${process.env.FRONTEND_URL}/?verified=true`);
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid or expired token');
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const normalized = email.trim().toLowerCase();
    const user = await User.findOne({ normalizedEmail: normalized });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Check if deleted
    if (user.status === 'deleted') {
      return res.status(401).json({ message: 'Account does not exist. Please register again.' });
    }
    // Check if blocked
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked.' });
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Send token + email as response
    res.json({
      token,
      email: user.email,
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Login failed.' });
  }
});


router.get('/me', jwtAuth, checkUserExistsAndNotBlocked, async (req, res) => {
  const user = await User.findById(req.userId).select('-passwordHash');
  res.json({ user });
});


module.exports = router;
