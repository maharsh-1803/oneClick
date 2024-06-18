const Investment = require("../model/InvestmentSchema");

exports.AddInvestment = async(req,res)=>{
    try {
        const {startupId,investment_amount,investor_name,date_when_available,other_details} = req.body;

        const newInvestment = new Investment({
            startupId,
            investment_amount,
            investor_name,
            date_when_available,
            other_details
        })

        const result = await newInvestment.save();
        return res.status(200).sene({
            message:"Investment save successfully",
            Investment_detail:result
        })
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

exports.EditInvestment = async(req,res)=>{
    const {id} = req.params;
    const {investment_amount,investor_name,date_when_available,other_details} = req.body;

    const updateInvestment = {
        investment_amount,
        investor_name,
        date_when_available,
        other_details
    }
}