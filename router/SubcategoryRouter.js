var express = require("express");
var router = express.Router();
const SubcategoryController = require("../controller/SubcategoryController");
const subcategorycontroller = new SubcategoryController();

const auth = require("../middleware/auth");
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "storage/images/subcategory");
  },
  filename: function (req, file, cb) {
      cb(
          null,
          `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
  }
})

const upload = multer({
    storage:storage
})


router.post(
  "/create",
  upload.single('file'),
  auth,
  (req, res) => subcategorycontroller.subcategory_insert(req, res)
);
router.get("/read", auth, (req, res) =>
  subcategorycontroller.display_by_id(req, res)
);
router.post(
  "/update",
  upload.single('file'),
  auth,
  (req, res) => subcategorycontroller.subcategory_update(req, res)
);
router.delete("/delete", auth, (req, res) =>
  subcategorycontroller.subcategory_delete(req, res)
);
router.get("/displayAll", auth, (req, res) =>
  subcategorycontroller.subcategory_display_all(req, res)
);
router.get("/displayAllByCategoryId", auth, (req, res) =>
  subcategorycontroller.subcategory_display_by_category(req, res)
);

module.exports = router;
