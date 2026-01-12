// backend/src/routes/orderRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderHistory,
  createOrderFromCart,
} from "../controllers/orderController.js";

const router = express.Router();

// All routes are protected and require authentication
router.route("/").get(protect, getOrders).post(protect, createOrder);

router.route("/history").get(protect, getOrderHistory);

router.route("/create-from-cart").post(protect, createOrderFromCart);

router.route("/:id").get(protect, getOrderById);

router.route("/:id/status").put(protect, updateOrderStatus);

export default router;
