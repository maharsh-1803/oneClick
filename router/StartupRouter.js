var express = require("express");
var router = express.Router();
const StartupController = require("../controller/StartupController");
const startupcontroller = new StartupController();

const auth = require("../middleware/auth");
const fileUpload = require("../middleware/fileUpload");

router.post(
  "/insert",
  fileUpload("storage/images/startup"),
  auth,
  (req, res) => startupcontroller.insert(req, res)
); //done
router.get("/displaybasic", auth, (req, res) =>
  startupcontroller.displayBasic(req, res)
); //done
router.get("/displaydetail", auth, (req, res) =>
  startupcontroller.displayDetail(req, res)
); //done

router.post("/edit", fileUpload("storage/images/startup"), auth, (req, res) =>
  startupcontroller.edit(req, res)
);

router.get("/displayByFilter", auth, (req, res) =>
  startupcontroller.display_by_filter(req, res)
); //done
router.delete("/delete", auth, (req, res) =>
  startupcontroller.startup_delete(req, res)
); //done
router.get("/displaycenterId", auth, (req, res) =>
  startupcontroller.displaycenterId(req, res)
); //done

module.exports = router;
