const getPanelDb = require("../config/dbManager");
const { uploadToCloudinary } = require("../middleware/multer");

exports.createService = async (req, res) => {
  try {
    const { panel } = req.user;
    console.log(panel)
    const { Service } = getPanelDb(panel);
    let imageUrl = null;
    let public_id = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "services");
      imageUrl = result.secure_url;
      public_id = result.public_id;
    }

    const service = new Service({
      ...req.body,
      image: {
        url: imageUrl,
        altText: req.body.imageAltText || "",
      },
    });

    await service.save();
    res.status(201).json({ service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create service" });
  }
};
exports.getServices = async (req, res) => {
  try {
    const panel = req.params.panel || req.user.panel;
    const { Service } = getPanelDb(panel);

    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({ services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};