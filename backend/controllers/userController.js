const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * @desc    Get all users (Admin)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip  = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select('-password').skip(skip).limit(limit).sort('-createdAt'),
    User.countDocuments(),
  ]);

  res.json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    users,
  });
});

/**
 * @desc    Get single user by ID (Admin)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
});

/**
 * @desc    Update user role (Admin)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = req.body.role || user.role;
  await user.save();

  res.json({ success: true, message: 'User role updated', user });
});

/**
 * @desc    Delete user (Admin)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  res.json({ success: true, message: 'User deleted successfully' });
});

/**
 * @desc    Update own profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  user.name  = req.body.name  || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password; // pre-save hook will hash it
  }

  const updated = await user.save();

  res.json({
    success: true,
    user: {
      id:    updated._id,
      name:  updated.name,
      email: updated.email,
      role:  updated.role,
      avatar: updated.avatar,
    },
  });
});

module.exports = { getAllUsers, getUserById, updateUserRole, deleteUser, updateProfile };
