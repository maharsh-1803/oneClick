const express = require('express');
const router = express.Router();
const DocumentController = require('../controller/DocumentController')
const auth = require('../middleware/auth');
const path = require('path');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "storage/images/document");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
        );
    }
})

const fileFilter = function(req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter:fileFilter
});


router.post('/AddDocument',auth,upload.single('file'),DocumentController.AddDocument);
router.put('/EditDocument',auth,upload.single('file'),DocumentController.EditDocument);
router.get('/getDocument',auth,DocumentController.getDocument);

module.exports = router;
