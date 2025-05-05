const express = require('express');
const router = express.Router();
const {getAllCourses} = require('../controllers/comman-controllers');


router.get("/courses", getAllCourses);


module.exports = router;
