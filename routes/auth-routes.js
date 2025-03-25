const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/auth-controllers');


// Register Route
router.get('/',function(req,res){
    res.send("hn bhai chal rha h no problem");
})


module.exports = router;
