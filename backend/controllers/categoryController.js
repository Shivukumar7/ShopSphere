const Category = require('../models/Category');

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const categoryExists = await Category.findOne({ slug: generatedSlug });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: 'Category with this slug already exists' });
    }

    const category = await Category.create({
      name,
      slug: generatedSlug,
      description: description || '',
      image: image || '',
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.name = req.body.name || category.name;
    if (req.body.slug) category.slug = req.body.slug;
    category.description = req.body.description !== undefined ? req.body.description : category.description;
    category.image = req.body.image !== undefined ? req.body.image : category.image;
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive;

    const updatedCategory = await category.save();
    res.json({ success: true, category: updatedCategory });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.deleteOne();
    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
