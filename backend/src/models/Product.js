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
        "best_seller",
        "beverages",
        "dosa",
        "uttapam",
        "burger",
        "snaks",
        "pasta",
        "indian",
        "chinese",
        "desserts",
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
        "combo",
        "maggie",
        "omlet",
        "chowmein",
        "momo",
        "coffee",
        "non_coffee",
        "boba_tea",
        "fish_fingers",
        "fried_chicken",
        "korean_range",
        "sandwich",
        "fries",
        "pizza-8",
        "waffle",
        "cheesecake",
        "brownie's"
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
    sku: {
      type: mongoose.Schema.Types.Mixed,
    },
    barcode: {
      type: mongoose.Schema.Types.Mixed,
      sparse: true,
      unique: true,
    },
    "item code": {
      type: mongoose.Schema.Types.Mixed,
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
      type: Number, 
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
  if (this.barcode === "") {
    this.barcode = undefined;
  }
  if (this.sku === "") {
    this.sku = undefined;
  }
  next();
});

export default mongoose.model("Product", productSchema);
