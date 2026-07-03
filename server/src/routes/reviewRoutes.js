import express from 'express';
import {
  createReview,
  getBookReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Public route to view reviews for a book
router.get('/book/:bookId', getBookReviews);

// Protected routes (Only logged in users who purchased can interact)
router.use(protect);

router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
