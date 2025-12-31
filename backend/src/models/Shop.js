// backend/src/models/Shop.js
import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    metadata: { type: Object }, // any extra data
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional: which retailer owns this shop
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
