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
    const newUser = await studentModel.create({
         name,
         email,
         role:"student",
         password: hashedPassword 
        });
    const token = jwt.sign({email:newUser.email,id:newUser._id,role:newUser.role},process.env.JWT_TOKEN);
    res.cookie('token',token);
    res.status(201).json({ message: 'User registered successfully',newUser });
    }
    catch(err){
        console.log(err.message);
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Find User
    const user = await studentModel.findOne({email});
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare Passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate Token
    const token = jwt.sign({ email: user.email,id:user._id, role:user.role}, process.env.JWT_TOKEN);
    res.cookie('token', token);
    res.json({ message: 'Login successful', user});
};

// Logout User
const logoutUser = (req, res) => {
    console.log("logout route hit hua")
    res.clearCookie('token');
    console.log("logout sucessfully")
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
        console.log("request controller tak pahuchi j");
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
        const enrollments = await enrollmentModel.findOne({ student: studentId }).populate("course", "title description thumbnailUrl");
        // i can use this afterwards (enrollments.map(enrollment => enrollment.course)) 
        
        res.status(200).json(enrollments.course);
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

module.exports = {
    loginUser,
    registerUser,
    logoutUser,
    getCourseById,
    enrollCourse,
    getEnrolledCourses,
    getCourseContent,
    assignments,
    submitAssignment
};
