/**
 * Database seeder — run with: npm run seed
 * Seeds sample products and an admin user for development
 */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

dotenv.config({ path: require('path').join(__dirname, '../.env') });

const User    = require('../models/User');
const Product = require('../models/Product');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding');
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany();
  await Product.deleteMany();

  // Create admin user
  const admin = await User.create({
    name:     'Admin User',
    email:    'admin@ecommerce.com',
    password: 'admin123',
    role:     'admin',
  });

  // Create regular user
  await User.create({
    name:     'John Doe',
    email:    'john@example.com',
    password: 'password123',
    role:     'user',
  });

  // Sample products
  const products = [
    {
      name:        'Wireless Noise-Cancelling Headphones',
      description: 'Premium over-ear headphones with 30-hour battery life and active noise cancellation.',
      price:       24999,
      category:    'Electronics',
      brand:       'SoundMax',
      stock:       50,
      isFeatured:  true,
      images:      [{ public_id: 'sample_1', url: 'https://via.placeholder.com/800x800?text=Headphones' }],
      seller:      admin._id,
    },
    {
      name:        'Running Shoes Pro',
      description: 'Lightweight and breathable running shoes with advanced cushioning technology.',
      price:       4999,
      category:    'Sports',
      brand:       'SpeedRun',
      stock:       100,
      isFeatured:  true,
      images:      [{ public_id: 'sample_2', url: 'https://via.placeholder.com/800x800?text=Shoes' }],
      seller:      admin._id,
    },
    {
      name:        'Organic Cotton T-Shirt',
      description: '100% organic cotton, sustainably sourced. Available in multiple colors.',
      price:       799,
      category:    'Clothing',
      brand:       'EcoWear',
      stock:       200,
      images:      [{ public_id: 'sample_3', url: 'https://via.placeholder.com/800x800?text=T-Shirt' }],
      seller:      admin._id,
    },
    {
      name:        'Smart Home Hub',
      description: 'Control all your smart devices from one central hub. Compatible with Alexa and Google Home.',
      price:       6999,
      category:    'Electronics',
      brand:       'SmartLife',
      stock:       75,
      isFeatured:  true,
      images:      [{ public_id: 'sample_4', url: 'https://via.placeholder.com/800x800?text=Smart+Hub' }],
      seller:      admin._id,
    },
    {
      name:        'JavaScript: The Good Parts',
      description: 'A deep dive into the best features of JavaScript by Douglas Crockford.',
      price:       599,
      category:    'Books',
      brand:       "O'Reilly",
      stock:       150,
      images:      [{ public_id: 'sample_5', url: 'https://via.placeholder.com/800x800?text=Book' }],
      seller:      admin._id,
    },
  ];

  await Product.insertMany(products);

  console.log('✅ Data seeded successfully');
  console.log('Admin: admin@ecommerce.com / admin123');
  console.log('User:  john@example.com / password123');
  process.exit(0);
};

seedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
