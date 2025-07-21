// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const portfolioController = require('../controllers/portfolioController');

// const storage = multer.diskStorage({});
// const upload = multer({ storage });
// const { protect } = require('../middleware/auth');
// router.use(protect);

// router.post('/portfolio', upload.array('images', 10), portfolioController.createPortfolio);
// // router.get('/portfolio', portfolioController.getPortfolios);
// router.put('/portfolio/:id', upload.array('images', 10), portfolioController.updatePortfolio);
// router.delete('/portfolio/:id', portfolioController.deletePortfolio);

// module.exports = router;


const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const {upload} = require('../middleware/multer');
const { protect } = require('../middleware/auth'); // optional

router.use(protect); // optional auth middleware

router.post('/portfolio', upload.array('images', 10), portfolioController.createPortfolio);
router.get('/portfolio', portfolioController.getAllPortfolios);
router.get('/portfolio/:id', portfolioController.getPortfolioById);
router.put('/portfolio/:id', upload.array('images', 10), portfolioController.updatePortfolio);
router.delete('/portfolio/:id', portfolioController.deletePortfolio);

module.exports = router;
