const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
require("dotenv").config({ path: "../.env" });



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET, 
});


router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, 
    currency: 'INR',
    receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
    payment_capture: 1, 
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;
