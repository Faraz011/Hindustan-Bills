// backend/src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    image: {
      type: String,
      default: '/placeholder-product.png',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      sku: String,
      barcode: {
        type: String,
        sparse: true,
        unique: true
      },
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ shop: 1, isActive: 1 });

export default mongoose.model('Product', productSchema);