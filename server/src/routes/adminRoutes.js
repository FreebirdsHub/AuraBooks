import express from 'express';
import { getStats, getAllUsers, updateUserRole } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// All routes are protected and restricted to admin
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);

export default router;
