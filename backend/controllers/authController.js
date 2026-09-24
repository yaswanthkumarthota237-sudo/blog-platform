const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.status(201).json({
      token: sign(user._id),
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: 'Invalid credentials' });
    res.json({
      token: sign(user._id),
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
};

exports.updateMe = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const update = {};
    if (username) update.username = username;
    if (email) update.email = email;
    if (password) update.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.userId, update, {
      new: true
    }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMe = async (req, res) => {
  await Comment.deleteMany({ author: req.userId });
  await Post.deleteMany({ author: req.userId });
  await User.findByIdAndDelete(req.userId);
  res.json({ message: 'Account deleted' });
};
