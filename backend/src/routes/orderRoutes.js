// backend/src/routes/orderRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

// All routes are protected and require authentication
router
  .route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router
  .route('/:id')
  .get(protect, getOrderById);

router
  .route('/:id/status')
  .put(protect, updateOrderStatus);

export default router;