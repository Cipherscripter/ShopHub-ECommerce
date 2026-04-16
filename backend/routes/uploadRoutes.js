const express = require('express');
const { uploadImages, deleteImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('admin'),
  upload.array('images', 5),
  uploadImages
);

router.delete('/:publicId', protect, authorize('admin'), deleteImage);

module.exports = router;
