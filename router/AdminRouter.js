var express = require('express');
var router = express.Router();
const AdminController = require('../controller/AdminController');
const admincontroller = new AdminController();
const auth = require("../middleware/auth")

router.post('/register', (req, res) => admincontroller.postadmin(req, res));
router.post('/login', (req, res) => admincontroller.logadmin(req, res));
router.post('/changePassword', auth, (req, res) => admincontroller.changePassword(req, res));
router.post('/forgetPassword', (req, res) => admincontroller.forgetPassword(req, res));


router.get('/all_user_display', auth, (req, res) => admincontroller.allUserDisplay(req, res));
router.get('/user-display-by-id', auth, (req, res) => admincontroller.userDisplayById(req, res));
router.put('/changeUserDocumentStatus/:id',auth,(req,res)=>admincontroller.documentStatusChange(req,res));

router.get('/all_startup_display', auth, (req, res) => admincontroller.allStartupDisplay(req, res));
router.get('/startup-display-by-id', auth, (req, res) => admincontroller.startupDisplayById(req, res))

router.get('/product-display-by-id', auth, (req, res) => admincontroller.productDisplayById(req, res));

router.get('/all-find-inquiry', auth, (req, res) => admincontroller.displayAllInquiry(req, res));
router.get('/inquiry-details', auth, (req, res) => admincontroller.inquiryDetails(req, res))


module.exports = router;