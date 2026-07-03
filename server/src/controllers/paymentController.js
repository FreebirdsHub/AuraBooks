import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Cart from '../models/Cart.js';
import Book from '../models/Book.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { config } from '../config/index.js';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
export const createRazorpayOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Check if order belongs to user
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new AppError('You do not have permission to pay for this order', 403));
  }

  if (order.paymentStatus === 'paid') {
    return next(new AppError('Order is already paid', 400));
  }

  const options = {
    amount: Math.round(order.totalAmount * 100), // amount in smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_order_${order._id}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  // Update order with razorpayOrderId
  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.status(200).json({
    status: 'success',
    data: {
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      orderId: order._id,
    },
  });
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Save Payment to Database
    const order = await Order.findById(orderId);
    if (!order) return next(new AppError('Order not found', 404));

    const payment = await Payment.create({
      user: req.user._id,
      order: orderId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: order.totalAmount,
      status: 'captured',
      paymentMethod: 'razorpay'
    });

    // Reduce book stock and clear cart if not already paid
    if (order.paymentStatus !== 'paid') {
      for (const item of order.items) {
        await Book.findByIdAndUpdate(item.book, {
          $inc: { stock: -item.quantity }
        });
      }

      const cart = await Cart.findOne({ user: req.user._id });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
    }

    // Update order status
    order.paymentStatus = 'paid';
    order.payment = payment._id;
    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully',
    });
  } else {
    res.status(400).json({
      status: 'error',
      message: 'Invalid signature',
    });
  }
});

// @desc    Razorpay Webhook handler
// @route   POST /api/payments/webhook
// @access  Public (called by Razorpay servers)
export const webhookHandler = catchAsync(async (req, res, next) => {
  const secret = config.razorpay.webhookSecret;
  const signature = req.headers['x-razorpay-signature'];

  if (!signature) {
    return res.status(400).send('Webhook Error: Missing Signature');
  }

  let event;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body) // req.body is a Buffer here because of express.raw() in app.js
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).send('Webhook Error: Invalid Signature');
    }

    event = JSON.parse(req.body.toString());
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.event === 'payment.captured') {
    const paymentEntity = event.payload.payment.entity;
    const razorpayOrderId = paymentEntity.order_id;

    const order = await Order.findOne({ razorpayOrderId });
    if (order && order.paymentStatus !== 'paid') {
      for (const item of order.items) {
        await Book.findByIdAndUpdate(item.book, {
          $inc: { stock: -item.quantity }
        });
      }

      const cart = await Cart.findOne({ user: order.user });
      if (cart) {
        cart.items = [];
        await cart.save();
      }

      order.paymentStatus = 'paid';
      await order.save();
      
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: 'captured', razorpayPaymentId: paymentEntity.id }
      );
    }
  } else if (event.event === 'payment.failed') {
    const paymentEntity = event.payload.payment.entity;
    const razorpayOrderId = paymentEntity.order_id;

    const order = await Order.findOne({ razorpayOrderId });
    if (order) {
      order.paymentStatus = 'failed';
      await order.save();

      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: 'failed', razorpayPaymentId: paymentEntity.id }
      );
    }
  }

  res.status(200).json({ received: true });
});
