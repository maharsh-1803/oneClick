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
        return res.status(200).send({
            message:"Investment save successfully",
            Investment_detail:result
        })
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

exports.EditInvestment = async(req,res)=>{
    try {
        
        const {id} = req.params;
        const {investment_amount,investor_name,date_when_available,other_details} = req.body;
    
        const investment = await Investment.findById(id);
        if(!investment){
            return res.status(400).send({message:"investment not found with this id"})
        }
    
        let updateInvestment = {
            investment_amount,
            investor_name,
            date_when_available,
            other_details
        }
    
        let updatedInvestment = await Investment.findByIdAndUpdate(id,updateInvestment,{new:true})
    
        return res.status(200).send({
            message:"Investment Edit successfully",
            investment_detail:updatedInvestment
        })
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

exports.DeleteInvestment = async(req,res)=>{
    try {
        
        const {id} = req.params;
    
        const investment = await Investment.findById(id);
        if(!investment){
            return res.status(400).send({message:"investment is not there with this id"});
        }
    
        const investmentDelete = await Investment.findByIdAndDelete(id);
        return res.status(200).json({
            message:"investment deleted successfully",
            investment:investmentDelete
        })
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
}

exports.getInvestment = async(req,res)=>{
    try {
        const {id} = req.params;

        const investments = await Investment.find({startupId:id});
        if(!investments){
            return res.status(400).send({message:"no any investment within this startup"})
        }

        return res.status(200).json({
            message:"investment retrive successfully",
            investments:investments
        })
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}