import Cart from '../models/Cart.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Book from '../models/Book.js';

export const getCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.book',
    select: 'title price coverImage author stock',
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.status(200).json({ status: 'success', data: { cart } });
});

export const addToCart = catchAsync(async (req, res, next) => {
  const { bookId, quantity } = req.body;
  const qty = quantity || 1;

  // Verify book exists and has stock
  const book = await Book.findById(bookId);
  if (!book) return next(new AppError('Book not found', 404));
  if (book.stock < qty) return next(new AppError('Not enough stock available', 400));

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex((item) => item.book.toString() === bookId);

  if (itemIndex > -1) {
    // Book exists, update quantity
    cart.items[itemIndex].quantity += qty;
  } else {
    // New book, add to items array
    cart.items.push({ book: bookId, quantity: qty });
  }

  await cart.save();
  await cart.populate({ path: 'items.book', select: 'title price coverImage author stock' });

  res.status(200).json({ status: 'success', data: { cart } });
});

export const updateCartItemQuantity = catchAsync(async (req, res, next) => {
  const { bookId, quantity } = req.body;

  if (quantity < 1) {
    return next(new AppError('Quantity cannot be less than 1. Use remove endpoint instead.', 400));
  }

  const book = await Book.findById(bookId);
  if (!book) return next(new AppError('Book not found', 404));
  if (book.stock < quantity) return next(new AppError('Not enough stock available', 400));

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found', 404));

  const itemIndex = cart.items.findIndex((item) => item.book.toString() === bookId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate({ path: 'items.book', select: 'title price coverImage author stock' });
    res.status(200).json({ status: 'success', data: { cart } });
  } else {
    return next(new AppError('Item not found in cart', 404));
  }
});

export const removeFromCart = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError('Cart not found', 404));

  cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
  await cart.save();
  await cart.populate({ path: 'items.book', select: 'title price coverImage author stock' });

  res.status(200).json({ status: 'success', data: { cart } });
});
