const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:    { type: String, required: true },
  image:   { type: String, required: true },
  price:   { type: Number, required: true },
  quantity:{ type: Number, required: true },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName:   { type: String, required: true },
  address:    { type: String, required: true },
  city:       { type: String, required: true },
  postalCode: { type: String, required: true },
  country:    { type: String, required: true },
  phone:      { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      required: true,
      enum: ['stripe', 'mock', 'cod'],
      default: 'stripe',
    },
    paymentResult: {
      id:         String,
      status:     String,
      updateTime: String,
      email:      String,
    },
    itemsPrice:    { type: Number, required: true, default: 0 },
    taxPrice:      { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice:    { type: Number, required: true, default: 0 },
    discount:      { type: Number, default: 0 },
    isPaid:        { type: Boolean, default: false },
    paidAt:        Date,
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [
      {
        status:    String,
        updatedAt: { type: Date, default: Date.now },
        note:      String,
      },
    ],
    deliveredAt: Date,
    trackingNumber: String,
  },
  { timestamps: true }
);

// ─── Auto-push status changes to history ──────────────────────────────────────
orderSchema.pre('save', function (next) {
  if (this.isModified('orderStatus')) {
    this.statusHistory.push({ status: this.orderStatus });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
