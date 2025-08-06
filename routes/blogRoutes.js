

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const {upload} = require('../middleware/multer');

router.get('/:panel', blogController.getAllBlogs);
router.get('/:id/:panel', blogController.getBlogById);
router.use(protect);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', upload.single('featuredImage'), blogController.createBlog);
router.put('/:id', upload.single('featuredImage'), blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;




/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', blogController.getAllBlogs);