import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { mockPayment } from "../controllers/paymentController.js";

const router = express.Router();

// only customers make payments
router.post("/mock", verifyToken, authorizeRoles("customer"), mockPayment);

export default router;
