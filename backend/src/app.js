// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import barcodeRoutes from "./routes/barcodeRoutes.js"; // barcode scanning/verification
import orderRoutes from "./routes/orderRoutes.js";     // order routes
import cartRoutes from "./routes/cartRoutes.js";       // cart routes
import paymentRoutes from "./routes/paymentRoutes.js"; // ✅ new payment route

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static invoice PDFs
app.use("/invoices", express.static("invoices"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/barcode", barcodeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes); // ✅ added payment integration

// Health check
app.get("/", (req, res) => {
  res.send("🧾 Hindustan Bills API is running!");
});

export default app;
