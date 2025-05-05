const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true,trim: true },
    description: { type: String, required: true,trim: true },
    dueDate: { type: String},
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "instructor", required: true },
    content: String,
    submittedBy:{
        type:mongoose.Schema.Types.ObjectId, ref: "student",
    }
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
