var express = require("express");
var router = express.Router();
const CategoryController = require("../controller/CategoryController");
const categorycontroller = new CategoryController();

const fileUpload = require("../middleware/fileUpload");
const auth = require("../middleware/auth");

router.post(
  "/create",
  fileUpload("storage/images/category"),
  auth,
  (req, res) => categorycontroller.category_insert(req, res)
); // done

router.get("/displayById", auth, (req, res) =>
  categorycontroller.display_by_id(req, res)
); // done

router.post(
  "/update",
  fileUpload("storage/images/category"),
  auth,
  (req, res) => categorycontroller.category_update(req, res)
); // done

router.delete("/delete", auth, (req, res) =>
  categorycontroller.category_delete(req, res)
); // done

router.get("/displayAll", auth, (req, res) =>
  categorycontroller.category_display_all(req, res)
); //done

router.get("/displayAllWithoutAuth", (req, res) =>
  categorycontroller.category_display_all_withoutAuth(req, res)
); //done

module.exports = router;
