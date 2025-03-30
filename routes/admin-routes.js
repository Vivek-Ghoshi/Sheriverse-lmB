const express = require('express');
const upload = require('../config/multer-config');

const {
     adminLogin, adminLogout,
     createAdmin,
     createInstructor, removeInstructor,
     createCourse, deleteCourse 
    }  = require('../controllers/admin-controllers');
const { authenticateAdmin } = require('../middlewares/authmiddleware');

const router = express.Router();

// Admin Authentication Routes
router.post('/create',createAdmin);
router.post('/login', adminLogin); 
router.get('/logout', authenticateAdmin, adminLogout); 

// Course Management Routes

router.post('/course/create',
    upload.fields([
        {name:'video',maxCount: 1},
        {name:'image',maxCount: 1}
    ]), authenticateAdmin, createCourse); 
router.get('/course/delete/:id', authenticateAdmin, deleteCourse); 

// Instructor Management Routes

router.post('/instructor/create', authenticateAdmin, createInstructor); 
router.get('/instructor/remove/:id', authenticateAdmin, removeInstructor); 

module.exports = router;
