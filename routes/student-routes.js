const express = require("express");
const router = express.Router();
const upload = require('../config/multer-config');
const { 
    registerUser,
    loginUser,
    logoutUser,
    getCourseById, 
    enrollCourse, 
    getEnrolledCourses, 
    getCourseContent, 
    submitAssignment, 
    assignments,
    editStudentProfile
} = require("../controllers/Student-controllers");
const { authenticateStudent } = require("../middlewares/authmiddleware");
const { celebrate } = require("celebrate");
const { registerValidation, loginValidation, getCourseByIdValidation, enrollCourseValidation, getCourseContentValidation, submitAssignmentValidation, editStudentProfileValidation } = require("../utils/validations/authValidation");

// Routes for students
router.post('/register',celebrate(registerValidation) ,registerUser);

// Login Route
router.post('/login',celebrate(loginValidation), loginUser);

// Logout Route
router.get('/logout',authenticateStudent, logoutUser);
 // Get all available courses
router.get("/courses/:id", authenticateStudent,celebrate(getCourseByIdValidation), getCourseById); // Get specific course details
router.get("/courses/:id/enroll", authenticateStudent,celebrate(enrollCourseValidation), enrollCourse); // Enroll in a course
router.get("/enrolled-courses", authenticateStudent, getEnrolledCourses); // View enrolled courses
router.get("/courses/:id/content", authenticateStudent,celebrate(getCourseContentValidation), getCourseContent); // Access course content
router.get("/assignments",authenticateStudent,assignments);
router.post("/assignments/:id/submit", authenticateStudent,celebrate(submitAssignmentValidation), submitAssignment); // submit assignment
router.post("/edit-profile",authenticateStudent,upload.single('image'),celebrate(editStudentProfileValidation),editStudentProfile)

module.exports = router;
