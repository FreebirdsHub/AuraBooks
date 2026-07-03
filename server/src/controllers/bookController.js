import Book from '../models/Book.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

export const createBook = catchAsync(async (req, res, next) => {
  let coverImageUrl = '';
  if (req.file) {
    // If we have a file, construct the local URL
    coverImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  const bookData = {
    ...req.body,
    coverImage: coverImageUrl || req.body.coverImage,
  };

  const book = await Book.create(bookData);
  res.status(201).json({ status: 'success', data: { book } });
});

export const getAllBooks = catchAsync(async (req, res, next) => {
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'keyword', 'category'];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Advanced filtering (e.g., price[gte]=50)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let query = JSON.parse(queryStr);

  // 2) Keyword Search (Title & Author)
  if (req.query.keyword) {
    query.$or = [
      { title: { $regex: req.query.keyword, $options: 'i' } },
      { author: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }

  // 3) Category / Genre Search
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Ensure we only show active books publicly
  query.isActive = true;

  let mongooseQuery = Book.find(query).populate('category', 'name');

  // 4) Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort('-createdAt'); // Default sort
  }

  // 5) Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  mongooseQuery = mongooseQuery.skip(skip).limit(limit);

  // Execute Query
  const books = await mongooseQuery;
  const total = await Book.countDocuments(query);

  res.status(200).json({ 
    status: 'success', 
    results: books.length, 
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    },
    data: { books } 
  });
});

export const getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate('category', 'name');
  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }
  res.status(200).json({ status: 'success', data: { book } });
});

export const updateBook = catchAsync(async (req, res, next) => {
  const updateData = { ...req.body };
  
  if (req.file) {
    updateData.coverImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  const book = await Book.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate('category', 'name');

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }
  res.status(200).json({ status: 'success', data: { book } });
});

export const deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }
  res.status(204).json({ status: 'success', data: null });
});

// Update Inventory specifically
export const updateInventory = catchAsync(async (req, res, next) => {
  const { stock } = req.body;
  if (stock === undefined || stock < 0) {
    return next(new AppError('Please provide a valid stock quantity', 400));
  }

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { stock },
    { new: true, runValidators: true }
  );

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }
  res.status(200).json({ status: 'success', data: { book } });
});
