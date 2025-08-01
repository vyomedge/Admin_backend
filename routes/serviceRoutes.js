


const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const {upload} = require('../middleware/multer');
const { protect } = require('../middleware/auth'); 
router.get('/:panel', serviceController.getServices);
router.use(protect);
router.post('/', upload.single('image'), serviceController.createService);
router.get('/', serviceController.getServices);
// router.get('/:id', serviceController.getPortfolioById);
// router.put('/:id', upload.array('images', 10), serviceController.updatePortfolio);
// router.delete('/:id', serviceController.deletePortfolio);

module.exports = router;
