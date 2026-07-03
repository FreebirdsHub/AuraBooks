import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
} from '../controllers/wishlistController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:bookId', removeFromWishlist);
router.post('/move-to-cart/:bookId', moveToCart);

export default router;
