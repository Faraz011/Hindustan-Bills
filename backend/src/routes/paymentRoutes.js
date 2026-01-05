// src/routes/paymentRoutes.js
import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { mockPayment } from "../controllers/paymentController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Only customers can make payments
router.post("/mock", authorizeRoles("customer"), mockPayment);

export default router;