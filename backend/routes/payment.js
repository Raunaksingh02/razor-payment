const express = require("express");
const Razorpay = require("razorpay");
require('dotenv').config(); 
const router = express.Router();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
router.post("/payment/orders", async (req, res) => {
    try{
        const instance = new Razorpay({
            key_id: keyId,
            key_secret:  keySecret,
        });
        const options = {
            amount: 50000, 
            currency: "INR",
            receipt: "receipt_order_74394",
        };
        const order = await instance.orders.create(options);
        if (!order) {
            return res.status(500).send("Some error occurred while creating the order");
        }
        res.json(order);
    } catch (error) {
        
        res.status(500).send(error.message);
    }
});

module.exports = router;
