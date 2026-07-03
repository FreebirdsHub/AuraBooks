import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not be more than 5'],
      required: [true, 'Please provide a rating'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review text'],
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Review must belong to a book'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Calculate average ratings
reviewSchema.statics.calcAverageRatings = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: '$book',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      'ratings.count': stats[0].nRating,
      'ratings.average': Math.round(stats[0].avgRating * 10) / 10,
    });
  } else {
    await mongoose.model('Book').findByIdAndUpdate(bookId, {
      'ratings.count': 0,
      'ratings.average': 0,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.book);
});

reviewSchema.post('deleteOne', { document: true, query: false }, function () {
  this.constructor.calcAverageRatings(this.book);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
