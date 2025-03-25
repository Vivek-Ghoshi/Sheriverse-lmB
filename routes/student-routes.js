const express = require("express");
const router = express.Router();
const { 
    registerUser,
    loginUser,
    logoutUser,
    getAllCourses, 
    getCourseById, 
    enrollCourse, 
    getEnrolledCourses, 
    getCourseContent, 
    submitAssignment 
} = require("../controllers/Student-controllers");
const { authenticateStudent } = require("../middlewares/authmiddleware");

// Routes for students
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// Logout Route
router.get('/logout',authenticateStudent, logoutUser);
router.get("/courses", authenticateStudent, getAllCourses); // Get all available courses
router.get("/courses/:id", authenticateStudent, getCourseById); // Get specific course details
router.post("/courses/:id/enroll", authenticateStudent, enrollCourse); // Enroll in a course
router.get("/enrolled-courses", authenticateStudent, getEnrolledCourses); // View enrolled courses
router.get("/courses/:id/content", authenticateStudent, getCourseContent); // Access course content
router.post("/assignments/:id/submit", authenticateStudent, submitAssignment); // Submit assignment

module.exports = router;
