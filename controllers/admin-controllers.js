const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const courseModel = require("../models/courses-model");
const instructorModel = require("../models/Instructor-model");
const studentModel = require("../models/student-model");
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
    res.cookie("token", token,{
  httpOnly: true,
  secure: true,
  sameSite: "None"  // 🔥 Required for cross-origin cookies
});
    res.status(200).json(newAdmin);
  } catch (error) {
    console.log(error.message);
  }
};
// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminModel.findOne({ email:new RegExp(`^${email}$`, 'i') });
  if (!admin) return res.status(400).json({ message: "Invalid credentials" });
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  let token = jwt.sign(
    { email: admin.email, id: admin._id, role: admin.role },
    process.env.JWT_TOKEN
  );
  res.cookie("token", token,{
  httpOnly: true,
  secure: true,
  sameSite: "None"  // 🔥 Required for cross-origin cookies
});
  res.status(200).json(admin);
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
       name: { $regex: new RegExp(`^${instructor}$`, "i") },
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
      introUrl: videoUrl
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

//view all instructors
exports.allInstructors = async(req,res) =>{
  try {
    const instructors = await instructorModel.find();
    if(!instructors) console.log("no instructors found");
    res.json(instructors);
  } catch (error) {
    console.log(error.message);
  }
}

//upload course content
exports.uploadContent = async(req,res) =>{
  try {
    const {titles, descriptions, orders} = req.body;
    const files = req.files;
    const courseId = req.params.id;

    if(!files || files.length === 0){
       return res.json({success: false , message: "no files are uploaded"});
    }
    
    const uploadedVideos = files.map((file,index)=>({
      title: Array.isArray(titles) ? titles[index]: titles,
      description: Array.isArray(descriptions) ? descriptions[index] : descriptions,
      orders: Array.isArray(orders) ? orders[index] : orders,
      url: file.path,
      public_id: file.filename,
    }))
      const course = await courseModel.findById(courseId);
      if(!course){
         return res.status(404).res.json({success: false , message: "course not found"});
      }
      course.videoUrls.push(...uploadedVideos);
      await course.save();
      res.json({success:true, videos: uploadedVideos});

  } catch (error) {
    console.log(error.message);
  }
}

// get all student users
exports.getStudents = async(req,res)=>{
  try {
    const students = await studentModel.find();
    if(!students){
      return res.json({message:"No students are registerd Yet."})
    }
    res.json({students});
  } catch (error) {
    console.log(err.message);
  }
}

//get all admin users
exports.getAdmins = async(req,res)=>{
  try {
    const admins = await adminModel.find();
    if(!admins) return res.json({message:"no admins found"});
    res.json(admins);
  } catch (error) {
    console.log(error.message);
  }
}
