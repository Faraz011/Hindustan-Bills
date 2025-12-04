// src/routes/productRoutes.js
import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import {
    addProduct,
    getProducts,
    getProductByBarcode,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

//Add a new product (retailer only)
router.post("/add", verifyToken, authorizeRoles("retailer"), addProduct);

//Get all products (public)
router.get("/", getProducts);

//Get product by barcode (public)
router.get("/barcode/:barcode", getProductByBarcode);

//Update a product (retailer only)
router.put("/update/:id", verifyToken, authorizeRoles("retailer"), updateProduct);

//Delete a product (retailer only)
router.delete("/delete/:id", verifyToken, authorizeRoles("retailer"), deleteProduct);

export default router;