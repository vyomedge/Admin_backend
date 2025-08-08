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



// service pages apis 
router.get("/AllService", servicePageController.getAllServicePages);
router.post("/servicepage", upload.single("featuredImage"), servicePageController.createServicePage);
router.put('/:id', upload.single('featuredImage'), servicePageController.updateServicePageById);
router.delete('/:id', servicePageController.deleteServicePageById);

module.exports = router;
