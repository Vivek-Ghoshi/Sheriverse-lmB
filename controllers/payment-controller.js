const razorpay = require("razorpay");
const crypto = require("crypto");
require('dotenv').config();
const courseModel = require('../models/courses-model');
const enrollmentModel = require('../models/enrollment-model');
const studentModel = require("../models/student-model");

const razorpayInstance = new razorpay({
    key_id : process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_KEY_SECRET,
});

// create order

exports.createOrder = async(req,res)=>{
  try {
    console.log("order chala")
    const {id}  = req.body;
    const course = await courseModel.findById(id);
    if(!course) return res.status(400).json({message:"no course found with this id"});
    
    const amount = course.price * 100;
    const options = {
        amount,
        currency:"INR",
        receipt: `receipt_${Date.now()}`
    }
   try {
    const order = await razorpayInstance.orders.create(options);
    res.json({orderId: order.id});
   } catch (error) {
    console.log("failed to create razorpay order");
   }

  } catch (error) {
    console.log(error.message);
  }
}

// verify payment
exports.verifyPayment = async(req,res)=>{
    try {
        console.log("verify payment chala");
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
        console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId);
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac('sha256',process.env.RAZOR_KEY_SECRET)
          .update(body)
          .digest("hex")

        if(expectedSignature === razorpay_signature){
            const user = req.user.id;
            const alreadyEnrolled = await enrollmentModel.findOne({user,course:courseId});
            if(!alreadyEnrolled){
                await enrollmentModel.create({
                student: user,
                course: courseId,
                paymentId: razorpay_payment_id,
            });

            // Adding this Course in Student model
            await studentModel.findByIdAndUpdate(
            user,
            { $addToSet: { enrolledCourses: courseId } }, // $addToSet prevents duplicates
            { new: true }
        );
            
        }
        res.json({sucess: true});
        }else{
            res.status(400).json({error:"invalid signatue"})
        }  
    } catch (error) {
        console.log(error.message);
    }
};