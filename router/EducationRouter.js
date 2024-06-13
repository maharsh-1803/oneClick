const express = require('express');
const EducationController = require('../controller/EducationController');
const router = express.Router();
const auth = require('../middleware/auth')

router.post("/addEducation", auth, EducationController.EducationAdd)
router.patch('/EditEducation',auth,EducationController.EducationEdit)

module.exports = router;