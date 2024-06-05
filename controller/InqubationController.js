const BaseController = require('./BaseController');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const InqubationcenterSchema = require('../model/InqubationcenterSchema');
const jwt = require("jsonwebtoken");

module.exports = class InqubationController extends BaseController{
    async insert(req, res){
        try {
            const tokenData = req.userdata;

            const data = {
                IcName: req.body.IcName,
                IcCity: req.body.IcCity,
                IcState: req.body.IcState,
                IcAddress: req.body.IcAddress,
                IcContactNumber: req.body.IcContactNumber,
                IcContactPerson: req.body.IcContactPerson,
                IcEmail: req.body.IcEmail,
                pincode: req.body.pincode
            }

            const inqubationData = new InqubationcenterSchema(data);

            const newInqubation = await inqubationData.save();

            return this.sendJSONResponse(
                res,
                "data saved",
                {
                    length: 1
                },
                newInqubation
            );
        } catch (error) {
            if(error instanceof NotFound){
                throw error;
            }
            return this.sendErrorResponse(req, res, error);
        }
    }

    async display(req, res){
        try {
            const tokenData = req.userdata;

            const inqubations = await InqubationcenterSchema.find({}).sort({updatedAt: -1});

            return this.sendJSONResponse(
                res,
                "All inqubations",
                {
                    length: 1
                },
                inqubations
            );
        } catch (error) {
            if(error instanceof NotFound){
                throw error;    
            }
            return this.sendErrorResponse(req, res, error);
        }
    }
}