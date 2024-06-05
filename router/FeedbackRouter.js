var express = require("express");
var router = express.Router();
const FeedbackController = require("../controller/FeedbackController");
const feedbackcontroller = new FeedbackController();

const auth = require("../middleware/auth");

router.post("/insert", auth, (req, res) => feedbackcontroller.insert(req, res));
router.get("/display", auth, (req, res) =>
  feedbackcontroller.display(req, res)
); //done

module.exports = router;
