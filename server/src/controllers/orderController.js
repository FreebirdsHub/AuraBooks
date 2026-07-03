import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Book from '../models/Book.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const createOrder = catchAsync(async (req, res, next) => {
  const { shippingAddress } = req.body;

  if (!shippingAddress) {
    return next(new AppError('Please provide a shipping address', 400));
  }

  // 1) Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
  
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty', 400));
  }

  // 2) Calculate total amount and build order items array
  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const book = item.book;
    
    // Check stock
    if (!book || book.stock < item.quantity) {
      return next(new AppError(`Book ${book?.title || 'Unknown'} is out of stock`, 400));
    }

    totalAmount += book.price * item.quantity;
    
    orderItems.push({
      book: book._id,
      title: book.title,
      quantity: item.quantity,
      price: book.price
    });
  }

  // 3) Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentStatus: 'pending',
    orderStatus: 'pending'
  });

  // Removed: stock reduction and cart clearing will now happen after successful payment

  res.status(201).json({ status: 'success', data: { order } });
});

export const getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

export const getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.book', 'coverImage');

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Ensure the user owns this order, or is an admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to view this order', 403));
  }

  res.status(200).json({ status: 'success', data: { order } });
});

// ADMIN ONLY
export const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderStatus } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(orderStatus)) {
    return next(new AppError('Invalid order status', 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  if (order.orderStatus === 'delivered') {
    return next(new AppError('You have already delivered this order', 400));
  }

  // If cancelling, restore stock
  if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
    for (const item of order.items) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: item.quantity }
      });
    }
  }

  order.orderStatus = orderStatus;
  await order.save();

  res.status(200).json({ status: 'success', data: { order } });
});
