var express = require('express');
var router = express.Router();
const InqubationController = require('../controller/InqubationController');
const inqubationcontroller = new InqubationController();

const auth = require('../middleware/auth');

router.post('/insert', auth, (req, res) => inqubationcontroller.insert(req, res));
router.get('/display', auth, (req, res) => inqubationcontroller.display(req, res));

module.exports = router;