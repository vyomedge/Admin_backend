// const getPanelDb = require('../config/dbManager');

// exports.getAllBlogs = async (req, res) => {
//   try {
//     console.log( req.user , "pppppppppppppppppppppppppppppp")
//     const { panel } = req.user;
//     const { Blog } = getPanelDb(panel);

//     const blogs = await Blog.find().sort({ createdAt: -1 });
//     res.status(200).json({ blogs });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to fetch blogs' });
//   }
// };

// exports.getBlogById = async (req, res) => {
//   try {
//     const { panel } = req.user;
//     const { Blog } = getPanelDb(panel);

//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ message: 'Blog not found' });

//     res.status(200).json({ blog });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to fetch blog' });
//   }
// };

// exports.createBlog = async (req, res) => {
//   try {
//     const { panel, _id, name } = req.user;
//     const { Blog } = getPanelDb(panel);

//     // Inject author info from JWT
//     const blogData = {
//       ...req.body,
//       authorId: _id,
//       authorName: name
//     };

//     const blog = await Blog.create(blogData);
//     res.status(201).json({ blog });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to create blog' });
//   }
// };

// exports.updateBlog = async (req, res) => {
//   try {
//     const { panel } = req.user;
//     const { Blog } = getPanelDb(panel);

//     const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });

//     if (!blog) return res.status(404).json({ message: 'Blog not found' });

//     res.status(200).json({ blog });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to update blog' });
//   }
// };

// exports.deleteBlog = async (req, res) => {
//   try {
//     const { panel } = req.user;
//     const { Blog } = getPanelDb(panel);

//     const blog = await Blog.findByIdAndDelete(req.params.id);
//     if (!blog) return res.status(404).json({ message: 'Blog not found' });

//     res.status(200).json({ message: 'Blog deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to delete blog' });
//   }
// };

const getPanelDb = require("../config/dbManager");
const cloudinary = require("cloudinary").v2;

exports.getAllBlogs = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Blog } = getPanelDb(panel);

    const blogs = await Blog.find().sort({ createdAt: -1 });
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

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

exports.createBlog = async (req, res) => {
  const { panel } = req.user;
  const { Blog } = getPanelDb(panel);
  try {
    let featuredImageData = {};

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blogs",
      });

      featuredImageData = {
        url: result.secure_url,
        public_id: result.public_id,
        altText: req.body.altText || "",
      };
    }

    const blogData = {
      ...req.body,
      featuredImage: featuredImageData,
    };
    console.log(blogData);
    const blog = await Blog.create(blogData);
    res.status(201).json(blog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: "Blog creation failed" });
  }
};

exports.updateBlog = async (req, res) => {
  try {
     const { panel } = req.user;
    const { Blog } = getPanelDb(panel);

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    let featuredImageData = blog.featuredImage;

    if (req.file) {
      if (featuredImageData?.public_id) {
        await cloudinary.uploader.destroy(featuredImageData.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blogs',
      });

      featuredImageData = {
        url: result.secure_url,
        public_id: result.public_id,
        altText: req.body.altText || '',
      };

    }

    blog.set({ ...req.body, featuredImage: featuredImageData });
    await blog.save();

    res.status(200).json(blog);
  } catch (err) {
    console.error('Error updating blog:', err);
    res.status(500).json({ error: 'Blog update failed' });
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
