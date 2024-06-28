var express = require("express");
var router = express.Router();
const ReviewController = require("../controller/ReviewController");
const reviewcontroller = new ReviewController();

const auth = require("../middleware/auth");

router.post("/insert", auth, (req, res) => reviewcontroller.insert(req, res)); 
router.post("/edit", auth, (req, res) =>
  reviewcontroller.review_edit(req, res)
);
router.delete("/delete", auth, (req, res) =>
  reviewcontroller.review_delete(req, res)
);
router.get("/display", auth, (req, res) => reviewcontroller.display(req, res));
router.get('/displayReviewByproductId/:id',auth,(req,res)=>reviewcontroller.getReviewbyproductId(req,res))

module.exports = router;
