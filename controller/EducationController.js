const Education = require("../model/EducationSchema");
const User = require('../model/UserSchema');

exports.EducationAdd = async (req, res) => {
    try {
        const tokenData = req.userdata;
        const { college_university_name, passing_year, highest_Education } = req.body;

        if (!college_university_name || !passing_year || !highest_Education) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newEducation = new Education({
            userId: tokenData.id,
            college_university_name,
            passing_year,
            highest_Education
        })

        const education = await newEducation.save();
        res.status(200).json({
            success: true,
            message: "education add successfully",
            data: education
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.EducationEdit = async(req,res)=>{
    try {
        const tokenData = req.userdata;  
        const { college_university_name, passing_year, highest_Education } = req.body;

        // Find the user by ID from the token data
        const user = await User.findById(tokenData.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the education record by user ID
        const education = await Education.findOne({ userId: user._id });
        if (!education) {
            return res.status(404).json({ message: "Education record not found" });
        }

        // Update only the provided fields
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
