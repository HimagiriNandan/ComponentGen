import User from '../Model/userSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
const router = Router();
import dotenv from 'dotenv';
dotenv.config();
import authMiddleware from '../Middleware/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

function sendToken(user, res) {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    sendToken(user, res);
    res.status(200).json({ message: 'User registered successfully', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    sendToken(user, res);
    res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { id, name, email } = req.user;
    res.status(200).json({
      user: { id, name, email }
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default router; 