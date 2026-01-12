// backend/src/routes/productRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByShopId,
} from "../controllers/productController.js";

const router = express.Router();

// All routes are protected and require authentication
router.route("/").get(protect, getProducts).post(protect, createProduct);

router.route("/:id").put(protect, updateProduct).delete(protect, deleteProduct);

// Get products for a specific shop (for customers)
router.get("/shop/:shopId", protect, getProductsByShopId);

export default router;
