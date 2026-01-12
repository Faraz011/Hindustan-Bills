import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/menuController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Menu cart operations
router.post("/add-to-cart", addToCart);
router.get("/cart", getCart);
router.put("/cart/:productId", updateCartItem);
router.delete("/cart/:productId", removeFromCart);

export default router;
