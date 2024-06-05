var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");
const awardController = require("../controller/awardController");
const awardcontroller = new awardController();

const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "storage/images/award");
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
  awardcontroller.insert(req, res)
);
router.get("/displaybasic", auth, (req, res) =>
  awardcontroller.displaybasic(req, res)
);
router.post("/edit", upload.single("image"), auth, (req, res) =>
  awardcontroller.award_edit(req, res)
);

router.delete("/delete", auth, (req, res) =>
  awardcontroller.award_delete(req, res)
);
router.get("/getAwardById", auth, (req, res) =>
  awardcontroller.getAwardById(req, res)
);

module.exports = router;
