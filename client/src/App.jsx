import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Login from './features/auth/Login';
import Register from './features/auth/Register';

// Protected Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

// Constants
import * as routes from './constants/routes';

// Slices
import { fetchMe, localLogout } from './features/auth/authSlice';

// Bootstrapper sub-component to invoke auth checks on load
const AppBootstrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if session cookie is active on startup
    dispatch(fetchMe());

    // Listen to unauthorized global events from Axios interceptors
    const handleAuthLogoutEvent = () => {
      dispatch(localLogout());
    };
    window.addEventListener('auth-logout', handleAuthLogoutEvent);

    return () => {
      window.removeEventListener('auth-logout', handleAuthLogoutEvent);
    };
  }, [dispatch]);

  return (
    <Routes>
      {/* Public & Customer Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path={routes.BOOKS} element={<Books />} />
        <Route path={routes.BOOK_DETAILS} element={<BookDetails />} />
        <Route path={routes.LOGIN} element={<Login />} />
        <Route path={routes.REGISTER} element={<Register />} />

        {/* Protected Customer Routes */}
        <Route
          path={routes.CART}
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.CHECKOUT}
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.ORDERS}
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.WISHLIST}
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Protected Admin Console Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path={routes.ADMIN_BOOKS} element={<AdminBooks />} />
        <Route path={routes.ADMIN_CATEGORIES} element={<AdminCategories />} />
        <Route path={routes.ADMIN_ORDERS} element={<AdminOrders />} />
        <Route path={routes.ADMIN_USERS} element={<AdminUsers />} />
      </Route>

      {/* Fallback Route redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ToastProvider>
          <BrowserRouter>
            <AppBootstrapper />
          </BrowserRouter>
        </ToastProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
