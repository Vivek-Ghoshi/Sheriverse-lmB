const mongoose = require('mongoose');

// Instructor Schema
const instructorSchema = new mongoose.Schema({
    name: { type: String, required: true ,trim:true },
    email: { type: String, required: true, unique: true,trim:true },
    password: { type: String, required: true ,trim:true},
    role:{
       type:String,
       required:true,
       trim: true
    },
    experience:{
        type:String,
    },
    specialization:{
       type:String,
    },
    coursesTaught: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }]
}, { timestamps: true });

module.exports = mongoose.model('instructor',instructorSchema);