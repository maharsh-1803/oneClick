const Education = require("../model/EducationSchema");
const User = require('../model/UserSchema');

// exports.EducationAdd = async (req, res) => {
//     try {
//         const tokenData = req.userdata;
//         const { college_university_name, passing_year, highest_Education } = req.body;

//         if (!college_university_name || !passing_year || !highest_Education) {
//             return res.status(400).json({ error: 'All fields are required' });
//         }

//         const newEducation = new Education({
//             userId: tokenData.id,
//             college_university_name,
//             passing_year,
//             highest_Education
//         })

//         const education = await newEducation.save();
//         return res.status(200).json({
//             success: true,
//             message: "education add successfully",
//             data: education
//         })
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         })
//     }
// }

exports.EducationEdit = async(req,res)=>{
    try {
        const tokenData = req.userdata;  
        const { college_university_name, passing_year, highest_Education } = req.body;

        const education = await Education.findOne({ userId: tokenData.id });
        if (!education) {
            return res.status(404).json({ message: "Education record not found" });
        }

        if (college_university_name !== undefined) {
            education.college_university_name = college_university_name;
        }
        if (passing_year !== undefined) {
            education.passing_year = passing_year;
        }
        if (highest_Education !== undefined) {
            education.highest_Education = highest_Education;
        }

        await education.save();

        res.status(200).json({
            message: "Education details updated successfully",
            education
        });
    } catch (error) {
        console.error("Error updating education details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getEducation = async(req,res)=>{
    try {
        const tokenData = req.userdata;
        const education = await Education.findOne({userId:tokenData.id});

        if(!education)
        {
            return res.status(400).send({message:"Education details is not there with this userid"});
        }

        return res.status(200).send(education)
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}
