// server.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/app.js";
import { startKeepAlive } from "./src/utils/keepAlive.js";

dotenv.config();

// Initialize keep-alive
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
startKeepAlive(BACKEND_URL);

const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });

// Export the app for Vercel
export default app;

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
