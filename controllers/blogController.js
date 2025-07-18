

const getPanelDb = require("../config/dbManager");
const cloudinary = require("cloudinary").v2;

exports.getAllBlogs = async (req, res) => {
  try {
    console.log( req.user , "pppppppppppppppppppppppppppppp")
    const { panel } = req.user;
    const { Blog } = getPanelDb(panel);

    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Blog } = getPanelDb(panel);

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { panel, _id, name } = req.user;
    const { Blog } = getPanelDb(panel);

    // Inject author info from JWT
    const blogData = {
      ...req.body,
      authorId: _id,
      authorName: name
    };

    const blog = await Blog.create(blogData);
    res.status(201).json({ blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Blog } = getPanelDb(panel);

    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { panel } = req.user;
    const { Blog } = getPanelDb(panel);

    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};