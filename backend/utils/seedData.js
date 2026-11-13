const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');

dotenv.config();

const categories = [
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
    description: 'Engineered with 40mm beryllium drivers, active hybrid noise cancellation, 45-hour continuous battery life, and ultra-comfortable memory foam ear cushions.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Driver Size', value: '40mm Custom High-Res Beryllium' },
      { key: 'Battery Life', value: '45 Hours (ANC ON)' },
      { key: 'Connectivity', value: 'Bluetooth 5.3 & 3.5mm Aux' },
      { key: 'Weight', value: '250 grams' },
    ],
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
    description: 'Crafted from aerospace grade titanium alloy with anti-reflective sapphire crystal glass. Features always-on AMOLED display, heart rate monitor, SpO2 sensor, and 14-day battery.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Case Material', value: 'Grade 5 Titanium' },
      { key: 'Water Resistance', value: '5 ATM (50 meters)' },
      { key: 'Battery', value: 'Up to 14 days' },
      { key: 'Compatibility', value: 'iOS and Android' },
    ],
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
    description: 'Hot-swappable custom linear red switches, per-key RGB backlighting with dynamic effects, aircraft-grade aluminum top plate, and sound-dampening acoustic silicone padding.',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Switches', value: 'Pre-lubed Red Linear' },
      { key: 'Keycaps', value: 'Double-shot PBT' },
      { key: 'Polling Rate', value: '1000Hz (1ms)' },
    ],
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
    description: 'Handcrafted from 100% full-grain vegetable-tanned leather. Features brass hardware, reinforced leather handles, removable padded shoulder strap, and waterproof interior lining.',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Material', value: 'Full-Grain Tuscan Leather' },
      { key: 'Capacity', value: '45 Liters' },
      { key: 'Dimensions', value: '21" x 11" x 10"' },
    ],
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
    description: 'Commercial-grade 15-bar Italian pump with digital PID temperature control, integrated conical burr grinder with 30 grind settings, and micro-foam steam wand for latte art.',
    images: [
      'https://images.unsplash.com/photo-1534684686641-05569203ecca?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Pump Pressure', value: '15 Bar Italian Pump' },
      { key: 'Grinder', value: 'Integrated Stainless Steel Burr' },
      { key: 'Water Tank', value: '2.5 Liters' },
    ],
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
    description: 'Infused with multi-molecular hyaluronic acid, niacinamide, and cold-pressed botanical extracts to deliver intense hydration and a youthful radiant complexion.',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Volume', value: '50ml / 1.7 fl oz' },
      { key: 'Skin Type', value: 'All skin types, sensitive friendly' },
      { key: 'Formulation', value: 'Cruelty-free & Vegan' },
    ],
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
    description: 'Replaces 15 sets of weights in one compact footprint. Rapid dial selector lets you adjust weight from 5 to 52.5 lbs with a simple twist of the dial.',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Weight Range', value: '5 to 52.5 lbs each' },
      { key: 'Plate Coating', value: 'Heavy-duty thermoplastic' },
      { key: 'Warranty', value: '2-Year Manufacturer Warranty' },
    ],
  },
  {
    name: 'Designing Data-Intensive Applications (Hardcover)',
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
    description: 'The definitive guide by Martin Kleppmann on building scalable, reliable, and maintainable data systems in modern software architecture.',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Author', value: 'Martin Kleppmann' },
      { key: 'Format', value: 'Hardcover, 616 pages' },
      { key: 'Language', value: 'English' },
    ],
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
    description: 'Ultra-clear 3840x2160 IPS panel covering 99% DCI-P3 color gamut with HDR600, USB-C 90W single-cable power delivery, and fully articulating ergonomic arm.',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Resolution', value: '4K UHD (3840 x 2160)' },
      { key: 'Refresh Rate', value: '144Hz' },
      { key: 'Ports', value: 'HDMI 2.1, DP 1.4, USB-C PD 90W' },
    ],
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
    description: 'Exceptional heat distribution and retention for slow-cooking, braising, baking artisan sourdough, and roasting. Heavy-duty porcelain enamel exterior.',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Capacity', value: '6 Quarts' },
      { key: 'Oven Safe', value: 'Up to 500°F (260°C)' },
      { key: 'Compatibility', value: 'Gas, Electric, Induction, Ceramic' },
    ],
  },
  {
    name: 'AeroVent Breathable Running Shoes',
    brand: 'Velocity',
    categorySlug: 'sports-outdoors',
    price: 119.99,
    discountPrice: 145.00,
    countInStock: 3, // Low stock for testing admin low stock indicator
    rating: 4.6,
    numReviews: 28,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
    description: 'Engineered with responsive nitrogen-infused foam midsole, carbon fiber propulsion plate, and breathable engineered mesh upper for elite road running performance.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Drop', value: '8mm' },
      { key: 'Cushioning', value: 'Max Cushion Responsive' },
      { key: 'Weight', value: '7.8 oz (Size 9)' },
    ],
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
    description: 'Versatile low-top silhouette featuring premium organic canvas and buttery suede trims with vulcanized natural gum rubber outsoles for all-day cushioning.',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    ],
    specifications: [
      { key: 'Upper', value: 'Organic Cotton Canvas & Italian Suede' },
      { key: 'Sole', value: 'Natural Gum Rubber' },
      { key: 'Insole', value: 'Ortholite Arch Support' },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Review.deleteMany(),
      Cart.deleteMany(),
      Wishlist.deleteMany(),
      Order.deleteMany(),
    ]);

    console.log('[Seed] Seeding categories...');
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('[Seed] Seeding users...');
    const adminUser = await User.create({
      name: 'ShopSphere Admin',
      email: 'admin@shopsphere.com',
      password: 'adminpassword123',
      role: 'admin',
      phone: '+1-800-555-0199',
      addresses: [
        {
          street: '100 Executive Way',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          country: 'United States',
          isDefault: true,
        },
      ],
    });

    const demoUser = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'password123',
      role: 'customer',
      phone: '+1-555-839-2810',
      addresses: [
        {
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          postalCode: '97477',
          country: 'United States',
          isDefault: true,
        },
      ],
    });

    console.log('[Seed] Seeding products...');
    const productsToInsert = sampleProducts.map((p) => {
      const { categorySlug, ...rest } = p;
      return {
        ...rest,
        category: categoryMap[categorySlug] || createdCategories[0]._id,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      };
    });

    const createdProducts = await Product.insertMany(productsToInsert);

    console.log('[Seed] Creating demo reviews...');
    await Review.create({
      user: demoUser._id,
      product: createdProducts[0]._id,
      name: demoUser.name,
      rating: 5,
      comment: 'These headphones are phenomenal! Best active noise cancellation I have ever used. Battery lasts days.',
    });

    console.log('[Seed] Initializing carts and wishlists...');
    await Cart.create({
      user: demoUser._id,
      items: [
        {
          product: createdProducts[0]._id,
          quantity: 1,
          price: createdProducts[0].price,
        },
      ],
    });

    await Wishlist.create({
      user: demoUser._id,
      products: [createdProducts[1]._id, createdProducts[3]._id],
    });

    console.log('[Seed] Creating sample order for analytics demo...');
    await Order.create({
      user: demoUser._id,
      orderItems: [
        {
          name: createdProducts[0].name,
          qty: 1,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          product: createdProducts[0]._id,
        },
        {
          name: createdProducts[2].name,
          qty: 1,
          image: createdProducts[2].images[0],
          price: createdProducts[2].price,
          product: createdProducts[2]._id,
        },
      ],
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
      itemsPrice: createdProducts[0].price + createdProducts[2].price,
      shippingPrice: 0,
      taxPrice: Number(((createdProducts[0].price + createdProducts[2].price) * 0.08).toFixed(2)),
      totalPrice: Number(((createdProducts[0].price + createdProducts[2].price) * 1.08).toFixed(2)),
      isPaid: true,
      paidAt: new Date(),
      orderStatus: 'Confirmed',
      statusHistory: [
        { status: 'Processing', timestamp: new Date(Date.now() - 3600000 * 24) },
        { status: 'Confirmed', timestamp: new Date() },
      ],
    });

    console.log('----------------------------------------------------');
    console.log('✅ ShopSphere Database Seeded Successfully!');
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Products:   ${createdProducts.length}`);
    console.log(`- Admin:      admin@shopsphere.com / adminpassword123`);
    console.log(`- Customer:   alex@example.com / password123`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
