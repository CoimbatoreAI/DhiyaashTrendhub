import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

const router = express.Router();

router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt, products, customerName, customerEmail } = req.body;
    
    if (!amount || amount < 100) {
      return res.status(400).json({ message: 'Amount must be at least 100 paise' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount,
      currency,
      receipt,
    };

    const order = await instance.orders.create(options);
    
    // Create pending order in DB
    const newOrder = new Order({
      customerName,
      customerEmail,
      totalAmount: amount / 100, // store in rupees
      currency,
      products,
      razorpayOrderId: order.id,
      status: 'Pending'
    });
    
    await newOrder.save();

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      dbOrderId: newOrder._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is successful
      if (dbOrderId) {
        const order = await Order.findById(dbOrderId);
        if (order) {
          order.status = 'Paid';
          order.razorpayPaymentId = razorpay_payment_id;
          order.razorpaySignature = razorpay_signature;
          await order.save();
          
          // Send emails asynchronously
          sendOrderConfirmationEmail(order).catch(console.error);
        }
      }
      return res.json({ message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid signature sent!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

export default router;
