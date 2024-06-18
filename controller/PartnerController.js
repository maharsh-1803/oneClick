const Partner = require('../model/PartnerSchema');

exports.AddPartner = async (req, res) => {
    try {

        const { startupId, position, partner_name, DOB, city, state, country } = req.body;
        const file = req.file.filename;

        if (position === 'CEO') {
            const CheckCEO = await Partner.findOne({ startupId, position: 'CEO' });
            if (CheckCEO) {
                return res.status(400).json({
                    error: "A CEO already exists for this startup."
                });
            }
        }

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
            message: "patner create successfully",
            data: result
        });

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

exports.EditPartner = async (req, res) => {
    try {
        const { id } = req.params;
        const { startupId, position, partner_name, DOB, city, state, country } = req.body;


        const partner = await Partner.findById(id);
        if (!partner) {
            return res.status(400).send({ message: "partner is not available with this id" })
        }

        if (position === 'CEO' && partner.position !== 'CEO') {
            const checkCEO = await Partner.findOne({ startupId, position: 'CEO' });
            if (checkCEO) {
                return res.status(400).json({
                    error: "A CEO already exists for this startup."
                });
            }
        }

        let updateData = {
            position,
            partner_name,
            DOB,
            city,
            state,
            country,
        }

        if (req.file) {
            updateData.partner_photo = req.file.filename;
        }

        let updatedData = await Partner.findByIdAndUpdate(id, updateData, { new: true });
        return res.status(200).send(updatedData);


    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

exports.DeletePartner = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPartner = await Partner.findByIdAndDelete(id);
        if (!deletedPartner) {
            return res.status(400).send({ message: "partner is not there with this id" });
        }
        return res.status(200).json({
            message: "partner deleted successfully",
            data: deletedPartner
        });
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

exports.getPartner = async (req, res) => {
    const { id } = req.params;
    const baseURL = "https://oneclick-sfu6.onrender.com/partner"; 
    
    try {
        const partners = await Partner.findOne({ startupId: id });
        
        if (!partners) {
            return res.status(404).send({ message: "There are no partners within this startup" });
        }

        
        const partnersWithProfileImageURL = {
            ...partners.toObject(), 
            partner_photo: baseURL + "/" + partners.partner_photo
        };

        return res.status(200).send(partnersWithProfileImageURL);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}
