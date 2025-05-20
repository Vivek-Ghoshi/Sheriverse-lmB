const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    title: {type : String},
    description: String,
    url:{ type:String},
    public_id: {type:String},
    order: Number
},{_id:false});
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'instructor', required: true },
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'student' }],
    price: { type: Number, required: true },
    isFree:{type: Boolean,default:false},
    duration:{type: String},
    introUrl:{ type: String},
    videoUrls: [videoSchema],
    thumbnailUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('courses',courseSchema);