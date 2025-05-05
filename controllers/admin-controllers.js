const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const courseModel = require("../models/courses-model");
const instructorModel = require("../models/Instructor-model");
const adminModel = require("../models/admin-model");

//create Admin
exports.createAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const admin = await adminModel.findOne({ email });
    if (admin)
      res
        .status(300)
        .send({
          message:
            "Email is already registerd please try login to that account",
        });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = await adminModel.create({
      name,
      email,
      role: "admin",
      password: hashedPassword,
    });
    let token = jwt.sign(
      { email: newAdmin.email, id: newAdmin._id, role: newAdmin.role },
      process.env.JWT_TOKEN
    );
    res.cookie("token", token);
    res.status(200).json(newAdmin);
  } catch (error) {
    console.log(error.message);
  }
};
// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminModel.findOne({ email });
  if (!admin) return res.status(400).json({ message: "Invalid credentials" });
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  let token = jwt.sign(
    { email: admin.email, id: admin._id, role: admin.role },
    process.env.JWT_TOKEN
  );
  res.cookie("token", token);
  res.status(200).json({ admin });
};

// Admin Logout
exports.adminLogout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// Create Course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, instructor, price,duration } = req.body;
    if (!req.files) {
      console.log("file and image is required");
    }
    const instractorDetails = await instructorModel.findOne({
      name: instructor,
    });
    if (!instractorDetails) {
      console.log("no instractor found with this name");
    }

    const videoUrl =
      req.files["video"][0].path || req.files["video"][0].secure_url;
    const thumbnailUrl =
      req.files["image"][0].path || req.files["image"][0].secure_url;
    const course = await courseModel.create({
      title,
      description,
      instructor: instractorDetails._id,
      price,
      duration,
      thumbnailUrl,
      videoUrl
    });
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error creating course" });
    console.log(error);
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await courseModel.findByIdAndDelete(id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};

// Create Instructor Account
exports.createInstructor = async (req, res) => {
  try {
    const { name, email, password, experience, specialization } =
      req.body;
    const existingInstructor = await instructorModel.findOne({ email });
    if (existingInstructor)
      return res.status(400).json({ message: "Instructor already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const instructor = await instructorModel.create({
      name,
      email,
      role: "instructor",
      password: hashedPassword,
      specialization,
      experience,
    });
    await instructor.save();
    res
      .status(201)
      .json({ message: "Instructor created successfully", instructor });
  } catch (error) {
     console.log(error.message);
  }
};

// Remove Instructor
exports.removeInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await instructorModel.findByIdAndDelete(id);
    res.json({ message: "Instructor removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing instructor", error });
  }
};
exports.allInstructors = async(req,res) =>{
  try {
    const instructors = await instructorModel.find();
    if(!instructors) console.log("no instructors found");
    res.json(instructors);
  } catch (error) {
    console.log(error.message);
  }
}
