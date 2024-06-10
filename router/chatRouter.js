var express = require("express");
var router = express.Router();
var chatController = require("../controller/chatController");

const auth = require("../middleware/auth");


router.post("/chat-insert", chatController.insertChat);
router.get("/display-chat",chatController.displayChatByInquiry)


module.exports = router