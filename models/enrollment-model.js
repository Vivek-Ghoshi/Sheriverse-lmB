const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",  // Reference to User collection (students)
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses", // Reference to Course collection
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0, // Percentage of course completed
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ["ongoing", "completed", "dropped"],
    default: "ongoing"
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  certificateIssued: {
    type: Boolean,
    default: false
  }
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = Enrollment;
