// backend/src/models/Shop.js
import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    businessType: {
      type: String,
      enum: [
        "grocery",
        "electronics",
        "clothing",
        "pharmacy",
        "restaurant",
        "retail",
        "supermarket",
        "other",
      ],
      required: [true, "Business type is required"],
    },
    contact: {
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },
    address: {
      street: { type: String, required: [true, "Street address is required"] },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      pincode: { type: String, required: [true, "Pincode is required"] },
      country: { type: String, default: "India" },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    businessHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      gstNumber: { type: String, trim: true },
      fssaiLicense: { type: String, trim: true },
      upiId: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a 2dsphere index for geospatial queries
shopSchema.index({ "address.coordinates": "2dsphere" });

// Virtual for full address
shopSchema.virtual("fullAddress").get(function () {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} - ${this.address.pincode}, ${this.address.country}`;
});

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
