const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    'items.product',
    'name images price stock'
  );

  if (!cart) {
    return res.json({ success: true, cart: { items: [], totalPrice: 0, totalItems: 0 } });
  }

  res.json({ success: true, cart });
});

/**
 * @desc    Add item to cart (or increase quantity if already exists)
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Validate product exists and has enough stock
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} units available in stock`);
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user: req.user.id,
      items: [{ product: productId, quantity, price: product.price }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Check stock for updated quantity
      const newQty = existingItem.quantity + quantity;
      if (product.stock < newQty) {
        res.status(400);
        throw new Error(`Only ${product.stock} units available in stock`);
      }
      existingItem.quantity = newQty;
      existingItem.price    = product.price; // Refresh price
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
  }

  await cart.populate('items.product', 'name images price stock');

  res.json({ success: true, cart });
});

/**
 * @desc    Update item quantity in cart
 * @route   PUT /api/cart/:productId
 * @access  Private
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} units available`);
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product', 'name images price stock');

  res.json({ success: true, cart });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:productId
 * @access  Private
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await cart.save();
  await cart.populate('items.product', 'name images price stock');

  res.json({ success: true, cart });
});

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user.id });
  res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
