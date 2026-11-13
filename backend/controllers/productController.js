const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const cloudinary = require('../config/cloudinary');

// @desc    Fetch all products with advanced filtering, search, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // 1. Keyword search (Name, description, brand)
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }

    // 2. Category filtering (by slug or ObjectId)
    if (req.query.category) {
      const categoryDoc = await Category.findOne({
        $or: [
          { slug: req.query.category },
          ...(req.query.category.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: req.query.category }] : []),
        ],
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // 3. Brand filtering
    if (req.query.brand) {
      const brands = req.query.brand.split(',');
      query.brand = { $in: brands.map((b) => new RegExp(`^${b.trim()}$`, 'i')) };
    }

    // 4. Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // 5. Minimum rating filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    // 6. In-stock only filter
    if (req.query.inStock === 'true') {
      query.countInStock = { $gt: 0 };
    }

    // 7. Special flags
    if (req.query.isFeatured === 'true') query.isFeatured = true;
    if (req.query.isTrending === 'true') query.isTrending = true;
    if (req.query.isBestSeller === 'true') query.isBestSeller = true;

    // Sorting
    let sort = { createdAt: -1 }; // default newest
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sort = { price: 1 };
          break;
        case 'price_desc':
          sort = { price: -1 };
          break;
        case 'rating':
          sort = { rating: -1, numReviews: -1 };
          break;
        case 'popular':
          sort = { numReviews: -1 };
          break;
        case 'newest':
        default:
          sort = { createdAt: -1 };
          break;
      }
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID with category and reviews
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = await Review.find({ product: product._id }).populate('user', 'name avatar').sort({ createdAt: -1 });

    res.json({
      success: true,
      product,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: product._id,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: product._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    // Update product ratings average and reviews count
    const reviews = await Review.find({ product: product._id });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      discountPrice,
      countInStock,
      images,
      specifications,
      isFeatured,
      isTrending,
      isBestSeller,
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await Product.create({
      name,
      slug,
      description,
      brand,
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : Number(price),
      countInStock: Number(countInStock),
      images: Array.isArray(images) && images.length ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
      specifications: specifications || [],
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
      isBestSeller: Boolean(isBestSeller),
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const fields = [
      'name',
      'description',
      'brand',
      'category',
      'price',
      'discountPrice',
      'countInStock',
      'images',
      'specifications',
      'isFeatured',
      'isTrending',
      'isBestSeller',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.name) {
      product.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updatedProduct = await product.save();
    res.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    await Review.deleteMany({ product: req.params.id });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
};
