

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


const getPanelDb = require('../config/dbManager');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.getAllBlogs = async (req, res) => {
  try {
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

    let featuredImage = {};

    // Upload to Cloudinary if image present
    if (req.file) {
      const folderName = `blogs/${panel}`;
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: folderName,
              resource_type: 'image',
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      featuredImage = {
        url: result.secure_url,
        public_id: result.public_id,
        altText: req.body.altText || 'Blog image',
      };
    }

    const blogData = {
      ...req.body,
      authorId: _id,
      authorName: name,
      featuredImage,
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

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // If a new image is uploaded, delete old image and upload new one
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (blog.featuredImage?.public_id) {
        await cloudinary.uploader.destroy(blog.featuredImage.public_id);
      }

      const folderName = `blogs/${panel}`;
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: folderName,
              resource_type: 'image',
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      req.body.featuredImage = {
        url: result.secure_url,
        public_id: result.public_id,
        altText: req.body.altText || 'Blog image',
      };
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ blog: updatedBlog });
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

    // Delete image from Cloudinary if it exists
    if (blog.featuredImage?.public_id) {
      await cloudinary.uploader.destroy(blog.featuredImage.public_id);
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};
