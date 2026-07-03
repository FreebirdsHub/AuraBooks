import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Protect all order routes
router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

// Admin only routes
router.use(restrictTo('admin'));
router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;
