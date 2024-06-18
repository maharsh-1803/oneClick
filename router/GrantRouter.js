const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js')
const GrantController = require('../controller/GrantController.js')

router.post('/AddGrant',auth,GrantController.AddGrant);
router.put('/EditGrant/:id',auth,GrantController.EditGrant);
router.get('/getGrant/:id',auth,GrantController.getGrant);
router.delete('/deleteGrant/:id',auth,GrantController.deleteGrant);

module.exports = router;