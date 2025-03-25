const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true }, // Cloudinary file URL
    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);
