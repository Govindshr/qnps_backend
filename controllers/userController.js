const path = require('path');
const User = require('../models/User');

const registerUser = async (req, res) => {
  const { name, email, mobile, user_role } = req.body;
  if (!name || !email || !mobile) {
    return res.status(400).json({ message: 'Name, email, and mobile are required.' });
  }
  try {
    const emailExists = await User.findOne({ email });
    const mobileExists = await User.findOne({ mobile });
    if (emailExists || mobileExists) {
      return res.status(409).json({ message: 'Email or mobile already registered.' });
    }
    const profilePhoto = req.file ? `/uploads/${req.file.filename}` : '';
    const newUser = new User({ name, email, mobile, profilePhoto, user_role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

module.exports = { registerUser, getAllUsers };
