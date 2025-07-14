const cloudinary = require('../config/cloudinary');

exports.createPortfolio = async (req, res) => {
  try {
    // req.files should be multer middleware processed files
    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, { folder: 'portfolio_images' })
    );

    const uploadResults = await Promise.all(uploadPromises);

    const images = uploadResults.map(result => result.secure_url);

    const portfolio = new Portfolio({ images });
    await portfolio.save();

    res.status(201).json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.status(200).json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updatePortfolio = async (req, res) => {
  try {
    const images = req.files.map(file => file.path); // New Cloudinary URLs
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { images },
      { new: true }
    );
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.status(200).json({ message: 'Portfolio deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};