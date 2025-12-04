import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/cartController.js";

const router = express.Router();

// Only customers can manage cart
router.post("/add", verifyToken, authorizeRoles("customer"), addToCart);
router.get("/", verifyToken, authorizeRoles("customer"), getCart);
router.post("/remove", verifyToken, authorizeRoles("customer"), removeFromCart);
router.put("/update", verifyToken, authorizeRoles("customer"), updateCartItem);

export default router;
