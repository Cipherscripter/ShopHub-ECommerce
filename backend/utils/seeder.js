/**
 * Database seeder — run with: node utils/seeder.js
 * Seeds 3+ products per category with real Unsplash images
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User    = require('../models/User');
const Product = require('../models/Product');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding');
};

const seedData = async () => {
  await connectDB();

  await User.deleteMany();
  await Product.deleteMany();

  // Create admin user
  const admin = await User.create({
    name:     'Admin User',
    email:    'admin@ecommerce.com',
    password: 'admin123',
    role:     'admin',
  });

  await User.create({
    name:     'John Doe',
    email:    'john@example.com',
    password: 'password123',
    role:     'user',
  });

  const products = [
    // ─── Electronics ──────────────────────────────────────────────────────────
    {
      name: 'ProBuds Wireless Earbuds',
      description: 'Crystal clear sound with active noise cancellation and all-day comfort. 30-hour battery life with charging case.',
      price: 12999, discountPrice: 9999,
      category: 'Electronics', brand: 'ProBuds', stock: 80, isFeatured: true,
      images: [{ public_id: 'earbuds_1', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      description: 'Industry-leading noise cancellation with exceptional sound quality. Foldable design for easy portability.',
      price: 29999, discountPrice: 24999,
      category: 'Electronics', brand: 'Sony', stock: 45, isFeatured: true,
      images: [{ public_id: 'headphones_1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Smart Watch Pro X',
      description: 'Track fitness, receive notifications, and monitor health metrics. Water-resistant with 7-day battery life.',
      price: 15999, discountPrice: 12999,
      category: 'Electronics', brand: 'TechWear', stock: 60, isFeatured: true,
      images: [{ public_id: 'watch_1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit mechanical keyboard with tactile switches. Anti-ghosting and N-key rollover for competitive gaming.',
      price: 7999,
      category: 'Electronics', brand: 'GameForce', stock: 35,
      images: [{ public_id: 'keyboard_1', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: '4K Mirrorless Camera',
      description: 'Professional-grade mirrorless camera with 24MP sensor, 4K video, and in-body stabilization.',
      price: 89999, discountPrice: 79999,
      category: 'Electronics', brand: 'Lumix', stock: 20, isFeatured: true,
      images: [{ public_id: 'camera_1', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' }],
      seller: admin._id,
    },

    // ─── Clothing ─────────────────────────────────────────────────────────────
    {
      name: 'Premium Cotton Oversized Tee',
      description: '100% organic cotton oversized t-shirt. Breathable, soft, and sustainably sourced. Available in 8 colors.',
      price: 1299, discountPrice: 999,
      category: 'Clothing', brand: 'EcoWear', stock: 200, isFeatured: true,
      images: [{ public_id: 'tshirt_1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Slim Fit Chino Pants',
      description: 'Modern slim fit chinos made from stretch cotton blend. Perfect for office or casual wear.',
      price: 2499, discountPrice: 1999,
      category: 'Clothing', brand: 'UrbanFit', stock: 150,
      images: [{ public_id: 'pants_1', url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Leather Biker Jacket',
      description: 'Genuine leather biker jacket with quilted lining. Timeless style meets modern comfort.',
      price: 8999, discountPrice: 6999,
      category: 'Clothing', brand: 'RoadKing', stock: 40, isFeatured: true,
      images: [{ public_id: 'jacket_1', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Floral Summer Dress',
      description: 'Light and breezy floral print dress perfect for summer. Made from 100% viscose fabric.',
      price: 1799, discountPrice: 1299,
      category: 'Clothing', brand: 'BloomWear', stock: 120,
      images: [{ public_id: 'dress_1', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80' }],
      seller: admin._id,
    },

    // ─── Books ────────────────────────────────────────────────────────────────
    {
      name: 'Atomic Habits',
      description: 'An easy and proven way to build good habits and break bad ones by James Clear. A #1 New York Times bestseller.',
      price: 599, discountPrice: 449,
      category: 'Books', brand: 'Penguin', stock: 300, isFeatured: true,
      images: [{ public_id: 'book_1', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'The Psychology of Money',
      description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. Essential reading for financial literacy.',
      price: 499, discountPrice: 379,
      category: 'Books', brand: 'Jaico', stock: 250,
      images: [{ public_id: 'book_2', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Clean Code',
      description: 'A handbook of agile software craftsmanship by Robert C. Martin. Must-read for every developer.',
      price: 799, discountPrice: 649,
      category: 'Books', brand: "O'Reilly", stock: 180,
      images: [{ public_id: 'book_3', url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Zero to One',
      description: 'Notes on startups, or how to build the future by Peter Thiel. A blueprint for building companies that create new things.',
      price: 549,
      category: 'Books', brand: 'Crown Business', stock: 200,
      images: [{ public_id: 'book_4', url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80' }],
      seller: admin._id,
    },

    // ─── Sports ───────────────────────────────────────────────────────────────
    {
      name: 'Nike Air Zoom Running Shoes',
      description: 'Lightweight and responsive running shoes with Zoom Air cushioning. Engineered mesh upper for breathability.',
      price: 8999, discountPrice: 6999,
      category: 'Sports', brand: 'Nike', stock: 90, isFeatured: true,
      images: [{ public_id: 'shoes_1', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Yoga Mat Premium',
      description: 'Extra thick 6mm non-slip yoga mat with alignment lines. Eco-friendly TPE material, includes carry strap.',
      price: 1999, discountPrice: 1499,
      category: 'Sports', brand: 'ZenFit', stock: 150,
      images: [{ public_id: 'yoga_1', url: 'https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Adjustable Dumbbell Set',
      description: 'Space-saving adjustable dumbbells from 5kg to 25kg. Quick-change weight system for efficient workouts.',
      price: 12999, discountPrice: 9999,
      category: 'Sports', brand: 'IronCore', stock: 55,
      images: [{ public_id: 'dumbbell_1', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Cycling Helmet Pro',
      description: 'Aerodynamic cycling helmet with MIPS protection system. 18 ventilation channels for maximum airflow.',
      price: 4999, discountPrice: 3999,
      category: 'Sports', brand: 'VeloSafe', stock: 70,
      images: [{ public_id: 'helmet_1', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' }],
      seller: admin._id,
    },

    // ─── Home & Garden ────────────────────────────────────────────────────────
    {
      name: 'Minimalist Desk Lamp',
      description: 'LED desk lamp with touch dimmer and USB charging port. 5 color temperatures and 10 brightness levels.',
      price: 2499, discountPrice: 1999,
      category: 'Home & Garden', brand: 'LumiHome', stock: 100, isFeatured: true,
      images: [{ public_id: 'lamp_1', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Ceramic Plant Pot Set',
      description: 'Set of 3 minimalist ceramic plant pots with drainage holes and bamboo trays. Perfect for succulents.',
      price: 1299, discountPrice: 999,
      category: 'Home & Garden', brand: 'GreenSpace', stock: 200,
      images: [{ public_id: 'pot_1', url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Scented Soy Candle Collection',
      description: 'Hand-poured soy wax candles in 4 premium fragrances. 45-hour burn time, lead-free cotton wick.',
      price: 1799, discountPrice: 1399,
      category: 'Home & Garden', brand: 'AromaLux', stock: 180,
      images: [{ public_id: 'candle_1', url: 'https://images.unsplash.com/photo-1602607144535-11be3d5e5e5e?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Bamboo Kitchen Organizer',
      description: 'Expandable bamboo drawer organizer with 6 compartments. Eco-friendly and fits most standard drawers.',
      price: 899,
      category: 'Home & Garden', brand: 'EcoHome', stock: 250,
      images: [{ public_id: 'organizer_1', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80' }],
      seller: admin._id,
    },

    // ─── Beauty ───────────────────────────────────────────────────────────────
    {
      name: 'Vitamin C Brightening Serum',
      description: '20% Vitamin C serum with hyaluronic acid and niacinamide. Reduces dark spots and boosts radiance in 2 weeks.',
      price: 1999, discountPrice: 1599,
      category: 'Beauty', brand: 'GlowLab', stock: 120, isFeatured: true,
      images: [{ public_id: 'serum_1', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Matte Lipstick Set',
      description: 'Long-lasting matte lipstick collection in 6 bold shades. Hydrating formula with vitamin E.',
      price: 1299, discountPrice: 999,
      category: 'Beauty', brand: 'ColorPop', stock: 200,
      images: [{ public_id: 'lipstick_1', url: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2263?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Argan Oil Hair Mask',
      description: 'Deep conditioning hair mask with pure Moroccan argan oil. Repairs damage and adds shine in one use.',
      price: 899, discountPrice: 699,
      category: 'Beauty', brand: 'HairLux', stock: 160,
      images: [{ public_id: 'hairmask_1', url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Jade Facial Roller',
      description: 'Natural jade stone facial roller for lymphatic drainage and de-puffing. Includes gua sha tool.',
      price: 799, discountPrice: 599,
      category: 'Beauty', brand: 'JadeGlow', stock: 180,
      images: [{ public_id: 'roller_1', url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80' }],
      seller: admin._id,
    },

    // ─── Toys ─────────────────────────────────────────────────────────────────
    {
      name: 'LEGO Architecture Set',
      description: 'Build iconic world landmarks with this 1,500-piece LEGO set. Perfect for ages 12+ and adult collectors.',
      price: 4999, discountPrice: 3999,
      category: 'Toys', brand: 'LEGO', stock: 60, isFeatured: true,
      images: [{ public_id: 'lego_1', url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Remote Control Racing Car',
      description: '1:16 scale RC car with 2.4GHz control, 30km/h top speed, and rechargeable battery. All-terrain tires.',
      price: 2999, discountPrice: 2299,
      category: 'Toys', brand: 'TurboRace', stock: 80,
      images: [{ public_id: 'rccar_1', url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Wooden Puzzle Set',
      description: 'Set of 5 handcrafted wooden puzzles for children ages 3-8. Non-toxic paint, develops motor skills.',
      price: 1499, discountPrice: 1199,
      category: 'Toys', brand: 'WoodPlay', stock: 120,
      images: [{ public_id: 'puzzle_1', url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80' }],
      seller: admin._id,
    },

    // ─── Food ─────────────────────────────────────────────────────────────────
    {
      name: 'Organic Green Tea Collection',
      description: 'Premium organic green tea from Darjeeling. 50 hand-picked tea bags with antioxidant-rich leaves.',
      price: 699, discountPrice: 549,
      category: 'Food', brand: 'TeaGarden', stock: 300, isFeatured: true,
      images: [{ public_id: 'tea_1', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Dark Chocolate Gift Box',
      description: 'Assorted premium dark chocolates from Belgium. 24 pieces in 6 flavors, 70% cacao. Perfect gift.',
      price: 1299, discountPrice: 999,
      category: 'Food', brand: 'ChocoLux', stock: 150,
      images: [{ public_id: 'chocolate_1', url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Cold Pressed Juice Pack',
      description: '6-bottle cold pressed juice cleanse pack. No added sugar, preservatives, or artificial flavors.',
      price: 1599, discountPrice: 1299,
      category: 'Food', brand: 'PurePress', stock: 100,
      images: [{ public_id: 'juice_1', url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80' }],
      seller: admin._id,
    },

    // ─── Automotive ───────────────────────────────────────────────────────────
    {
      name: 'Car Dash Cam 4K',
      description: '4K ultra HD dash camera with night vision, GPS, and 170° wide angle. Loop recording with G-sensor.',
      price: 6999, discountPrice: 5499,
      category: 'Automotive', brand: 'DriveSafe', stock: 70, isFeatured: true,
      images: [{ public_id: 'dashcam_1', url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Car Vacuum Cleaner',
      description: 'Portable 12V car vacuum with 5000Pa suction. Wet and dry use, includes 4 attachments.',
      price: 1999, discountPrice: 1499,
      category: 'Automotive', brand: 'CleanDrive', stock: 110,
      images: [{ public_id: 'vacuum_1', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' }],
      seller: admin._id,
    },
    {
      name: 'Leather Steering Wheel Cover',
      description: 'Genuine leather steering wheel cover with anti-slip grip. Universal fit for 37-38cm wheels.',
      price: 899, discountPrice: 699,
      category: 'Automotive', brand: 'AutoLux', stock: 200,
      images: [{ public_id: 'steering_1', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' }],
      seller: admin._id,
    },
  ];

  await Product.insertMany(products);

  console.log(`✅ Seeded ${products.length} products across all categories`);
  console.log('Admin: admin@ecommerce.com / admin123');
  console.log('User:  john@example.com / password123');
  process.exit(0);
};

seedData().catch((err) => {
  console.error(err);
  process.exit(1);
});
