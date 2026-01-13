// backend/src/models/Product.js
import mongoose from "mongoose";

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
      lowercase: true,
      enum: [
        // Retail categories
        "electronics",
        "clothing",
        "groceries",
        "household",
        "personal_care",
        "books",
        "sports",
        "toys",
        "other",
        // Restaurant categories
        "beverages",
        "dosa",
        "uttapam",
        "roll/paratha",
        "chinese_soup",
        "noodles",
        "biryani_rice",
        "singh_chao",
        "chowmein_gravy",
        "manchurian_chowmien_gravy",
        "schezwan_chow_gravy",
        "chopsuey",
        "chinese_gravy(veg)",
        "chinese_gravy(non-veg)",
        "indian_veg",
        "indian_non-veg",
        "tandoor",
        "combo"
      ],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    image: {
      type: String,
      default: "/placeholder-product.png",
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
        unique: true,
      },
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
    },
    // Restaurant-specific fields
    dietaryInfo: [
      {
        type: String,
        enum: [
          "vegetarian",
          "vegan",
          "gluten-free",
          "dairy-free",
          "nut-free",
          "spicy",
          "low-carb",
          "keto",
        ],
      },
    ],
    preparationTime: {
      type: Number, // in minutes
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
productSchema.index({ name: "text", description: "text" });
productSchema.index({ shop: 1, isActive: 1 });

// Pre-save hook to handle empty strings for unique/sparse fields
productSchema.pre("save", function (next) {
  if (this.metadata) {
    if (this.metadata.barcode === "") {
      this.metadata.barcode = undefined;
    }
    if (this.metadata.sku === "") {
      this.metadata.sku = undefined;
    }
  }
  next();
});

export default mongoose.model("Product", productSchema);
