import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
} from '../controllers/cartController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItemQuantity);
router.delete('/remove/:bookId', removeFromCart);

export default router;
