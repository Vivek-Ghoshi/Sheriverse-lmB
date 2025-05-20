const express = require('express');
const upload = require('../config/multer-config');

const {
     adminLogin, adminLogout,
     createAdmin,
     createInstructor, removeInstructor,
     createCourse, deleteCourse, 
     allInstructors,
     uploadContent,
     getStudents,
     getAdmins
    }  = require('../controllers/admin-controllers');
const { authenticateAdmin } = require('../middlewares/authmiddleware');
const { celebrate } = require('celebrate');
const { createAdminValidation, adminLoginValidation, deleteCourseValidation, createCourseValidation, createInstructorValidation, removeInstructorValidation, uploadContentValidation } = require('../utils/validations/adminValidator');

const router = express.Router();

// Admin Authentication Routes
router.post('/create',celebrate(createAdminValidation),createAdmin);
router.post('/login',celebrate(adminLoginValidation), adminLogin); 
router.get('/logout', authenticateAdmin, adminLogout); 

// Course Management Routes
router.post('/course/create',
    upload.fields([
        {name:'video',maxCount: 1},
        {name:'image',maxCount: 1}
    ]), authenticateAdmin,celebrate(createCourseValidation), createCourse); 
router.get('/course/delete/:id', authenticateAdmin,celebrate(deleteCourseValidation), deleteCourse); 

// Instructor Management Routes

router.post('/instructor/create', authenticateAdmin,celebrate(createInstructorValidation), createInstructor); 
router.get('/instructor/remove/:id', authenticateAdmin,celebrate(removeInstructorValidation), removeInstructor); 
router.get('/all-instructors',authenticateAdmin,allInstructors);
router.post('/courses/:id/add-content',upload.array("videos"),authenticateAdmin,celebrate(uploadContentValidation),uploadContent);
router.get('/all/students',authenticateAdmin,getStudents);
router.get('/all/admins',authenticateAdmin,getAdmins);
module.exports = router;
