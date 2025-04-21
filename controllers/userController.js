const path = require('path');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, mobile, user_role, password ,organisation_id,super_admin_id,admin_id} = req.body;

  if (!name || !email || !mobile || !password || !organisation_id) {
    return res.status(400).json({ message: 'Name, email, mobile,organisation ID, and password are required.' });
  }
  
 
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters and include uppercase, lowercase letters, and a number.'
    });
  }
  

  try {
    const emailExists = await User.findOne({ email });
    const mobileExists = await User.findOne({ mobile });

    if (emailExists || mobileExists) {
      return res.status(409).json({ message: 'Email or mobile already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePhoto = req.file ? `/uploads/${req.file.filename}` : '';

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      profilePhoto,
      organisation_id,
      super_admin_id: super_admin_id || null,
      admin_id: admin_id || null,
      user_role
    });

    await newUser.save();

    const userToReturn = { ...newUser._doc };
    delete userToReturn.password; // Remove password from response

    res.status(201).json({ message: 'User registered successfully.', user: userToReturn });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  const { name, email, mobile, user_role, page = 1, limit = 10 } = req.body;

  try {
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (mobile) filter.mobile = { $regex: mobile, $options: 'i' };
    if (user_role) filter.user_role = user_role;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalUsers = await User.countDocuments(filter);
    const users = await User.find(filter)
      .skip(skip)
      .limit(parseInt(limit));

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

    res.status(200).json({
      status: 200,
      error: false,
      message: 'Users fetched successfully',
      imageUrl: baseUrl,
      total: totalUsers,
      page: parseInt(page),
      limit: parseInt(limit),
      data: users
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: true,
      message: 'Failed to fetch users',
      imageUrl: null,
      data: []
    });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.user_role },
      'your_jwt_secret_key', // Replace with env variable later
      { expiresIn: '1h' }
    );

    const userToReturn = { ...user._doc };
    delete userToReturn.password;

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: userToReturn
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required in request body' });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userToReturn = { ...user._doc };
    delete userToReturn.password;

    res.status(200).json({
      status: 200,
      error: false,
      message: 'User fetched successfully',
      data: userToReturn
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: true,
      message: 'Failed to fetch user',
      data: null
    });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required in request body' });
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }

    res.status(200).json({
      status: 200,
      error: false,
      message: 'User deleted successfully',
      data: {
        id: user._id,
        name: user.name
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: true,
      message: 'Failed to delete user',
      data: null
    });
  }
};

const updateUserById = async (req, res) => {
  const { id, name, email, mobile, user_role, status } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (user_role) user.user_role = user_role;
    if (status) user.status = status;

    if (req.file) {
      user.profilePhoto = `/uploads/${req.file.filename}`;
    }

    await user.save();

    const userToReturn = { ...user._doc };
    delete userToReturn.password;

    res.status(200).json({
      status: 200,
      error: false,
      message: 'User updated successfully',
      data: userToReturn
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: true,
      message: 'Failed to update user',
      data: null
    });
  }
};





module.exports = { registerUser, getAllUsers ,loginUser ,getUserById , deleteUserById , updateUserById};
