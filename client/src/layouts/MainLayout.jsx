import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, logoutUser } from '../features/auth/authSlice';
import { selectCartItemsCount, fetchCart } from '../features/cart/cartSlice';
import { fetchWishlist, selectWishlist } from '../features/wishlist/wishlistSlice';
import { useToast } from '../context/ToastContext';
import { BookOpen, ShoppingCart, Heart, User, LogOut, Menu, X, Settings } from 'lucide-react';
import { HOME, BOOKS, CART, PROFILE, ORDERS, LOGIN, ADMIN_DASHBOARD, WISHLIST } from '../constants/routes';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { isAuthenticated, user } = useSelector(selectAuth);
  const cartCount = useSelector(selectCartItemsCount);
  const { books: wishlistBooks } = useSelector(selectWishlist);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      showToast('Logged out successfully', 'info');
      navigate(LOGIN);
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-darkBg text-slate-100 selection:bg-brand-500/30 selection:text-white">
      {/* Premium Sticky Glass Navbar */}
      <header className="sticky top-0 z-40 bg-darkBg/65 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to={HOME} className="text-xl font-extrabold text-white tracking-tight font-display flex items-center gap-2 select-none group">
            <BookOpen className="w-5.5 h-5.5 text-brand-500 group-hover:rotate-6 transition-transform" />
            <span>Aura<span className="text-brand-500">Books</span></span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to={HOME}
              className={`text-xs font-bold uppercase tracking-wider transition-all ${
                isActive(HOME) ? 'text-brand-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to={BOOKS}
              className={`text-xs font-bold uppercase tracking-wider transition-all ${
                isActive(BOOKS) ? 'text-brand-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Books
            </Link>
          </nav>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link to={WISHLIST} className="relative p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-white/5 transition-all">
                  <Heart className="w-5 h-5" />
                  {wishlistBooks.length > 0 && (
                    <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-darkBg">
                      {wishlistBooks.length}
                    </span>
                  )}
                </Link>

                {/* Shopping Cart */}
                <Link to={CART} className="relative p-2 text-slate-400 hover:text-brand-400 rounded-xl hover:bg-white/5 transition-all">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-brand-500 text-white text-[9px] font-extrabold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-darkBg">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Profile menu dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors focus:outline-none"
                  >
                    <div className="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                      {user?.name.charAt(0)}
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-48 bg-darkCard border border-white/5 rounded-xl shadow-2xl py-2 z-50 fade-in-slide">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="font-bold text-white text-sm truncate">{user?.name}</p>
                        <p className="text-slate-500 text-xs truncate mt-0.5">{user?.email}</p>
                      </div>
                      
                      {user?.role === 'admin' && (
                        <Link
                          to={ADMIN_DASHBOARD}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-white/5 text-xs font-semibold"
                        >
                          <Settings className="w-4 h-4 text-slate-400" /> Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to={PROFILE}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-white/5 text-xs font-semibold"
                      >
                        <User className="w-4 h-4 text-slate-400" /> My Profile
                      </Link>

                      <Link
                        to={ORDERS}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-300 hover:bg-white/5 text-xs font-semibold"
                      >
                        <ShoppingCart className="w-4 h-4 text-slate-400" /> Order History
                      </Link>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-red-400 hover:bg-red-950/20 text-xs font-bold border-t border-white/5 mt-1"
                      >
                        <LogOut className="w-4 h-4 text-red-400" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to={LOGIN}
                className="py-2 px-5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-brand-500/10 transition-all border border-brand-500/10"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger Menu - Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:bg-white/5 rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Side Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-darkBg/95 py-4 px-6 space-y-4">
            <Link
              to={HOME}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300"
            >
              Home
            </Link>
            <Link
              to={BOOKS}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300"
            >
              Books
            </Link>

            <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={CART}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-slate-300 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" /> Shopping Cart ({cartCount})
                  </Link>
                  <Link
                    to={WISHLIST}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-slate-300 flex items-center gap-2"
                  >
                    <Heart className="w-5 h-5" /> My Wishlist ({wishlistBooks.length})
                  </Link>
                  <Link
                    to={PROFILE}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-slate-300 flex items-center gap-2"
                  >
                    <User className="w-5 h-5" /> My Profile
                  </Link>
                  <Link
                    to={ORDERS}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-slate-300 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" /> Order History
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to={ADMIN_DASHBOARD}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bold text-brand-400 flex items-center gap-2"
                    >
                      <Settings className="w-5 h-5" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-sm font-bold text-red-400 flex items-center gap-2 pt-2 border-t border-white/5"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to={LOGIN}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>

      {/* SaaS-Style Premium Grid Footer */}
      <footer className="bg-darkBg border-t border-white/5 py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left relative z-10">
          <div className="space-y-1">
            <h4 className="text-white font-extrabold font-display text-base tracking-tight">Aura<span className="text-brand-500">Books</span></h4>
            <p className="text-xs text-slate-500">The luxury literary marketplace. Built for storytellers.</p>
          </div>
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} AuraBooks Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
