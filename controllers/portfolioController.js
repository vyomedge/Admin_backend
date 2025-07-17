// const cloudinary = require('../config/cloudinary');

// exports.createPortfolio = async (req, res) => {
//   try {
//     // req.files should be multer middleware processed files
//     const uploadPromises = req.files.map(file =>
//       cloudinary.uploader.upload(file.path, { folder: 'portfolio_images' })
//     );

//     const uploadResults = await Promise.all(uploadPromises);

//     const images = uploadResults.map(result => result.secure_url);

//     const portfolio = new Portfolio({ images });
//     await portfolio.save();

//     res.status(201).json(portfolio);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.getAllPortfolios = async (req, res) => {
//   try {
//     const portfolios = await Portfolio.find();
//     res.status(200).json(portfolios);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.updatePortfolio = async (req, res) => {
//   try {
//     const images = req.files.map(file => file.path); // New Cloudinary URLs
//     const portfolio = await Portfolio.findByIdAndUpdate(
//       req.params.id,
//       { images },
//       { new: true }
//     );
//     if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
//     res.status(200).json(portfolio);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.deletePortfolio = async (req, res) => {
//   try {
//     const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
//     if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
//     res.status(200).json({ message: 'Portfolio deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.getPortfolioById = async (req, res) => {
//   try {
//     const portfolio = await Portfolio.findById(req.params.id);
//     if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
//     res.status(200).json(portfolio);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



const cloudinary = require('../config/cloudinary');
const Portfolio = require('../models/Portfolio');

exports.createPortfolio = async (req, res) => {
  try {
    const folder = req.query.folder || 'portfolio_images';

    const uploadPromises = req.files.map(file => {
      return cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) throw error;
        }
      );
    });

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

exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const folder = req.query.folder || 'portfolio_images';

    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    // delete existing images from Cloudinary
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
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    // delete Cloudinary images
    for (const img of portfolio.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await Portfolio.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Portfolio and images deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
