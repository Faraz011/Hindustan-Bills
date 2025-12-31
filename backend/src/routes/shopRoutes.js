// backend/src/routes/shopRoutes.js
import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { addShop, listShops, getNearbyShops } from "../controllers/shopController.js";

const router = express.Router();

// Add a shop (retailer/admin)
router.post("/add", verifyToken, authorizeRoles("retailer", "admin"), addShop);

// List all shops (public)
router.get("/", listShops);

// Nearby search
router.get("/nearby", getNearbyShops);

export default router;