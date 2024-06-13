const express = require('express');
const router = express.Router();
const PartnerController = require('../controller/PartnerController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "storage/images/partner");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
        );
    }
})
const upload = multer({
    storage: storage,
});

router.post('/AddPartner', auth, upload.single('file'), PartnerController.AddPartner);
router.put('/EditPartner/:id',upload.single('file'),auth,PartnerController.EditPartner)
router.delete('/DeletePartner/:id',auth,PartnerController.DeletePartner)

module.exports = router;