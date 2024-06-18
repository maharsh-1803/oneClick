const Grant = require("../model/GrantSchema");

exports.AddGrant = async (req, res) => {
    try {
        const { startupId, grant_name, grant_amount, date_when_available, grant_from, other_details } = req.body;

        const newGrant = new Grant({
            startupId,
            grant_name,
            grant_amount,
            date_when_available,
            grant_from,
            other_details
        })

        const result = await newGrant.save();
        return res.status(200).json({
            message: "Grant added successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.EditGrant = async (req, res) => {
    try {
        const { id } = req.params;
        const { grant_name, grant_amount, date_when_available, grant_from, other_details } = req.body;

        if (!grant_name || !grant_amount || !date_when_available || !grant_from) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const grant = await Grant.findById(id);
        if (!grant) {
            return res.status(404).send({ message: "Grant not found with this ID" });
        }

        let updateGrant = {
            grant_name,
            grant_amount,
            date_when_available,
            grant_from,
            other_details
        };

        let updatedGrant = await Grant.findByIdAndUpdate(id, updateGrant, { new: true });

        return res.status(200).json({
            message: "Grant updated successfully",
            data: updatedGrant
        });

    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.getGrant = async (req, res) => {
    try {
        const { id } = req.params;

        const grant = await Grant.findOne({ startupId: id });

        if (!grant) {
            return res.status(400).send({ message: "no any grant available with this startup" })
        }

        return res.status(200).send(grant);

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

exports.deleteGrant = async(req,res)=>{
    try {
        const {id} =  req.params;
        const grant = await Grant.findById(id);
        if(!grant){
            return res.status(400).send({message:"Grant is not available with this id"})
        }
        return res.status(200).json({
            message:"Grant deleted",
            data:grant
        })
    } catch (error) {
        return res.status(500).send({error})
    }
}