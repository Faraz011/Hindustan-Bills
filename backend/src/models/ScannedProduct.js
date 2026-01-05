// backend/src/models/ScannedProduct.js
import mongoose from "mongoose";

const scannedProductSchema = new mongoose.Schema(
  {
    sessionCode: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    scannedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries - compound index for sessionCode + user + product uniqueness
scannedProductSchema.index(
  { sessionCode: 1, user: 1, product: 1 },
  { unique: true }
);
scannedProductSchema.index({ user: 1, scannedAt: -1 });

export default mongoose.model("ScannedProduct", scannedProductSchema);
