const express = require('express');
const router = express.Router();
const { createCategory, getCategories } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
router.use(protect);
router.post('/', createCategory);    
router.get('/', getCategories);      

module.exports = router;
