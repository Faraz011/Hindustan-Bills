import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyBarcode } from "../controllers/barcodeController.js";

const router = express.Router();

// Verify barcode and get product details
router.post("/verify", verifyToken, verifyBarcode);

export default router;
