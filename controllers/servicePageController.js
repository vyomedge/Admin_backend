const getPanelDb = require("../config/dbManager");
const { uploadToCloudinary } = require("../middleware/multer");

exports.createServicePage = async (req, res) => {
  try {
    const { panel } = req.user;
    const { servicePage } = getPanelDb(panel);

    console.log({ servicePage });
    let imageUrl = null;
    let public_id = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "servicepages");
      imageUrl = result.secure_url;
      public_id = result.public_id;
    }
    console.log(req.body);
    const page = new servicePage({
      ...req.body,
      featuredImage: {
        url: imageUrl,
        altText: req.body.featuredImage["AltText"] || "",
      },
    });

    console.log(page);
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
    console.log(req.params.panel);
    const panel = req.params.panel || req.user.panel;
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
    const page = await servicePage
      .findById(req.params.id)
      .populate("serviceCategory")
      .populate("blogcategory", "name")
      .populate("Portfolio", "name");

    if (!page) {
      return res.status(404).json({ message: "Service page not found" });
    }
    const blogs = await Blog.find({
      category:[ page.blogcategory].map((c) => c._id.toString()),
    });

    const relatedPortfolios = await Portfolio.find({
      category: [page.Portfolio].map((p) => p._id.toString()),
    });

    console.log(relatedPortfolios);
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
// exports.updateServicePage = async (req, res) => {
//   try {
//     const updatedPage = await ServicePage.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     if (!updatedPage) {
//       return res.status(404).json({ message: "Service page not found" });
//     }

//     res.status(200).json(updatedPage);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update service page", error });
//   }
// };

// // Delete a service page
// exports.deleteServicePage = async (req, res) => {
//   try {
//     const deletedPage = await ServicePage.findByIdAndDelete(req.params.id);

//     if (!deletedPage) {
//       return res.status(404).json({ message: "Service page not found" });
//     }

//     res.status(200).json({ message: "Service page deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete service page", error });
//   }
// };
