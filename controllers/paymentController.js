import asyncHandler from 'express-async-handler';

import Razorpay from 'razorpay';

const instance = new Razorpay({
  // key_id: 'YOUR_KEY_ID',
  // key_secret: 'YOUR_KEY_SECRET',
  key_id: "rzp_test_jk96M1tbCBGW2H",
  key_secret: 'XQoOhx6YjCyCmJIGtYJaWAhg',
});

// Checkout Product

export const checkoutProductController = asyncHandler(async (req, res) => {
  const {amount} = req.body;

  const option = {
    // id: uniqId(),
    // method: "COD",
    // status: "Cash on Delivery",
    // created: Date.now(),
    // amount: finalAmount,
    // currency: "usd",
    amount: 50000,
    currency: "INR",
  }

  const order = instance.orders.create(option);

  res.json({ success: true, order });
});

// Payment Verification

export const paymentVerificationController = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId } = req.body;

  res.json({ razorpayOrderId, razorpayPaymentId });
});
