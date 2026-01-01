// src/app.js
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import barcodeRoutes from "./routes/barcodeRoutes.js"; // barcode scanning/verification
import orderRoutes from "./routes/orderRoutes.js"; // order routes
import cartRoutes from "./routes/cartRoutes.js"; // cart routes
import paymentRoutes from "./routes/paymentRoutes.js"; // ✅ new payment route
import shopRoutes from "./routes/shopRoutes.js";
import receiptRoutes from "./routes/receipt.routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const User = (await import("./models/User.js")).default;
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ✅ Serve static invoice PDFs
app.use("/invoices", express.static("invoices"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", receiptRoutes);
app.use("/api/products", productRoutes);
app.use("/api/barcode", barcodeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes); // ✅ added payment integration
app.use("/api/shops", shopRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🧾 Hindustan Bills API is running!");
});

export default app;
