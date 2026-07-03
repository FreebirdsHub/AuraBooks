import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartQuantity, removeFromCart, selectCart, selectCartTotal } from '../features/cart/cartSlice';
import { useToast } from '../context/ToastContext';
import ImageWithFallback from '../components/ImageWithFallback';
import EmptyState from '../components/EmptyState';
import { ShoppingCart, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { CHECKOUT, BOOKS } from '../constants/routes';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { items, loading } = useSelector(selectCart);
  const totalAmount = useSelector(selectCartTotal);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (bookId, newQty, stockLimit) => {
    if (newQty < 1) return;
    if (newQty > stockLimit) {
      showToast(`Only ${stockLimit} copies left in stock!`, 'warning');
      return;
    }
    dispatch(updateCartQuantity({ bookId, quantity: newQty }));
  };

  const handleRemove = (bookId) => {
    dispatch(removeFromCart(bookId)).then(() => {
      showToast('Item removed from cart', 'info');
    });
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16">
        <EmptyState
          title="Your Cart is Empty"
          description="Looks like you haven't added any books to your shopping cart yet."
          icon={ShoppingCart}
          actionText="Browse Books"
          onActionClick={() => navigate(BOOKS)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-white mb-8 font-display flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-brand-400" /> Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items list (Left 2-Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const book = item.book;
            const imageUrl = book?.coverImage
              ? book.coverImage.startsWith('http') ? book.coverImage : `${import.meta.env.VITE_ASSET_URL || 'http://localhost:5000'}/${book.coverImage.replace(/\\/g, '/')}`
              : null;

            return (
              <div key={item._id} className="flex gap-4 p-4 bg-darkCard/50 border border-white/10 rounded-2xl shadow-sm hover:border-brand-500/20 transition-all">
                {/* Book cover art thumbnail */}
                <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 bg-darkCard">
                  <ImageWithFallback src={imageUrl} alt={book?.title} title={book?.title} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base font-display line-clamp-1">
                      {book?.title}
                    </h3>
                    <p className="text-xs text-slate-400">by {book?.author}</p>
                    <p className="text-sm font-semibold text-white mt-1">₹{book?.price}</p>
                  </div>

                  {/* Qty and Trash */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-white/5">
                      <button
                        onClick={() => handleQuantityChange(book._id, item.quantity - 1, book.stock)}
                        className="px-2.5 py-1 text-slate-300 hover:bg-white/10 transition-colors font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 text-white font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(book._id, item.quantity + 1, book.stock)}
                        className="px-2.5 py-1 text-slate-300 hover:bg-white/10 transition-colors font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(book._id)}
                      className="text-slate-400 hover:text-red-500 rounded-lg p-1.5 transition-colors focus:outline-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price summary box (Right 1-Col) */}
        <div className="lg:col-span-1">
          <div className="bg-darkCard/50 border border-white/10 p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-display text-white border-b border-white/10 pb-3">Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Shipping fee</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white border-t border-white/10 pt-3">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <Link
              to={CHECKOUT}
              className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Checkout Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
