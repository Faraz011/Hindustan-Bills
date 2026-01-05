// backend/src/models/Order.js
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
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      type: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
      },
    },
    payment: {
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      method: String,
      transactionId: String,
      amount: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
orderSchema.index({ shop: 1, status: 1 });
orderSchema.index({ customer: 1 });
// orderSchema.index({ orderNumber: 1 }); // Removed - unique: true already creates this index

// Generate order number
orderSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const count = await this.constructor.countDocuments();
  this.orderNumber = `ORD${Date.now()}${count.toString().padStart(5, "0")}`;
  next();
});

export default mongoose.model("Order", orderSchema);
