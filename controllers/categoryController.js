const getPanelDb = require("../config/dbManager");
const { uploadToCloudinary } = require("../middleware/multer");

exports.createCategory = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Category } = getPanelDb(panel);

    const { name, description, metaTitle, metaDescription } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    let imageUrl = "";
    let public_id = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "categories");
      imageUrl = result.secure_url;
      public_id = result.public_id;
    }

    const category = await Category.create({
      name,
      description,
      metaTitle,
      metaDescription,
      image: imageUrl,
      imagePublicId: public_id,
    });

    res.status(201).json(category);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Category } = getPanelDb(panel);

    const categories = await Category.find().sort({ createdAt: -1 });
    console.log(categories)
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { panel } = req.user;
    const { Category } = getPanelDb(panel);

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ message: "Failed to fetch category" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { panel } = req.user;
    const { Category } = getPanelDb(panel);

    const { name, description, metaTitle, metaDescription } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (req.file) {
      if (category.imagePublicId) {
        await deleteFromCloudinary(category.imagePublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, "categories");
      category.image = result.secure_url;
      category.imagePublicId = result.public_id;
    }

    // Update other fields
    category.name = name || category.name;
    category.description = description || category.description;
    category.metaTitle = metaTitle || category.metaTitle;
    category.metaDescription = metaDescription || category.metaDescription;

    await category.save();

    res.json(category);
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ message: "Failed to update category" });
  }
};

// ✅ Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { panel } = req.user;
    const { Category } = getPanelDb(panel);

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete image from Cloudinary if exists
    if (category.imagePublicId) {
      await deleteFromCloudinary(category.imagePublicId);
    }

    await Category.findByIdAndDelete(id);

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
