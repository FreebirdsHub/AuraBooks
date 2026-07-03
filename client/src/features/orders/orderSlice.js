import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Create a new order (placing checkout details)
export const placeOrder = createAsyncThunk('orders/placeOrder', async (orderData, { rejectWithValue }) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data.data.order;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to place order');
  }
});

// Fetch order history for the logged-in user
export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/orders/my-orders');
    return response.data.data.orders;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch your orders');
  }
});

// Fetch detailed specifications of a specific order
export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data.data.order;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch order details');
  }
});

const initialState = {
  myOrders: [],
  selectedOrder: null,
  loading: false,
  selectedOrderLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.myOrders = [action.payload, ...state.myOrders];
        state.loading = false;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order By Id
      .addCase(fetchOrderById.pending, (state) => {
        state.selectedOrderLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        state.selectedOrderLoading = false;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.selectedOrderLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, clearSelectedOrder } = orderSlice.actions;

export const selectOrders = (state) => state.orders;

export default orderSlice.reducer;
