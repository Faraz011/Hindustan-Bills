// cart + order routes combined
import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem
} from "../controllers/cartController.js";
import {
  placeOrder,
  getOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

// --- Cart routes (customer only) ---
router.post("/cart/add", verifyToken, authorizeRoles("customer"), addToCart);
router.get("/cart", verifyToken, authorizeRoles("customer"), getCart);
router.post("/cart/remove", verifyToken, authorizeRoles("customer"), removeFromCart);
router.post("/cart/update", verifyToken, authorizeRoles("customer"), updateCartItem);

// --- Order routes ---
router.post("/order", verifyToken, authorizeRoles("customer"), placeOrder);
router.get("/orders", verifyToken, authorizeRoles("customer"), getOrders);

// Retailer/admin can change order status
router.put("/order/:id/status", verifyToken, authorizeRoles("retailer", "admin"), updateOrderStatus);

export default router;
