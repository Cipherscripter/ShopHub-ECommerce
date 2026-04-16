const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// Tax rate constant (18% GST)
const TAX_RATE = 0.18;
// Free shipping above ₹999
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 99;

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('No items in cart');
  }

  // Validate stock and build order items
  const orderItems = [];
  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      res.status(404);
      throw new Error('One or more products no longer exist');
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for "${product.name}"`);
    }

    orderItems.push({
      product:  product._id,
      name:     product.name,
      image:    product.images[0]?.url || '',
      price:    product.price,
      quantity: item.quantity,
    });
  }

  // Calculate prices
  const itemsPrice    = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const taxPrice      = parseFloat((itemsPrice * TAX_RATE).toFixed(2));
  const totalPrice    = parseFloat((itemsPrice + shippingPrice + taxPrice - (cart.discount || 0)).toFixed(2));

  // Create order
  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    discount: cart.discount || 0,
  });

  // Decrement stock for each product
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear the cart after order is placed
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(201).json({ success: true, order });
});

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/my
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip  = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user.id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ user: req.user.id }),
  ]);

  res.json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    orders,
  });
});

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Users can only see their own orders; admins can see all
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});

/**
 * @desc    Mark order as paid (called after payment confirmation)
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = 'processing';
  order.paymentResult = {
    id:         req.body.id,
    status:     req.body.status,
    updateTime: req.body.update_time,
    email:      req.body.payer?.email_address,
  };

  const updatedOrder = await order.save();
  res.json({ success: true, order: updatedOrder });
});

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = status;

  if (status === 'delivered') {
    order.deliveredAt = Date.now();
  }

  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  // Manually push to statusHistory with optional note
  order.statusHistory.push({ status, note: note || '' });

  // Prevent double-push from pre-save hook
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      orderStatus: status,
      deliveredAt: status === 'delivered' ? Date.now() : order.deliveredAt,
      trackingNumber: trackingNumber || order.trackingNumber,
      $push: { statusHistory: { status, note: note || '' } },
    },
    { new: true }
  );

  res.json({ success: true, order: updatedOrder });
});

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const page   = parseInt(req.query.page)   || 1;
  const limit  = parseInt(req.query.limit)  || 20;
  const status = req.query.status;
  const skip   = (page - 1) * limit;

  const query = status ? { orderStatus: status } : {};

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Order.countDocuments(query),
  ]);

  // Revenue summary
  const revenue = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  res.json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    revenue: revenue[0]?.total || 0,
    orders,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getAllOrders,
};
