var express = require("express");
var router = express.Router();
const CategoryController = require("../controller/CategoryController");
const categorycontroller = new CategoryController();
const auth = require("../middleware/auth");
const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "storage/images/category");
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
  (req, res) => categorycontroller.category_insert(req, res)
); // done

router.get("/displayById", auth, (req, res) =>
  categorycontroller.display_by_id(req, res)
); // done

router.post(
  "/update",
  upload.single('file'),
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
