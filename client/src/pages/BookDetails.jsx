import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookDetails, selectBooks } from '../features/books/bookSlice';
import { addToCart } from '../features/cart/cartSlice';
import { addToWishlist, removeFromWishlist, selectWishlist } from '../features/wishlist/wishlistSlice';
import { selectAuth } from '../features/auth/authSlice';
import { useToast } from '../context/ToastContext';
import ImageWithFallback from '../components/ImageWithFallback';
import { BookDetailSkeleton } from '../components/Skeletons';
import api from '../services/api';
import { Star, ShoppingCart, Heart, MessageSquare, ShieldAlert, Check } from 'lucide-react';
import { LOGIN } from '../constants/routes';

const BookDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { selectedBook, detailLoading, error } = useSelector(selectBooks);
  const { books: wishlistBooks } = useSelector(selectWishlist);
  const { isAuthenticated } = useSelector(selectAuth);

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  const isWishlisted = wishlistBooks.some((b) => b._id === id || b.book?._id === id);

  useEffect(() => {
    dispatch(fetchBookDetails(id));
    loadReviews();
  }, [dispatch, id]);

  const loadReviews = async () => {
    try {
      const response = await api.get(`/reviews/book/${id}`);
      setReviews(response.data.data.reviews);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to add items to your cart', 'info');
      return;
    }
    dispatch(addToCart({ bookId: id, quantity })).then((res) => {
      if (!res.error) {
        showToast(`Added ${quantity} copy of "${selectedBook.title}" to cart!`, 'success');
      } else {
        showToast(res.payload || 'Failed to add to cart', 'error');
      }
    });
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to manage your wishlist', 'info');
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(id)).then(() => {
        showToast('Removed book from your wishlist', 'info');
      });
    } else {
      dispatch(addToWishlist(id)).then(() => {
        showToast('Added book to your wishlist!', 'success');
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      showToast('Please enter a review description', 'warning');
      return;
    }

    setReviewLoading(true);
    try {
      await api.post('/reviews', { bookId: id, rating: newReview.rating, comment: newReview.comment });
      showToast('Review submitted successfully!', 'success');
      setNewReview({ rating: 5, comment: '' });
      loadReviews(); // Refresh review logs
    } catch (err) {
      showToast(err.message || 'Only verified purchasers of this book can submit reviews', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  if (detailLoading) return <BookDetailSkeleton />;
  if (error || !selectedBook) {
    return (
      <div className="max-w-md mx-auto my-16 text-center">
        <h2 className="text-2xl font-bold text-white font-display">Book Not Found</h2>
        <p className="text-slate-400 mt-2">The requested catalog item could not be retrieved.</p>
        <Link to="/books" className="mt-6 inline-block text-brand-400 font-bold hover:underline">
          Back to Bookstore
        </Link>
      </div>
    );
  }

  const imageUrl = selectedBook.coverImage
    ? selectedBook.coverImage.startsWith('http') ? selectedBook.coverImage : `${import.meta.env.VITE_ASSET_URL || 'http://localhost:5000'}/${selectedBook.coverImage.replace(/\\/g, '/')}`
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      {/* Detail Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Cover Art Box */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-darkCard/50">
            <ImageWithFallback src={imageUrl} alt={selectedBook.title} title={selectedBook.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="text-xs bg-brand-500/10 border border-brand-500/20 text-brand-400 font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {selectedBook.category?.name || 'Category'}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight font-display">
              {selectedBook.title}
            </h1>
            <p className="text-slate-400 text-base">by <span className="font-semibold text-slate-300">{selectedBook.author}</span></p>
          </div>

          {/* Rating overview */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(selectedBook.ratings?.average || 0) ? 'fill-amber-400' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-600 font-bold">
              {selectedBook.ratings?.average > 0 ? selectedBook.ratings.average.toFixed(1) : 'No reviews yet'} ({selectedBook.ratings?.count || 0} reviews)
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed border-t border-b border-white/10 py-6">
            {selectedBook.description || 'No descriptive context configured for this book.'}
          </p>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Price</span>
              <p className="text-3xl font-black text-white">₹{selectedBook.price}</p>
            </div>

            {/* Stock status indicator */}
            <div>
              {selectedBook.stock === 0 ? (
                <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Out Of Stock
                </span>
              ) : selectedBook.stock < 5 ? (
                <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  Only {selectedBook.stock} Left!
                </span>
              ) : (
                <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> In Stock
                </span>
              )}
            </div>
          </div>

          {/* Action triggers */}
          {selectedBook.stock > 0 && (
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-300 hover:bg-white/10 transition-colors font-bold"
                >
                  -
                </button>
                <span className="px-4 text-white font-bold text-sm w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedBook.stock, quantity + 1))}
                  className="px-3 py-2 text-slate-300 hover:bg-white/10 transition-colors font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 rounded-xl border transition-all ${
                    isWishlisted
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10'
                  }`}
                >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Logs & Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-white/10 pt-12">
        {/* Submissions form (Left 1-Col) */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-400" /> Leave Feedback
          </h2>

          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="bg-darkCard/50 border border-white/10 p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="text-amber-400 focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${star <= newReview.rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Comment</label>
                <textarea
                  required
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your reading experience..."
                  className="w-full px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm glass-input text-white placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
              >
                {reviewLoading ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
              <p className="text-sm text-slate-400 mb-4">Please log in to submit a review for this book.</p>
              <Link to={LOGIN} className="inline-block py-2 px-6 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm">
                Login Now
              </Link>
            </div>
          )}
        </div>

        {/* Reviews Feed list (Right 2-Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold font-display text-white">User Reviews ({reviews.length})</h2>

          {reviews.length === 0 ? (
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center text-slate-400 text-sm">
              No reviews have been posted for this book yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-darkCard/50 border border-white/10 p-5 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">{rev.user?.name || 'Anonymous User'}</p>
                      <div className="flex items-center text-amber-400 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
