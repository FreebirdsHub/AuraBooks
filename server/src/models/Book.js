import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide book title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
      index: true,
    },
    author: {
      type: String,
      required: [true, 'Please provide book author'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide book description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide book price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide book category'],
      index: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide book stock count'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    coverImage: {
      type: String,
      required: [true, 'Please provide a cover image URL'],
    },
    ratings: {
      average: {
        type: Number,
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating must not be more than 5'],
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for search functionality
bookSchema.index({ title: 'text', author: 'text' });
// Index for filtering/sorting
bookSchema.index({ price: 1 });
bookSchema.index({ createdAt: -1 });

const Book = mongoose.model('Book', bookSchema);

export default Book;
