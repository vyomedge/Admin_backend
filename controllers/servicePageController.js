const { default: mongoose } = require("mongoose");
const getPanelDb = require("../config/dbManager");
const { uploadToCloudinary, deleteFromCloudinary } = require("../middleware/multer");

exports.createServicePage = async (req, res) => {
  try {
    console.log('panel')
    const { panel } = req.user;
    const { servicePage } = getPanelDb(panel);
    let imageUrl = null;
    let public_id = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "servicepages");
      imageUrl = result.secure_url;
      public_id = result.public_id;
    }
    const page = new servicePage({
      ...req.body,
      featuredImage: {
        url: imageUrl,
        altText: req.body.featuredImage["AltText"] || "",
      },
    });
    await page.save();
    const populatedPage = await servicePage
      .findById(page._id)
      .populate("serviceCategory", "name")
      .populate("blogcategory", "name")
      .populate("Portfolio", "name");

    res.status(201).json({ populatedPage });
  } catch (error) {
    console.error("Error creating service page:", error);
    res.status(500).json({ message: "Failed to create service page", error });
  }
};

exports.getAllServicePages = async (req, res) => {
  try {
    console.log(req?.user?.panel)
    const panel = req?.params?.panel || req?.user?.panel;
    const { servicePage } = getPanelDb(panel);
    const pages = await servicePage
      .find()
      .populate("serviceCategory", "name")
      .populate("blogcategory", "name")
      .populate("Portfolio", "name");

    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service pages", error });
  }
};

exports.getServicePageById = async (req, res) => {
  try {
    const panel = req.params.panel || req.user.panel;
    const { servicePage, Blog, Category, Portfolio } = getPanelDb(panel);
    const identifier = req.params.id;
    let page = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      page = await servicePage
        .findById(identifier)
        .populate("serviceCategory" )
    }
    if (!page) {
      page = await servicePage
        .findOne({ uid: identifier })
        .populate("serviceCategory" )
    }

    console.log(page)
    if (!page) {
      return res.status(404).json({ message: "Service page not found" });
    }
    console.log(page);
    const categoryIds = Array.isArray(page.blogcategory)
      ? page.blogcategory.map((c) => c._id.toString())
      : [page.blogcategory._id.toString()];

    const blogs = await Blog.find({
      category: categoryIds,
    }).populate("category", "name");

    const portfolioCategoryIds = Array.isArray(page.Portfolio)
      ? page.Portfolio.map((p) => p._id.toString())
      : [page.Portfolio._id.toString()];

    const relatedPortfolios = await Portfolio.find({
      category: portfolioCategoryIds,
    }).populate("category", "name");

    // console.log(relatedPortfolios);
    res.status(200).json({
      ...page.toObject(),
      relatedBlogs: blogs,
      relatedPortfolios: relatedPortfolios,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service page", error });
  }
};

// // Update a service page
exports.updateServicePageById = async (req, res) => {
  try {
    const { panel } = req.user;
    const { servicePage } = getPanelDb(panel);
console.log(servicePage                     )
    const pageId = req.params.id;

    // Fetch existing page
    const existingPage = await servicePage.findById(pageId);
    if (!existingPage) {
      return res.status(404).json({ message: "Service page not found" });
    }

    let imageUrl = existingPage.featuredImage?.url || null;
    let public_id = existingPage.featuredImage?.public_id || "";

    // If a new file is uploaded, upload it to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "servicepages");
      imageUrl = result.secure_url;
      public_id = result.public_id;
    }

    // Update the fields
    const updatedData = {
      ...req.body,
      featuredImage: {
        url: imageUrl,
        altText: req.body.featuredImage?.AltText || existingPage.featuredImage?.altText || "",
        public_id,
      },
    };

    // Update the service page
    const updatedPage = await servicePage.findByIdAndUpdate(
      pageId,
      updatedData,
      { new: true }
    )
    .populate("serviceCategory", "name")
    .populate("blogcategory", "name")
    .populate("Portfolio", "name");

    res.status(200).json({ updatedPage });
  } catch (error) {
    console.error("Error updating service page:", error);
    res.status(500).json({ message: "Failed to update service page", error });
  }
};


// // Delete a service page
exports.deleteServicePageById = async (req, res) => {
  try {
    const { panel } = req.user;
    const { servicePage } = getPanelDb(panel);

    const pageId = req.params.id;

    // 1. Find the service page
    const page = await servicePage.findById(pageId);
    if (!page) {
      return res.status(404).json({ message: "Service page not found" });
    }

    // 2. Delete image from Cloudinary if it exists
    const publicId = page.featuredImage?.public_id;
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }

    // 3. Delete the page from database
    await servicePage.findByIdAndDelete(pageId);

    res.status(200).json({ message: "Service page deleted successfully" });
  } catch (error) {
    console.error("Error deleting service page:", error);
    res.status(500).json({ message: "Failed to delete service page", error });
  }
};