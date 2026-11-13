const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to calculate totals
const formatCartResponse = (cart) => {
  const items = cart.items || [];
  const itemsPrice = items.reduce((acc, item) => {
    const price = item.product?.price || item.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const shippingPrice = itemsPrice > 50 || itemsPrice === 0 ? 0 : 9.99;
  const taxPrice = Number((itemsPrice * 0.08).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return {
    _id: cart._id,
    user: cart.user,
    items,
    itemsPrice: Number(itemsPrice.toFixed(2)),
    shippingPrice,
    taxPrice,
    totalPrice,
    totalItems: items.reduce((acc, item) => acc + item.quantity, 0),
  };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discountPrice images countInStock brand slug',
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.countInStock < quantity) {
      return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.countInStock) {
        return res.status(400).json({ success: false, message: `Only ${product.countInStock} items available in stock` });
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity: Number(quantity),
        price: product.price,
      });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price discountPrice images countInStock brand slug',
    });

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity <= 0) {
      return removeCartItem(req, res, next);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (quantity > product.countInStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.countInStock} units in stock`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = Number(quantity);
      cart.items[itemIndex].price = product.price;
      await cart.save();
    } else {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price discountPrice images countInStock brand slug',
    });

    res.json({
      success: true,
      message: 'Cart updated',
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove single item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price discountPrice images countInStock brand slug',
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({
      success: true,
      message: 'Cart cleared',
      cart: { items: [], totalItems: 0, itemsPrice: 0, totalPrice: 0 },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
