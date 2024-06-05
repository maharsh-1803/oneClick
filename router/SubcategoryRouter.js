var express = require("express");
var router = express.Router();
const SubcategoryController = require("../controller/SubcategoryController");
const subcategorycontroller = new SubcategoryController();

const fileUpload = require("../middleware/fileUpload");
const auth = require("../middleware/auth");

router.post(
  "/create",
  fileUpload("storage/images/subcategory"),
  auth,
  (req, res) => subcategorycontroller.subcategory_insert(req, res)
);
router.get("/read", auth, (req, res) =>
  subcategorycontroller.display_by_id(req, res)
);
router.post(
  "/update",
  fileUpload("storage/images/subcategory"),
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
