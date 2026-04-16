const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  updateProfile,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/',           protect, authorize('admin'), getAllUsers);
router.get('/:id',        protect, authorize('admin'), getUserById);
router.put('/:id',        protect, authorize('admin'), updateUserRole);
router.delete('/:id',     protect, authorize('admin'), deleteUser);
router.put('/profile/me', protect, updateProfile);

module.exports = router;
