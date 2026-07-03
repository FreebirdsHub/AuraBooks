import express from 'express';
import {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
  updateInventory
} from '../controllers/bookController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBook);

// Admin only routes
router.use(protect, restrictTo('admin'));

router.post('/', upload.single('coverImage'), createBook);
router.put('/:id', upload.single('coverImage'), updateBook);
router.delete('/:id', deleteBook);
router.patch('/:id/inventory', updateInventory);

export default router;
