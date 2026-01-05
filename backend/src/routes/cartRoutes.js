// src/routes/cartRoutes.js
import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  initializeSession,
  convertSessionToCart,
} from "../controllers/cartController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Session management
router.post("/initialize", initializeSession);
router.post("/convert-session", convertSessionToCart);

// Cart CRUD operations
router.route("/").get(getCart).post(addToCart);

router.route("/:productId").put(updateCartItem).delete(removeFromCart);

export default router;
