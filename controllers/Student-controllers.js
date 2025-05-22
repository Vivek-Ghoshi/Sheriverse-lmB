const courseModel = require("../models/courses-model");
const enrollmentModel = require("../models/enrollment-model");
const assignmentModel = require("../models/Assignment-model");
const SubmissionModel = require("../models/Submission-model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const studentModel = require('../models/student-model')



// Register User
const registerUser = async (req, res) => {
    try{
    const { name, email, password } = req.body;
    const existingUser = await studentModel.findOne({email});
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
     
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const user = await studentModel.create({
         name,
         email,
         role:"student",
         password: hashedPassword 
        });
    const token = jwt.sign({email:user.email,id:user._id,role:user.role},process.env.JWT_TOKEN);
    res.cookie('token',token,{
  httpOnly: true,
  secure: true,
  sameSite: "None"  // 🔥 Required for cross-origin cookies
});
    res.status(201).json(user);
    }
    catch(err){
        console.log(err.message);
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("chala");
    // Find User
    const user = await studentModel.findOne({email});
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare Passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate Token
    const token = jwt.sign({ email: user.email,id:user._id, role:user.role}, process.env.JWT_TOKEN);
    res.cookie('token', token,{
  httpOnly: true,
  secure: true,
  sameSite: "None"  // 🔥 Required for cross-origin cookies
});
    console.log("send user");
    res.json(user);
};

// Logout User
const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};


const getCourseById = async (req, res) => {
    try {
        const course = await courseModel.findById(req.params.id).populate("instructor","name");
        if (!course) return res.status(404).json({ message: "Course not found" });

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Error fetching course", error: error.message });
    }
};

const enrollCourse = async (req, res) => {
    try { 
        const studentId = req.user.id;
        const courseId = req.params.id;
        
        // Check if already enrolled
        const existingEnrollment = await enrollmentModel.findOne({ student: studentId, course: courseId });

        if (existingEnrollment) return res.status(400).json({ message: "Already enrolled in this course" });

        const newEnrollment = new enrollmentModel({ student: studentId, course: courseId });
        await newEnrollment.save();
        if(newEnrollment){
            const course = await courseModel.findOne({courseId})
            course.studentsEnrolled.push(studentId);
            await course.save();
        }
        res.status(201).json({enrollment: newEnrollment});
    } catch (error) {
        res.status(500).json({ message: "Error enrolling in course", error: error.message });
    }
};

// @desc    Get enrolled courses for a student
// @route   GET /student/enrolled-courses
// @access  Private (Student)

const getEnrolledCourses = async (req, res) => {
    try {
        const studentId = req.user.id;
        const enrollments = await enrollmentModel.find({ student: studentId }).populate("course", "title description thumbnailUrl");
        const enrolledCourses =  (enrollments.map(enrollment => enrollment.course)) 
        res.status(200).json(enrolledCourses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching enrolled courses", error: error.message });
    }
};

const getCourseContent = async (req, res) => {
    try {
        const studentId = req.user.id;
        const courseId = req.params.id;

        // Check if student is enrolled
        const enrollment = await enrollmentModel.findOne({ student: studentId, course: courseId });
        if (!enrollment) return res.status(403).json({ message: "Access denied. You are not enrolled in this course" });

        const course = await courseModel.findById(courseId).select("title content");
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Error fetching course content", error: error.message });
    }
};

const assignments = async (req,res)=>{
    try {
        const assignment = await assignmentModel.find();
        if(!assignment) console.log("no assignment found");
        res.json(assignment);
    } catch (error) {
        console.log(error.message);
    }
}

const submitAssignment = async (req, res) => {
    try {
        const { fileUrl } = req.body;
        const studentId = req.user.id;
        const assignmentId = req.params.id;

        // Check if assignment exists
        const assignment = await assignmentModel.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });

        const newSubmission = new SubmissionModel({ assignment: assignmentId, student: studentId, fileUrl });
        await newSubmission.save();

        res.status(201).json({ message: "Assignment submitted successfully", submission: newSubmission });
    } catch (error) {
        res.status(500).json({ message: "Error submitting assignment", error: error.message });
    }
};

const editStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id; // set by auth middleware
    const { name, phone, bio } = req.body;
    let profilePicUrl;
    // Handle profilePic upload if file is provided
    if (req.file) {
      profilePicUrl = req.file.secure_url || req.file.path;
    }
    console.log("profilepicurl : ",profilePicUrl);
    // Fetch student
    const student = await studentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update only provided fields
    if (name) student.name = name;
    if (phone) student.phone = phone;
    if (bio) student.bio = bio;
    if (profilePicUrl) student.profile = profilePicUrl;

    await student.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile",
    });
  }
};

const getProfile = async(req,res)=>{
    try {
        const userId = req.user.id;
        const profile = await studentModel.findById(userId);
        if(!profile) return res.json({message:"no profile found with this"});
        res.json(profile);
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    loginUser,
    registerUser,
    logoutUser,
    getCourseById,
    enrollCourse,
    getEnrolledCourses,
    getCourseContent,
    assignments,
    submitAssignment,
    editStudentProfile,
    getProfile,
};
