const express = require('express');
const router = express.Router();
const multer = require('multer');
const portfolioController = require('../controllers/portfolioController');

const storage = multer.diskStorage({});
const upload = multer({ storage });
const { protect } = require('../middleware/auth');
router.use(protect);

router.post('/portfolio', upload.array('images', 10), portfolioController.createPortfolio);
// router.get('/portfolio', portfolioController.getPortfolios);
router.put('/portfolio/:id', upload.array('images', 10), portfolioController.updatePortfolio);
router.delete('/portfolio/:id', portfolioController.deletePortfolio);

module.exports = router;
