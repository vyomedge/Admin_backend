const getPanelDb = require("../config/dbManager");
const { uploadToCloudinary } = require("../middleware/multer");

exports.getAllBlogs = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Blog } = getPanelDb(panel);

    const blogs = await Blog.find().populate("category", "name")  .sort({ createdAt: -1 });
    console.log(blogs)
    res.status(200).json({ blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Blog } = getPanelDb(panel);

    const blog = await Blog.findById(req.params.id).populate("Category", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Blog } = getPanelDb(panel);

    let imageUrl = null;
    let public_id = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "blogs");
      imageUrl = result.secure_url;
      public_id = result.public_id;
    }
    const blog = new Blog({
      ...req.body,
      featuredImage: {
        url: imageUrl,
        altText: req.body.featuredImageAltText || "",
      },
    });
    console.log(blog);
    await blog.save();
    const populatedBlog = await Blog.findById(blog._id).populate("category", "name");
    res.status(201).json({ populatedBlog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Blog } = getPanelDb(panel);

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Parse complex fields
    const tags = req.body.tags ? req.body.tags : [];
    const meta = req.body.meta ? req.body.meta : {};
    const ogTags = req.body.ogTags ? req.body.ogTags : {};

    let featuredImage = blog.featuredImage; // default = existing image

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "blogs");
      featuredImage = {
        url: result.secure_url,
        altText: req.body.featuredImageAltText || "",
      };
    }

    // Update values
    blog.title = req.body.title || blog.title;
    blog.description = req.body.description || blog.description;
    blog.category = req.body.category || blog.category;
    blog.tags = tags.length ? tags : blog.tags;
    blog.meta = Object.keys(meta).length ? meta : blog.meta;
    blog.ogTags = Object.keys(ogTags).length ? ogTags : blog.ogTags;
    blog.status = req.body.status || blog.status;
    blog.featuredImage = featuredImage;

    await blog.save();
      const populatedBlog = await Blog.findById(blog._id).populate("category", "name");
    res.status(200).json({ populatedBlog });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Blog } = getPanelDb(panel);

    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Delete image from Cloudinary if it exists
    if (blog.featuredImage?.public_id) {
      await cloudinary.uploader.destroy(blog.featuredImage.public_id);
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};
