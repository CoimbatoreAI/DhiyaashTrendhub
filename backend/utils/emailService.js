import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmationEmail = async (order) => {
  const productListHtml = order.products.map(p => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${p.productName}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${p.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${p.price}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${p.price * p.quantity}</td>
    </tr>
  `).join('');

  const customerHtml = `
    <h2>Order Confirmation - Dhiyaash Trendhub</h2>
    <p>Dear ${order.customerName},</p>
    <p>Thank you for your order! Your payment has been successfully verified.</p>
    <h3>Order Details:</h3>
    <ul>
      <li><strong>Order ID:</strong> ${order.razorpayOrderId}</li>
      <li><strong>Amount:</strong> ₹${order.totalAmount}</li>
      <li><strong>Status:</strong> ${order.status}</li>
    </ul>
    
    <h3>Products Ordered:</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${productListHtml}
      </tbody>
    </table>
    
    <p>We are currently processing your order and will dispatch it soon.</p>
    <p>Best regards,<br>Dhiyaash Trendhub Team</p>
  `;

  const ownerHtml = `
    <h2>New Order Received!</h2>
    <p>A new order has been placed and paid successfully.</p>
    
    <h3>Customer Details:</h3>
    <ul>
      <li><strong>Name:</strong> ${order.customerName}</li>
      <li><strong>Email:</strong> ${order.customerEmail}</li>
    </ul>

    <h3>Order Summary:</h3>
    <ul>
      <li><strong>Order ID:</strong> ${order.razorpayOrderId}</li>
      <li><strong>Total Amount:</strong> ₹${order.totalAmount}</li>
      <li><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</li>
    </ul>

    <h3>Products Ordered:</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
          <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${productListHtml}
      </tbody>
    </table>
    
    <p style="margin-top: 20px;">Please check the admin dashboard for full details.</p>
  `;

  try {
    // Send email to customer
    await transporter.sendMail({
      from: `"Dhiyaash Trendhub" <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: 'Order Confirmation - Dhiyaash Trendhub',
      html: customerHtml,
    });

    // Send email to owner
    await transporter.sendMail({
      from: `"Dhiyaash Trendhub" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to the owner email itself
      subject: `New Order Received - ${order.razorpayOrderId}`,
      html: ownerHtml,
    });
    
    console.log('Order confirmation emails sent successfully.');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
};
