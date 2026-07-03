import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch overall administration overview metrics
export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/admin/stats');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch dashboard statistics');
  }
});

// Fetch all registered users
export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/admin/users');
    return response.data.data.users;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch users');
  }
});

// Update role of a user (Admin/User)
export const updateAdminUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/role`, { role });
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user role');
    }
  }
);

// Fetch all orders in the database (Admin only)
export const fetchAdminOrders = createAsyncThunk('admin/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/orders');
    return response.data.data.orders;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch all orders');
  }
});

// Modify order status (Admin only)
export const updateAdminOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { orderStatus });
      return response.data.data.order;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update order status');
    }
  }
);

// Add a new book (Multipart Form Data)
export const createAdminBook = createAsyncThunk('admin/createBook', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.book;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to create book');
  }
});

// Update book details
export const updateAdminBook = createAsyncThunk(
  'admin/updateBook',
  async ({ bookId, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/books/${bookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.book;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update book');
    }
  }
);

// Delete book
export const deleteAdminBook = createAsyncThunk('admin/deleteBook', async (bookId, { rejectWithValue }) => {
  try {
    await api.delete(`/books/${bookId}`);
    return bookId;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to delete book');
  }
});

// Create new category classification
export const createAdminCategory = createAsyncThunk(
  'admin/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data.data.category;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create category');
    }
  }
);

const initialState = {
  stats: null,
  users: [],
  orders: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Role
      .addCase(updateAdminUserRole.fulfilled, (state, action) => {
        state.users = state.users.map((u) => (u._id === action.payload._id ? action.payload : u));
      })
      // Fetch Orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((o) => (o._id === action.payload._id ? action.payload : o));
      });
  },
});

export const { clearAdminError } = adminSlice.actions;

export const selectAdmin = (state) => state.admin;

export default adminSlice.reducer;
