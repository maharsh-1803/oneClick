const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const InvestmentController = require('../controller/InvestmentController')

router.post('/addInvestment',auth,InvestmentController.AddInvestment);
router.put('/editInvestment/:id',auth,InvestmentController.EditInvestment);
router.delete('/deleteInvestment/:id',auth,InvestmentController.DeleteInvestment);
router.get('/getInvestment/:id',auth,InvestmentController.getInvestment);
router.get('/getInvestmentById/:id',auth,InvestmentController.getInvestmentById)

module.exports = router;