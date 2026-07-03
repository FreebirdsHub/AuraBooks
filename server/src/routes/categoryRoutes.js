import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategory);

// Protect all routes after this middleware (Admin only)
router.use(protect, restrictTo('admin'));

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
