import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Book from '../models/Book.js';

export const getWishlist = catchAsync(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'books',
    select: 'title price coverImage author stock isActive',
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, books: [] });
  }

  res.status(200).json({ status: 'success', data: { wishlist } });
});

export const addToWishlist = catchAsync(async (req, res, next) => {
  const { bookId } = req.body;

  const book = await Book.findById(bookId);
  if (!book) return next(new AppError('Book not found', 404));

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, books: [] });
  }

  if (!wishlist.books.includes(bookId)) {
    wishlist.books.push(bookId);
    await wishlist.save();
  }

  await wishlist.populate({ path: 'books', select: 'title price coverImage author stock isActive' });

  res.status(200).json({ status: 'success', data: { wishlist } });
});

export const removeFromWishlist = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return next(new AppError('Wishlist not found', 404));

  wishlist.books = wishlist.books.filter((id) => id.toString() !== bookId);
  await wishlist.save();
  await wishlist.populate({ path: 'books', select: 'title price coverImage author stock isActive' });

  res.status(200).json({ status: 'success', data: { wishlist } });
});

export const moveToCart = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  // 1) Find wishlist and remove item
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return next(new AppError('Wishlist not found', 404));

  if (!wishlist.books.includes(bookId)) {
    return next(new AppError('Book not in wishlist', 400));
  }

  // 2) Find book and check stock
  const book = await Book.findById(bookId);
  if (!book || book.stock < 1) {
    return next(new AppError('Book is out of stock or not found', 400));
  }

  // Remove from wishlist
  wishlist.books = wishlist.books.filter((id) => id.toString() !== bookId);
  await wishlist.save();

  // 3) Add to cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex((item) => item.book.toString() === bookId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1;
  } else {
    cart.items.push({ book: bookId, quantity: 1 });
  }
  await cart.save();

  res.status(200).json({ 
    status: 'success', 
    message: 'Moved to cart successfully'
  });
});
