var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");
const certificateController = require("../controller/certificateController");
const certificatecontroller = new certificateController();

const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "storage/images/certificate");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

router.post("/insert", upload.single("image"), auth, (req, res) =>
  certificatecontroller.insert(req, res)
); // done

router.get("/displaybasic", auth, (req, res) =>
  certificatecontroller.cerificate_displaybasic(req, res)
); // done

router.post("/edit", upload.single("image"), auth, (req, res) =>
  certificatecontroller.certificate_edit(req, res)
); //done

router.delete("/delete", auth, (req, res) =>
  certificatecontroller.certificate_delete(req, res)
); //done

router.get("/getCertificateById", auth, (req, res) =>
  certificatecontroller.getCertificateById(req, res)
); //done

module.exports = router;
