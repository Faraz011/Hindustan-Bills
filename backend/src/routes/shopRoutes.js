import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getShopDetails,
  updateShopDetails,
  getProducts,
  getOrders,
  getAvailableShops,
  getShopSettings,
  updateShopSettings,
} from "../controllers/shopController.js";

const router = express.Router();

// Shop routes
router
  .route("/details")
  .get(protect, getShopDetails)
  .put(protect, updateShopDetails);

// Settings routes
router
  .route("/settings")
  .get(protect, getShopSettings)
  .put(protect, updateShopSettings);

// Product routes
router.get("/products", protect, getProducts);

// Order routes
router.get("/orders", protect, getOrders);

// Available shops for customers
router.get("/available", protect, getAvailableShops);

export default router;
