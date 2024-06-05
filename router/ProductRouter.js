var express = require("express");
var router = express.Router();
const ProductController = require("../controller/ProductController");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const productcontroller = new ProductController();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "storage/images/product");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

router.post("/insert", upload.array("image", 10), auth, (req, res) =>
  productcontroller.insert(req, res)
); //done
router.post("/edit", upload.array("image", 10), auth, (req, res) =>
  productcontroller.product_edit(req, res)
); //done
router.delete("/delete", auth, (req, res) =>
  productcontroller.product_delete(req, res)
); //done

router.get("/productdisplaydetail", auth, (req, res) =>
  productcontroller.product_displaydetail(req, res)
); //done

router.get("/productdisplayByCategory", auth, (req, res) =>
  productcontroller.productdisplay_ByCategory(req, res)
); //done

router.get("/subcategory_by_product", auth, (req, res) =>
  productcontroller.productdisplay_By_sub_category(req, res)
)

module.exports = router;
