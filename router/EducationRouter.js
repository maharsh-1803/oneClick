const express = require('express');
const EducationController = require('../controller/EducationController');
const router = express.Router();
const auth = require('../middleware/auth')

// router.post("/addEducation", auth, EducationController.EducationAdd)
router.put('/EditEducation',auth,EducationController.EducationEdit)
router.get('/getEducation',auth,EducationController.getEducation)

module.exports = router;