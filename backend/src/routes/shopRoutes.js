import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getShopDetails,
  updateShopDetails,
  getProducts,
  getOrders,
  getAvailableShops,
} from "../controllers/shopController.js";

const router = express.Router();

// Shop routes
router
  .route("/details")
  .get(protect, getShopDetails)
  .put(protect, updateShopDetails);

// Product routes
router.get("/products", protect, getProducts);

// Order routes
router.get("/orders", protect, getOrders);

// Available shops for customers
router.get("/available", protect, getAvailableShops);

export default router;
