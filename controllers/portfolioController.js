const cloudinary = require("../config/cloudinary");
const getPanelDb = require("../config/dbManager");

exports.createPortfolio = async (req, res) => {
  console.log("create protfolio");

  try {
    const { panel } = req.user;
    const { Portfolio } = getPanelDb(panel);

    const folder = req.query.folder || "portfolio_images";
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    const images = [];
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      images.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const portfolio = new Portfolio({ category, images });
    await portfolio.save();

    // Populate category name
    await portfolio.populate("category", "name");

    res.status(201).json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPortfolios = async (req, res) => {
  try {
    const panel = req.params.panel || req.user.panel;
    const { Portfolio } = getPanelDb(panel);
    const portfolios = await Portfolio.find().populate("category", "name");
    res.status(200).json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPortfoliosByCategoryId = async (req, res) => {
  try {
    const { panel } = req.params;
    console.log('panel00' , panel) 
    const { Portfolio } = getPanelDb(panel);
    const { categoryIds } = req.body;
       if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({ message: "categoryIds must be a non-empty array" });
    }
        const portfolios = await Portfolio.find({
      category: { $in: categoryIds },
    });

    if (!portfolios || portfolios.length === 0) {
      return res.status(404).json({ message: "No portfolios found for this category" });
    }

    res.status(200).json({ portfolios });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch portfolios" });
  }
};

exports.getPortfolioById = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Portfolio } = getPanelDb(panel);
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Portfolio } = getPanelDb(panel);
    const folder = req.query.folder || "portfolio_images";

    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });
    for (const img of portfolio.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    const images = [];
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      images.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    portfolio.images = images;
    await portfolio.save();

    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Portfolio } = getPanelDb(panel);
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });
    for (const img of portfolio.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Portfolio.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Portfolio and images deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
