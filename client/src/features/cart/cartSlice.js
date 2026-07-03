import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch the current user's shopping cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    // API returns format: { status: 'success', data: { cart: { items: [...] } } }
    return response.data.data.cart;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch cart');
  }
});

// Add item to cart
export const addToCart = createAsyncThunk('cart/addToCart', async ({ bookId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const response = await api.post('/cart/add', { bookId, quantity });
    return response.data.data.cart;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to add item to cart');
  }
});

// Update item quantity in cart
export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', async ({ bookId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.put('/cart/update', { bookId, quantity });
    return response.data.data.cart;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to update quantity');
  }
});

// Remove item from cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (bookId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/cart/remove/${bookId}`);
    return response.data.data.cart;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to remove item');
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handleCartFulfilled = (state, action) => {
      state.items = action.payload?.items || [];
      state.loading = false;
    };

    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, handleCartFulfilled)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add To Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, handleCartFulfilled)
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Qty
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, handleCartFulfilled)
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove item
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, handleCartFulfilled)
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState } = cartSlice.actions;

export const selectCart = (state) => state.cart;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.book.price * item.quantity, 0);
export const selectCartItemsCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
