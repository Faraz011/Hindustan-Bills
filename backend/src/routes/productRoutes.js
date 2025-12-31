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

/*
|--------------------------------------------------------------------------
| Products Routes
|--------------------------------------------------------------------------
| Base path: /api/products
|--------------------------------------------------------------------------
*/

// ✅ Add a new product (retailer only)
// POST /api/products
router.post("/", verifyToken, authorizeRoles("retailer"), addProduct);

// ✅ Get all products (public)
// GET /api/products?shopId=xxxx
router.get("/products", async (req, res) => {
  try {
    const { shopId } = req.query;

    const filter = {};
    if (shopId) {
      filter.shopId = shopId;
    }

    const products = await Product.find(filter);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Get product by barcode (public)
// GET /api/products/barcode/:barcode
router.get("/barcode/:barcode", getProductByBarcode);

// ✅ Update a product (retailer only)
// PUT /api/products/:id
router.put("/:id", verifyToken, authorizeRoles("retailer"), updateProduct);

// ✅ Delete a product (retailer only)
// DELETE /api/products/:id
router.delete("/:id", verifyToken, authorizeRoles("retailer"), deleteProduct);

export default router;
