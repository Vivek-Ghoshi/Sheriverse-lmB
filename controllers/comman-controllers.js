const courseModel = require('../models/courses-model');


const getAllCourses = async (req, res) => {
    try {
        const courses = await courseModel.find().populate("instructor","name");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error: error.message });
        console.log(error.message);
    }
};

module.exports = {getAllCourses}



