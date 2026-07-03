import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectWishlist, removeFromWishlist, moveWishlistItemToCart } from '../features/wishlist/wishlistSlice';
import { useToast } from '../context/ToastContext';
import { Heart, Trash2, ShoppingCart, BookOpen } from 'lucide-react';
import { BOOKS } from '../constants/routes';
import EmptyState from '../components/EmptyState';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { books, loading } = useSelector(selectWishlist);

  const handleRemove = async (bookId) => {
    try {
      await dispatch(removeFromWishlist(bookId)).unwrap();
      showToast('Removed from wishlist', 'info');
    } catch (err) {
      showToast(err, 'error');
    }
  };

  const handleMoveToCart = async (bookId) => {
    try {
      await dispatch(moveWishlistItemToCart(bookId)).unwrap();
      showToast('Moved to cart', 'success');
    } catch (err) {
      showToast(err, 'error');
    }
  };

  if (!loading && books.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <EmptyState
          title="Your Wishlist is Empty"
          description="Save books you'd like to buy later. Start exploring our collection and add your favorites here."
          icon={Heart}
          actionText="Explore Books"
          onActionClick={() => navigate(BOOKS)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-100 mb-8 font-display flex items-center gap-3">
        <Heart className="w-8 h-8 text-rose-500" /> My Wishlist
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex gap-4">
              {/* Cover Image */}
              <div className="w-24 h-36 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                {book.coverImage ? (
                  <img
                    src={book.coverImage.startsWith('http') ? book.coverImage : `http://localhost:5000${book.coverImage}`}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <BookOpen className="w-8 h-8" />
                  </div>
                )}
              </div>
              
              {/* Book Details */}
              <div className="flex flex-col">
                <Link to={`/books/${book._id}`} className="text-lg font-bold text-slate-800 hover:text-brand-600 line-clamp-2 leading-tight">
                  {book.title}
                </Link>
                <p className="text-sm text-slate-500 mt-1 line-clamp-1">{book.author}</p>
                <div className="mt-auto pt-4">
                  <span className="text-xl font-extrabold text-slate-900">₹{book.price}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleMoveToCart(book._id)}
                disabled={loading}
                className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" /> Move to Cart
              </button>
              <button
                onClick={() => handleRemove(book._id)}
                disabled={loading}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Remove from Wishlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
