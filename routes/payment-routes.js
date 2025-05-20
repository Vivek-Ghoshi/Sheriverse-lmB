const express = require("express");
const router = express.Router();
const { authenticateStudent } = require("../middlewares/authmiddleware");
const { createOrder, verifyPayment } = require("../controllers/payment-controller");

router.post("/create-order", authenticateStudent,createOrder);
router.post("/verify", authenticateStudent, verifyPayment);

module.exports = router;
