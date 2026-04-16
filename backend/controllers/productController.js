const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');

/**
 * @desc    Get all products with filtering, sorting, pagination, and search
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    rating,
    sort = '-createdAt',
    page  = 1,
    limit = 12,
  } = req.query;

  // Build query object
  const query = {};

  // Full-text search
  if (keyword) {
    query.$text = { $search: keyword };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Minimum rating filter
  if (rating) {
    query.rating = { $gte: Number(rating) };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('seller', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    products,
  });
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('seller', 'name email')
    .populate('reviews.user', 'name avatar');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

/**
 * @desc    Create a product (Admin)
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, category, brand, stock, isFeatured } = req.body;

  // Images are uploaded via Cloudinary middleware before this runs
  const images = req.files
    ? req.files.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }))
    : [];

  if (images.length === 0) {
    res.status(400);
    throw new Error('At least one product image is required');
  }

  const product = await Product.create({
    name,
    description,
    price,
    discountPrice: discountPrice || 0,
    category,
    brand,
    stock,
    isFeatured: isFeatured || false,
    images,
    seller: req.user.id,
  });

  res.status(201).json({ success: true, product });
});

/**
 * @desc    Update a product (Admin)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // If new images are uploaded, delete old ones from Cloudinary and replace
  if (req.files && req.files.length > 0) {
    // Delete old images from Cloudinary
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    req.body.images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, product });
});

/**
 * @desc    Delete a product (Admin)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Delete images from Cloudinary
  for (const img of product.images) {
    await cloudinary.uploader.destroy(img.public_id);
  }

  await product.deleteOne();

  res.json({ success: true, message: 'Product deleted successfully' });
});

/**
 * @desc    Create / update a product review
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user.id.toString()
  );

  if (alreadyReviewed) {
    // Update existing review
    alreadyReviewed.rating  = Number(rating);
    alreadyReviewed.comment = comment;
  } else {
    product.reviews.push({
      user:    req.user.id,
      name:    req.user.name,
      rating:  Number(rating),
      comment,
    });
  }

  product.calculateAverageRating();
  await product.save();

  res.status(201).json({ success: true, message: 'Review submitted' });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(8);
  res.json({ success: true, products });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFeaturedProducts,
};
