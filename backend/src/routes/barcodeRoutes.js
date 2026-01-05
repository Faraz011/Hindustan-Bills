import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  scanProductByBarcode,
  searchProducts,
  scanProduct,
  getSessionProducts,
  updateScannedProduct,
  removeScannedProduct,
  clearSession,
} from "../controllers/barcodeController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Session-based scanning
router.post("/scan", scanProduct);
router.get("/session/:sessionCode", getSessionProducts);
router.put("/session/:sessionCode/:scannedProductId", updateScannedProduct);
router.delete("/session/:sessionCode/:scannedProductId", removeScannedProduct);
router.delete("/session/:sessionCode", clearSession);

// Legacy barcode scanning (for backward compatibility)
router.get("/scan/:barcode", scanProductByBarcode);

// Search products
router.get("/search", searchProducts);

export default router;
