const Education = require("../model/EducationSchema");

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