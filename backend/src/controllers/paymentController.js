// src/controllers/paymentController.js
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import { generateInvoice } from "../utils/invoiceGenerator.js";
import { sendInvoiceEmail } from "../utils/emailService.js"; // ✅ uses Resend
import path from "path";

export const mockPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, success = true } = req.body; // simulate payment result

    // 🔍 Check if order exists
    const order = await Order.findOne({ _id: orderId, user: userId }).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ❌ Handle failed payment
    if (!success) {
      order.status = "pending";
      await order.save();
      return res.status(400).json({ message: "Payment failed. Try again." });
    }

    // ✅ Mark payment as successful
    order.status = "paid";
    order.paymentInfo = {
      transactionId: "MOCK_TXN_" + Date.now(),
      method: "mock_gateway",
      status: "success",
      amount: order.totalAmount,
      date: new Date(),
    };
    await order.save();

    // ✅ Generate invoice PDF
    const invoicePath = await generateInvoice(order);
    console.log(`🧾 Invoice generated: ${invoicePath}`);

    // ✅ Send invoice via email (using Resend)
    const user = await User.findById(userId);
    if (user?.email) {
      await sendInvoiceEmail(
        user.email,
        "🧾 Your Hindustan Bills Invoice",
        `
        Dear ${user.name || "Customer"},
        <br><br>
        Thank you for shopping with <b>Hindustan Bills</b>!<br>
        Your order <b>#${order._id}</b> has been successfully paid.<br>
        Please find your invoice attached below.
        <br><br>
        Warm regards,<br>
        <b>Hindustan Bills Team</b>
        `,
        invoicePath
      );
      console.log(`📩 Invoice emailed to: ${user.email}`);
    }

    // ✅ Clear user's cart after successful payment
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    // ✅ Return response
    res.json({
      message: "✅ Payment successful. Order confirmed & invoice emailed!",
      order,
      invoiceUrl: `/invoices/invoice_${order._id}.pdf`,
      savedAt: path.resolve(invoicePath),
    });
  } catch (err) {
    console.error("❌ Payment error:", err);
    res.status(500).json({ message: err.message });
  }
};
