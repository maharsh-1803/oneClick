const mongoose = require("mongoose")
const Partner = require('../model/PartnerSchema');


exports.AddPartner = async (req, res) => {
    try {
        const tokenData = req.userdata;
        const userId = tokenData.id;


        const { startupId, position, partner_name, DOB, city, state, country } = req.body;
        const file = req.file.filename;

        const newPartner = new Partner({
            startupId,
            position,
            partner_name,
            DOB,
            city,
            state,
            country,
            partner_photo: file

        })
        let result = await newPartner.save();
        return res.status(200).json({
            message:"patner create successfully",
            data: result
        });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

exports.EditPartner = async(req,res)=>{
    try {
        const {id} = req.params;
        const { startupId, position, partner_name, DOB, city, state, country } = req.body;
        const file = req.file.filename;

        const partner = await Partner.findById(id);
        if(!partner){
            return res.status(400).send({message:"partner is not available with this id"})
        }
        
    } catch (error) {
        
    }
}