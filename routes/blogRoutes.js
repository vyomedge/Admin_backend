
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
const upload = require('../middleware/multer');

router.use(protect);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', upload.single('featuredImage'), blogController.createBlog);
router.put('/:id', upload.single('featuredImage'), blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
