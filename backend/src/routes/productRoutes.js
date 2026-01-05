// backend/src/routes/productRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// All routes are protected and require authentication
router
  .route('/')
  .get(protect, getProducts)
  .post(protect, createProduct);

router
  .route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;