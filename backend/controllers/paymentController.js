const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

/**
 * @desc    Create Stripe payment intent
 * @route   POST /api/payment/create-payment-intent
 * @access  Private
 */
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Ensure the order belongs to the requesting user
  if (order.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  // Create Stripe PaymentIntent (amount in cents)
  const paymentIntent = await stripe.paymentIntents.create({
    amount:   Math.round(order.totalPrice * 100),
    currency: 'inr',
    metadata: {
      orderId:  order._id.toString(),
      userId:   req.user.id,
    },
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

/**
 * @desc    Mock payment (for testing without Stripe)
 * @route   POST /api/payment/mock
 * @access  Private
 */
const mockPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mark order as paid
  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = 'processing';
  order.paymentResult = {
    id:         `mock_${Date.now()}`,
    status:     'COMPLETED',
    updateTime: new Date().toISOString(),
    email:      req.user.email,
  };

  await order.save();

  res.json({ success: true, message: 'Payment successful', order });
});

/**
 * @desc    Stripe webhook handler
 * @route   POST /api/payment/webhook
 * @access  Public (Stripe signature verified)
 */
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    await Order.findByIdAndUpdate(orderId, {
      isPaid:        true,
      paidAt:        Date.now(),
      orderStatus:   'processing',
      paymentResult: {
        id:         paymentIntent.id,
        status:     paymentIntent.status,
        updateTime: new Date().toISOString(),
      },
    });
  }

  res.json({ received: true });
});

module.exports = { createPaymentIntent, mockPayment, stripeWebhook };
