const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere';

  try {
    // Attempt standard connection (Atlas or local mongod)
    console.log(`[Database] Attempting connection to ${mongoURI}...`);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Direct MongoDB connection failed (${err.message}). Initializing embedded MongoDB server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[Database] Embedded MongoDB Server Running & Connected at: ${uri}`);

      // Auto-seed if database is brand new
      const Category = require('../models/Category');
      const count = await Category.countDocuments();
      if (count === 0) {
        console.log(`[Database] Empty database detected. Auto-seeding initial catalog and users...`);
        const seedData = require('../utils/seedData');
        // Run seed without process.exit
        const seedFunction = async () => {
          const User = require('../models/User');
          const Product = require('../models/Product');
          const Review = require('../models/Review');
          const Cart = require('../models/Cart');
          const Wishlist = require('../models/Wishlist');
          const Order = require('../models/Order');

          const categoriesData = [
            {
              name: 'Electronics',
              slug: 'electronics',
              description: 'Latest gadgets, audio, laptops, smart accessories, and gaming gears.',
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
            },
            {
              name: 'Fashion',
              slug: 'fashion',
              description: 'Trending designer apparel, watches, leather goods, and street wear.',
              image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
            },
            {
              name: 'Home & Kitchen',
              slug: 'home-kitchen',
              description: 'Smart kitchen appliances, cookware, barista machines, and modern decor.',
              image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
            },
            {
              name: 'Beauty & Wellness',
              slug: 'beauty',
              description: 'Organic skincare, aromatherapy diffusers, luxury serums, and care items.',
              image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
            },
            {
              name: 'Sports & Fitness',
              slug: 'sports-outdoors',
              description: 'Smart fitness trackers, yoga essentials, dumbbells, and outdoor gear.',
              image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
            },
            {
              name: 'Books & Stationery',
              slug: 'books',
              description: 'Bestselling titles, tech architecture guides, and artisan journals.',
              image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
            },
          ];

          const createdCategories = await Category.insertMany(categoriesData);
          const categoryMap = {};
          createdCategories.forEach((cat) => {
            categoryMap[cat.slug] = cat._id;
          });

          const adminUser = await User.create({
            name: 'ShopSphere Admin',
            email: 'admin@shopsphere.com',
            password: 'adminpassword123',
            role: 'admin',
            phone: '+1-800-555-0199',
            addresses: [{
              street: '100 Executive Way',
              city: 'San Francisco',
              state: 'CA',
              postalCode: '94105',
              country: 'United States',
              isDefault: true,
            }],
          });

          const demoUser = await User.create({
            name: 'Alex Johnson',
            email: 'alex@example.com',
            password: 'password123',
            role: 'customer',
            phone: '+1-555-839-2810',
            addresses: [{
              street: '742 Evergreen Terrace',
              city: 'Springfield',
              state: 'OR',
              postalCode: '97477',
              country: 'United States',
              isDefault: true,
            }],
          });

          const sampleProducts = [
            {
              name: 'AeroSound Pro Wireless ANC Headphones',
              brand: 'AeroSound',
              categorySlug: 'electronics',
              price: 199.99,
              discountPrice: 249.99,
              countInStock: 25,
              rating: 4.8,
              numReviews: 42,
              isFeatured: true,
              isTrending: true,
              isBestSeller: true,
              description: 'Engineered with 40mm beryllium drivers, active hybrid noise cancellation, 45-hour continuous battery life, and ultra-comfortable memory foam cushions.',
              images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
            },
            {
              name: 'Chronos Titanium Minimalist Smartwatch',
              brand: 'Chronos',
              categorySlug: 'electronics',
              price: 299.99,
              discountPrice: 349.99,
              countInStock: 14,
              rating: 4.9,
              numReviews: 38,
              isFeatured: true,
              isTrending: true,
              isBestSeller: false,
              description: 'Aerospace grade titanium with sapphire crystal glass, AMOLED display, and 14-day battery life.',
              images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
            },
            {
              name: 'Horizon Ultra-Wide Mechanical Gaming Keyboard',
              brand: 'NovaTech',
              categorySlug: 'electronics',
              price: 129.99,
              discountPrice: 159.99,
              countInStock: 30,
              rating: 4.7,
              numReviews: 29,
              isFeatured: false,
              isTrending: true,
              isBestSeller: true,
              description: 'Hot-swappable custom linear red switches, per-key RGB backlighting, and sound-dampening acoustic padding.',
              images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'],
            },
            {
              name: 'Artisan Heritage Leather Weekend Duffle',
              brand: 'Vanguard Leather',
              categorySlug: 'fashion',
              price: 189.99,
              discountPrice: 229.99,
              countInStock: 8,
              rating: 4.9,
              numReviews: 19,
              isFeatured: true,
              isTrending: false,
              isBestSeller: true,
              description: 'Handcrafted from 100% full-grain vegetable-tanned leather with brass hardware.',
              images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80'],
            },
            {
              name: 'Barista Touch Espresso & Cappuccino Machine',
              brand: 'CaffèLux',
              categorySlug: 'home-kitchen',
              price: 499.99,
              discountPrice: 599.99,
              countInStock: 12,
              rating: 4.8,
              numReviews: 54,
              isFeatured: true,
              isTrending: true,
              isBestSeller: true,
              description: 'Commercial-grade 15-bar Italian pump with digital PID temperature control and micro-foam steam wand.',
              images: ['https://images.unsplash.com/photo-1534684686641-05569203ecca?w=800&auto=format&fit=crop&q=80'],
            },
            {
              name: 'Lumina Hydro-Boost Botanical Face Serum',
              brand: 'Lumina Skin',
              categorySlug: 'beauty',
              price: 48.00,
              discountPrice: 60.00,
              countInStock: 50,
              rating: 4.6,
              numReviews: 31,
              isFeatured: false,
              isTrending: true,
              isBestSeller: false,
              description: 'Multi-molecular hyaluronic acid and cold-pressed botanical extracts for intense hydration.',
              images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'],
            },
            {
              name: 'ProGrip Adjustable Dumbbell Set (5-52.5 lbs)',
              brand: 'IronForge',
              categorySlug: 'sports-outdoors',
              price: 279.99,
              discountPrice: 329.99,
              countInStock: 6,
              rating: 4.9,
              numReviews: 67,
              isFeatured: true,
              isTrending: false,
              isBestSeller: true,
              description: 'Rapid dial selector lets you adjust weight from 5 to 52.5 lbs with a simple twist.',
              images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80'],
            },
            {
              name: 'Designing Data-Intensive Applications',
              brand: "O'Reilly Media",
              categorySlug: 'books',
              price: 49.99,
              discountPrice: 59.99,
              countInStock: 40,
              rating: 5.0,
              numReviews: 120,
              isFeatured: false,
              isTrending: false,
              isBestSeller: true,
              description: 'The definitive architectural guide by Martin Kleppmann on building scalable, reliable distributed systems.',
              images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'],
            },
            {
              name: 'Zenith 4K HDR Ergonomic Creator Monitor 32"',
              brand: 'Zenith Vision',
              categorySlug: 'electronics',
              price: 549.99,
              discountPrice: 649.99,
              countInStock: 9,
              rating: 4.8,
              numReviews: 24,
              isFeatured: true,
              isTrending: true,
              isBestSeller: false,
              description: 'Ultra-clear 3840x2160 IPS panel covering 99% DCI-P3 color gamut with HDR600.',
              images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80'],
            },
            {
              name: 'Cast Iron Enamelled Dutch Oven 6-Quart',
              brand: 'Maison Culinaire',
              categorySlug: 'home-kitchen',
              price: 89.99,
              discountPrice: 119.99,
              countInStock: 18,
              rating: 4.7,
              numReviews: 33,
              isFeatured: false,
              isTrending: true,
              isBestSeller: true,
              description: 'Exceptional heat distribution and retention for slow-cooking, braising, and baking artisan sourdough.',
              images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'],
            },
            {
              name: 'AeroVent Breathable Running Shoes',
              brand: 'Velocity',
              categorySlug: 'sports-outdoors',
              price: 119.99,
              discountPrice: 145.00,
              countInStock: 3,
              rating: 4.6,
              numReviews: 28,
              isFeatured: false,
              isTrending: true,
              isBestSeller: false,
              description: 'Engineered with nitrogen-infused foam midsole and carbon fiber propulsion plate.',
              images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'],
            },
            {
              name: 'Urban Canvas & Suede Minimalist Sneakers',
              brand: 'SoleCraft',
              categorySlug: 'fashion',
              price: 85.00,
              discountPrice: 110.00,
              countInStock: 22,
              rating: 4.5,
              numReviews: 17,
              isFeatured: false,
              isTrending: false,
              isBestSeller: true,
              description: 'Versatile low-top silhouette featuring premium organic canvas and buttery suede trims.',
              images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80'],
            },
          ];

          const productsWithCategories = sampleProducts.map((p) => ({
            ...p,
            category: categoryMap[p.categorySlug] || createdCategories[0]._id,
            slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          }));

          const createdProducts = await Product.insertMany(productsWithCategories);

          await Cart.create({
            user: demoUser._id,
            items: [{ product: createdProducts[0]._id, quantity: 1, price: createdProducts[0].price }],
          });

          await Wishlist.create({
            user: demoUser._id,
            products: [createdProducts[1]._id],
          });

          await Order.create({
            user: demoUser._id,
            orderItems: [{
              name: createdProducts[0].name,
              qty: 1,
              image: createdProducts[0].images[0],
              price: createdProducts[0].price,
              product: createdProducts[0]._id,
            }],
            shippingAddress: {
              fullName: demoUser.name,
              phone: demoUser.phone,
              street: demoUser.addresses[0].street,
              city: demoUser.addresses[0].city,
              state: demoUser.addresses[0].state,
              postalCode: demoUser.addresses[0].postalCode,
              country: demoUser.addresses[0].country,
            },
            paymentMethod: 'COD',
            itemsPrice: createdProducts[0].price,
            shippingPrice: 0,
            taxPrice: Number((createdProducts[0].price * 0.08).toFixed(2)),
            totalPrice: Number((createdProducts[0].price * 1.08).toFixed(2)),
            isPaid: true,
            paidAt: new Date(),
            orderStatus: 'Confirmed',
            statusHistory: [{ status: 'Confirmed', timestamp: new Date(), note: 'Initial sample order' }],
          });

          console.log(`[Database] Auto-seeded 6 categories, 12 products, demo orders and users successfully!`);
        };
        await seedFunction();
      }

      return conn;
    } catch (memErr) {
      console.error(`[Database] Failed to initialize embedded MongoDB: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
