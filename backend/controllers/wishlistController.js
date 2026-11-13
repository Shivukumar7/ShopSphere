const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name price discountPrice images rating numReviews brand countInStock isFeatured isTrending isBestSeller',
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json({
      success: true,
      wishlist: wishlist.products || [],
      count: wishlist.products?.length || 0,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.findIndex(
      (id) => id.toString() === productId.toString()
    );

    let isWishlisted = false;
    let message = '';

    if (index > -1) {
      wishlist.products.splice(index, 1);
      message = 'Product removed from wishlist';
      isWishlisted = false;
    } else {
      wishlist.products.push(productId);
      message = 'Product added to wishlist';
      isWishlisted = true;
    }

    await wishlist.save();

    res.json({
      success: true,
      message,
      isWishlisted,
      count: wishlist.products.length,
      productIds: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
};
