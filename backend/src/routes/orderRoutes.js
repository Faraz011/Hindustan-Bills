// src/routes/orderRoutes.js
import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { 
  placeOrder, 
  getOrders, 
  updateOrderStatus, 
  getOrdersHistory 
} from "../controllers/orderController.js";

const router = express.Router();

/**
 * CUSTOMER ROUTES
 */
// Place an order (only customers)
router.post("/place", verifyToken, authorizeRoles("customer"), placeOrder);

// Get all orders of logged-in customer
router.get("/", verifyToken, authorizeRoles("customer"), getOrders);

/**
 * RETAILER / ADMIN ROUTES
 */
// Update order status (retailer or admin)
router.put("/status/:id", verifyToken, authorizeRoles("retailer", "admin"), updateOrderStatus);

// Get order history (optional filters: status, startDate, endDate)
// Accessible by customers (their own orders) and retailers/admins (all orders)
router.get("/history", verifyToken, getOrdersHistory);

export default router;
