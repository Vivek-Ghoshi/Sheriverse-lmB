const mongoose = require('mongoose');

// Student Schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim:true},
    email: { type: String, required: true, unique: true, trim:true },
    password: { type: String, required: true,trim:true },
    role: { type: String, required: true, trim:true},
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'courses' }],
    bio:String,
    phone: String,
    profile:String,
}, { timestamps: true });

module.exports = mongoose.model('student',studentSchema);
