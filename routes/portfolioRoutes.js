const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const {upload} = require('../middleware/multer');
const { protect } = require('../middleware/auth'); 
router.get('/:panel', portfolioController.getAllPortfolios);
router.post('/:panel', portfolioController.getPortfoliosByCategoryId);

router.use(protect);
router.post('/', upload.array('images', 10), portfolioController.createPortfolio);
router.get('/', portfolioController.getAllPortfolios);
router.get('/:id', portfolioController.getPortfolioById);
router.put('/:id', upload.array('images', 10), portfolioController.updatePortfolio);
router.delete('/:id', portfolioController.deletePortfolio);

module.exports = router;
