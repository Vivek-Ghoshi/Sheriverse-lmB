const Assignment = require("../models/Assignment-model");
const Submission = require("../models/Submission-model");
const instructorModel = require("../models/Instructor-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginInstructor = async (req, res) => {
  try {
    const { email, password } = req.body;
    let instructor = await instructorModel.findOne({ email:new RegExp(`^${email}$`, 'i') });
    if (!instructor) res.status(401).send("no account found with this email");

    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) res.status(401).json("invalid credentials");

    const token = jwt.sign(
      { email: instructor.email, id: instructor._id, role: instructor.role },
      process.env.JWT_TOKEN
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None", // 🔥 Required for cross-origin cookies
    });
    res.status(200).json({ instructor });
  } catch (error) {
    console.log(error.message);
  }
};
const logoutInstructor = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "instructor logged out sucessfully" });
  } catch (error) {
    console.log(error.message);
  }
};

const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const instructorId = req.user.id;
    // const file = req.file?.path || req.file?.secure_url;
    const newAssignment = new Assignment({
      title,
      description,
      dueDate,
      instructor: instructorId,
    });
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Error creating assignment", error: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const assignments = await Assignment.find({ instructor: instructorId });
    res.status(200).json(assignments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
};

const getAssignmentSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    const submissions = await Submission.find({ assignment: id }).populate(
      "student",
      "name email"
    );
    if (submissions.length == 0) res.json({ message: "no submissions yet" });

    res
      .status(200)
      .json({ message: "These students are doing great work", submissions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching submissions", error: error.message });
  }
};

// @desc    Update an assignment
// @route   PUT /instructor/assignments/:id
// @access  Private (Instructor)
const updateAssignment = async (req, res) => {
  try {
    console.log("request yha tak aai");
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    console.log(title, description, dueDate);
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { title, description, dueDate },
      { new: true }
    );
    console.log("yha se updated assignment bheja");
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating assignment", error: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await Assignment.findByIdAndDelete(id);
    console.log("assignment deleted");
    res.status(200).json({ message: "Assignment deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting assignment", error: error.message });
  }
};

module.exports = {
  loginInstructor,
  logoutInstructor,
  createAssignment,
  getAssignments,
  getAssignmentSubmissions,
  updateAssignment,
  deleteAssignment,
};
