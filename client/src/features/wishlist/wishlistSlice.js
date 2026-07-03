import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { fetchCart } from '../cart/cartSlice';

// Fetch the current user's wishlist
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/wishlist');
    return response.data.data.wishlist.books;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch wishlist');
  }
});

// Add item to wishlist
export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (bookId, { rejectWithValue }) => {
  try {
    const response = await api.post('/wishlist/add', { bookId });
    return response.data.data.wishlist.books;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to add to wishlist');
  }
});

// Remove item from wishlist
export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (bookId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/wishlist/remove/${bookId}`);
    return response.data.data.wishlist.books;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to remove from wishlist');
  }
});

// Move item from wishlist to cart
export const moveWishlistItemToCart = createAsyncThunk(
  'wishlist/moveWishlistItemToCart',
  async (bookId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`/wishlist/move-to-cart/${bookId}`);
      // Refresh cart state
      dispatch(fetchCart());
      return response.data.data.wishlist.books;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to move item to cart');
    }
  }
);

const initialState = {
  books: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistState: (state) => {
      state.books = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handleWishlistFulfilled = (state, action) => {
      state.books = action.payload || [];
      state.loading = false;
    };

    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, handleWishlistFulfilled)
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, handleWishlistFulfilled)
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, handleWishlistFulfilled)
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Move to cart
      .addCase(moveWishlistItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveWishlistItemToCart.fulfilled, handleWishlistFulfilled)
      .addCase(moveWishlistItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;

export const selectWishlist = (state) => state.wishlist;

export default wishlistSlice.reducer;
