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
const { celebrate } = require("celebrate");
const { loginInstructorValidation, createAssignmentValidation, updateAssignmentValidation, getAssignmentSubmissionsValidation } = require("../utils/validations/instructorValidation");

// Routes for instructors
router.post('/login',celebrate(loginInstructorValidation), loginInstructor);
router.get('/logout',authenticateInstructor,logoutInstructor);
router.post("/create-assignment",upload.single('file'),authenticateInstructor,celebrate(createAssignmentValidation),createAssignment);
router.get("/assignments", authenticateInstructor,celebrate(updateAssignmentValidation),getAssignments);
router.get("/assignments/:id/submissions", authenticateInstructor,celebrate(getAssignmentSubmissionsValidation), getAssignmentSubmissions);
router.post("/assignments/:id/update", authenticateInstructor,celebrate(updateAssignmentValidation), updateAssignment);
router.get("/assignments/:id/delete", authenticateInstructor, deleteAssignment);

module.exports = router;
