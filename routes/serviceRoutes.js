const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const servicePageController = require("../controllers/servicePageController");

const { upload } = require("../middleware/multer");

router.get("/:panel", serviceController.getServices);
router.get("/AllServicePages/:panel", servicePageController.getAllServicePages);
router.get( "/getServicePageById/:id/:panel",servicePageController.getServicePageById);
const { protect } = require("../middleware/auth");
router.use(protect);
router.post("/", upload.single("image"), serviceController.createService);
router.get("/", serviceController.getServices);
router.post("/servicepage", upload.single("featuredImage"), servicePageController.createServicePage);
// router.get('/:id', serviceController.getPortfolioById);
// router.put('/:id', upload.array('images', 10), serviceController.updatePortfolio);
// router.delete('/:id', serviceController.deletePortfolio);

module.exports = router;
