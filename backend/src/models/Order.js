import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true, // store the price at the time of purchase
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "verified", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "cash", "wallet"],
      default: "upi",
    },
    paymentInfo: {
      type: Object, // you can store transactionId, etc.
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // store which retailer verified the order
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
