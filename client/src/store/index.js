import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import bookReducer from '../features/books/bookSlice';
import categoryReducer from '../features/books/categorySlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import orderReducer from '../features/orders/orderSlice';
import adminReducer from '../features/admin/adminSlice';
import modalReducer from './slices/modalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    categories: categoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    admin: adminReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Turn off serialization check for easier file uploads handling
    }),
});

export default store;
