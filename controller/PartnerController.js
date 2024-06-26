const Partner = require('../model/PartnerSchema');

exports.AddPartner = async (req, res) => {
    try {
        const { startupId, position, partner_name, DOB, city, state, country } = req.body;
        const file = req.file.filename;
        const uniquePositions = ['CEO', 'CFO', 'CTO', 'CSO', 'CMO'];

        // Check if the position is in the uniquePositions array
        if (!uniquePositions.map(pos => pos.toUpperCase()).includes(position.toUpperCase())) {
            return res.status(400).json({
                error: `The position ${position} is not allowed. Only the following positions are allowed: ${uniquePositions.join(', ')}.`
            });
        }

        // Check if a partner with the same position already exists for the startup
        const existingPartner = await Partner.findOne({
            startupId,
            position: { $regex: new RegExp(`^${position}$`, 'i') }
        });

        if (existingPartner) {
            return res.status(400).json({
                error: `A ${existingPartner.position} already exists for this startup.`
            });
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
        });

        let result = await newPartner.save();
        return res.status(200).json({
            message: "Partner created successfully",
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

        const uniquePositions = ['CEO', 'CFO', 'CTO', 'CSO'];

        if (uniquePositions.map(pos => pos.toUpperCase()).includes(position.toUpperCase())) {
            const existingPartner = await Partner.findOne({
                startupId,
                position: { $regex: new RegExp(`^${position}$`, 'i') }
            });

            if (existingPartner) {
                return res.status(400).json({
                    error: `A ${existingPartner.position} already exists for this startup.`
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
        const partners = await Partner.find({ startupId: id });
        
        if (partners.length === 0) {
            return res.status(404).send({ message: "There are no partners within this startup" });
        }

        const partnersWithProfileImageURL = partners.map(partner => ({
            ...partner.toObject(), 
            partner_photo: `${baseURL}/${partner.partner_photo}`
        }));

        return res.status(200).json({
            message: "Partners retrieved successfully",
            data: partnersWithProfileImageURL
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

exports.getPartnerById = async (req, res) => {
    try {
        const { id } = req.params;
        const partner = await Partner.findById(id);
        const baseURL = "https://oneclick-sfu6.onrender.com/partner";

        if (!partner) {
            return res.status(400).send({ message: "Partner not found with this ID" });
        }
        const photoURL = `${baseURL}/${partner.partner_photo}`;
        const partnerResponse = {
            ...partner._doc, 
            photoURL: photoURL 
        };

        return res.status(200).json({
            message: "Partner retrieved successfully",
            partner: partnerResponse
        });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

