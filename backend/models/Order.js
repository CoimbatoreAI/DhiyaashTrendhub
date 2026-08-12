import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  products: [
    {
      productId: { type: String, required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  status: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
