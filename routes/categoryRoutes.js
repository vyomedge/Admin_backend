const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const {upload} = require('../middleware/multer');

router.use(protect);

router.post('/', upload.single('image'), createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
