import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password required only if no Google ID
      },
    },
    googleId: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["customer", "retailer", "admin"], // allowed roles
      default: "customer", // default if not specified
    },
    businessName: {
      type: String,
      required: false,
    },
    businessType: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
