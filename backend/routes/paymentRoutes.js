const express = require('express');
const {
  createPaymentIntent,
  mockPayment,
  stripeWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Stripe webhook needs raw body — must be before express.json() parses it
// This is handled by using express.raw() specifically for this route in server.js
// For simplicity here, we register it normally
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/mock',                  protect, mockPayment);

module.exports = router;
