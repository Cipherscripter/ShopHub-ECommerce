const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFeaturedProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
];

router.get('/featured', getFeaturedProducts);
router.get('/',         getProducts);
router.get('/:id',      getProductById);

router.post(
  '/',
  protect,
  authorize('admin'),
  upload.array('images', 5),
  productValidation,
  validate,
  createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.array('images', 5),
  updateProduct
);

router.delete('/:id', protect, authorize('admin'), deleteProduct);

router.post(
  '/:id/reviews',
  protect,
  reviewValidation,
  validate,
  createProductReview
);

module.exports = router;
