var express = require("express");
var router = express.Router();
const UserController = require("../controller/UserController");
const usercontroller = new UserController();
const path = require("path");

const auth = require("../middleware/auth");
const multer = require("multer");
// const user = require("../model/UserSchema");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "storage/images/profile");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});


const upload = multer({ storage: storage });

router.post("/register", upload.single("image"), (req, res) =>
  usercontroller.postuser(req, res)
); //done
router.post("/login", (req, res) => usercontroller.user_login(req, res)); //done
router.get("/display", auth, (req, res) =>
  usercontroller.user_display(req, res)
); //done
router.post("/edit", upload.single("image"), auth, (req, res) =>
  usercontroller.edituser(req, res)
); //done
router.post("/change-password", auth, (req, res) =>
  usercontroller.changepassword(req, res)
);
router.post("/forget-password", (req, res) =>
  usercontroller.forgetPassword(req, res)
);

module.exports = router;
