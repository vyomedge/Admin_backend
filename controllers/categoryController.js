const getPanelDb = require('../config/dbManager');

exports.createCategory = async (req, res) => {
  try {
    const { name, displayName, description } = req.body;
    const { panel } = req.user;
    const { Category } = getPanelDb(panel);

    // Prevent duplicates
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name, displayName, description });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Category } = getPanelDb(panel);

    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};