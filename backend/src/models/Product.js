import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    barcode: {
      type: String,
      required: true,
      unique: true, // ensures no duplicate barcodes
      trim: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links product to retailer who added it
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Index barcode for faster search
productSchema.index({ barcode: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
