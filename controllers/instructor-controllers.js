const Assignment = require("../models/Assignment-model");
const Submission = require("../models/Submission-model");
const instructorModel = require('../models/Instructor-model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');



const loginInstructor = async(req,res)=>{
   try {
        const {email,password} = req.body;
        let instructor = await instructorModel.findOne({email});
        if(!instructor) res.status(401).send("no account found with this email");

        const isMatch = await bcrypt.compare(password,instructor.password);
        if(!isMatch) res.status(401).json("invalid credentials");
        
        const token = jwt.sign({email:instructor.email, id:instructor._id,role:instructor.role},process.env.JWT_TOKEN);
        res.cookie("token", token);
        res.status(200).json({instructor});

   } catch (error) {
     console.log(error.message);
   }
}
const logoutInstructor = (req,res)=>{
    try {
        res.clearCookie('token');
        res.json({message : "instructor logged out sucessfully"})
    } catch (error) {
        console.log(error.message);
    }
}

// @desc    Create a new assignment
// @route   POST /instructor/assignments
// @access  Private (Instructor)
const createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const instructorId = req.user.id; // Assuming user ID is stored in req.user
        
        const newAssignment = new Assignment({ title, description, dueDate, instructor: instructorId });
        await newAssignment.save();

        res.status(201).json({ message: "Assignment created successfully!", assignment: newAssignment });
    } catch (error) {
        res.status(500).json({ message: "Error creating assignment", error: error.message });
    }
};

// @desc    Get all assignments by instructor
// @route   GET /instructor/assignments
// @access  Private (Instructor)
const getAssignments = async (req, res) => {
    try {
        const instructorId = req.user.id;
        const assignments = await Assignment.find({ instructor: instructorId });

        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching assignments", error: error.message });
    }
};

// @desc    Get submissions for a specific assignment
// @route   GET /instructor/assignments/:id/submissions
// @access  Private (Instructor)
const getAssignmentSubmissions = async (req, res) => {
    try {
        const { id } = req.params;
        const submissions = await Submission.find({ assignment: id }).populate("student", "name email");
        if(submissions.length == 0) res.json({message : "no submissions yet"});
       
        res.status(200).json({message : "These students are doing great work",submissions});
    } catch (error) {
        res.status(500).json({ message: "Error fetching submissions", error: error.message });
    }
};

// @desc    Update an assignment
// @route   PUT /instructor/assignments/:id
// @access  Private (Instructor)
const updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate } = req.body;

        const updatedAssignment = await Assignment.findByIdAndUpdate(
            id,
            { title, description, dueDate },
            { new: true }
        );

        res.status(200).json({ message: "Assignment updated successfully!", assignment: updatedAssignment });
    } catch (error) {
        res.status(500).json({ message: "Error updating assignment", error: error.message });
    }
};

// @desc    Delete an assignment
// @route   DELETE /instructor/assignments/:id
// @access  Private (Instructor)
const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;

        await Assignment.findByIdAndDelete(id);
        res.status(200).json({ message: "Assignment deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting assignment", error: error.message });
    }
};

module.exports = {
    loginInstructor,
    logoutInstructor,
    createAssignment,
    getAssignments,
    getAssignmentSubmissions,
    updateAssignment,
    deleteAssignment
};
