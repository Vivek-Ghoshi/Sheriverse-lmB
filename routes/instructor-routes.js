const express = require("express");
const router = express.Router();
const { 
    loginInstructor,
    logoutInstructor,
    createAssignment, 
    getAssignments, 
    getAssignmentSubmissions, 
    updateAssignment, 
    deleteAssignment 
} = require("../controllers/instructor-controllers");
const { authenticateInstructor } = require("../middlewares/authmiddleware");
const upload = require("../config/multer-config");

// Routes for instructors
router.post('/login', loginInstructor);
router.get('/logout',authenticateInstructor,logoutInstructor);
router.post("/create-assignment",upload.single('file'),authenticateInstructor, createAssignment);
router.get("/assignments", authenticateInstructor, getAssignments);
router.get("/assignments/:id/submissions", authenticateInstructor, getAssignmentSubmissions);
router.post("/assignments/:id/update", authenticateInstructor, updateAssignment);
router.get("/assignments/:id/delete", authenticateInstructor, deleteAssignment);

module.exports = router;
