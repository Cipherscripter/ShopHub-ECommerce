const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

const orderValidation = [
  body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
  body('shippingAddress.address').notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone number is required'),
  body('paymentMethod').isIn(['stripe', 'mock', 'cod']).withMessage('Invalid payment method'),
];

router.get('/my',  protect, getMyOrders);
router.get('/',    protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrderById);

router.post('/', protect, orderValidation, validate, createOrder);

router.put('/:id/pay',    protect, updateOrderToPaid);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
