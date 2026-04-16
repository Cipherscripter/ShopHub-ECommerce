const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../config/cloudinary');

/**
 * @desc    Upload images to Cloudinary
 * @route   POST /api/upload
 * @access  Private/Admin
 */
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const images = req.files.map((file) => ({
    public_id: file.filename,
    url: file.path,
  }));

  res.json({ success: true, images });
});

/**
 * @desc    Delete image from Cloudinary
 * @route   DELETE /api/upload/:publicId
 * @access  Private/Admin
 */
const deleteImage = asyncHandler(async (req, res) => {
  const publicId = decodeURIComponent(req.params.publicId);
  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, message: 'Image deleted' });
});

module.exports = { uploadImages, deleteImage };
