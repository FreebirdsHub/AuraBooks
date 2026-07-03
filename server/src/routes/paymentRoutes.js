import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

export default router;
