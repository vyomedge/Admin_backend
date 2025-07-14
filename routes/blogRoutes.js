
// const express = require('express');
// const router = express.Router();
// const blogController = require('../controllers/blogController');
// const { protect } = require('../middleware/auth');

// router.get('/', protect, blogController.getAllBlogs);
// router.post('/', protect, blogController.createBlog);

// module.exports = router;


const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

// Apply `protect` to all routes
router.use(protect);

// GET all blogs
router.get('/', blogController.getAllBlogs);

// GET a single blog by ID
router.get('/:id', blogController.getBlogById);

// CREATE a new blog
router.post('/', blogController.createBlog);

// UPDATE a blog
router.put('/:id', blogController.updateBlog);

// DELETE a blog
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
