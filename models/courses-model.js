const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'instructor', required: true },
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'student' }],
    price: { type: Number, required: true },
    videoUrl: { type: String }, // Store Cloudinary video URL
    thumbnailUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('courses',courseSchema);