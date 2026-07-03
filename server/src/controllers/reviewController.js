import Review from '../models/Review.js';
import Order from '../models/Order.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const createReview = catchAsync(async (req, res, next) => {
  const { rating, comment, bookId } = req.body;

  // 1) Verify the user actually purchased the book
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'items.book': bookId,
    paymentStatus: 'paid'
  });

  if (!hasPurchased) {
    return next(new AppError('You can only review books that you have successfully purchased.', 403));
  }

  // 2) Check if user already reviewed this book
  const existingReview = await Review.findOne({ user: req.user._id, book: bookId });
  if (existingReview) {
    return next(new AppError('You have already reviewed this book.', 400));
  }

  // 3) Create review
  const review = await Review.create({
    rating,
    comment,
    user: req.user._id,
    book: bookId
  });

  res.status(201).json({ status: 'success', data: { review } });
});

export const getBookReviews = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;

  const reviews = await Review.find({ book: bookId }).populate('user', 'name').sort('-createdAt');

  res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
});

export const updateReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;

  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });

  if (!review) {
    return next(new AppError('Review not found or you do not have permission to edit it.', 404));
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  
  await review.save(); // trigger post save hook to recalculate avg rating

  res.status(200).json({ status: 'success', data: { review } });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });

  if (!review) {
    return next(new AppError('Review not found or you do not have permission to delete it.', 404));
  }

  await review.deleteOne(); // trigger post deleteOne hook to recalculate avg rating

  res.status(204).json({ status: 'success', data: null });
});
