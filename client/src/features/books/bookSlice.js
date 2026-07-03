import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch books list with query filters
export const fetchBooks = createAsyncThunk('books/fetchBooks', async (params, { rejectWithValue }) => {
  try {
    const apiParams = { ...params };
    
    // Map frontend names to backend expected names
    if (apiParams.search) {
      apiParams.keyword = apiParams.search;
    }
    delete apiParams.search;
    
    if (apiParams.minPrice || apiParams.maxPrice) {
      apiParams.price = {};
      if (apiParams.minPrice) apiParams.price.gte = apiParams.minPrice;
      if (apiParams.maxPrice) apiParams.price.lte = apiParams.maxPrice;
    }
    delete apiParams.minPrice;
    delete apiParams.maxPrice;
    
    // Remove empty fields to avoid polluting query
    Object.keys(apiParams).forEach(key => {
      if (apiParams[key] === '' || apiParams[key] === undefined || apiParams[key] === null) {
        delete apiParams[key];
      }
    });

    const response = await api.get('/books', { params: apiParams });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch books');
  }
});

// Fetch single book details
export const fetchBookDetails = createAsyncThunk('books/fetchBookDetails', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data.data.book;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch book details');
  }
});

const initialState = {
  books: [],
  totalPages: 1,
  currentPage: 1,
  totalResults: 0,
  selectedBook: null,
  filters: {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
    page: 1,
    limit: 8,
  },
  loading: false,
  detailLoading: false,
  error: null,
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 }; // Reset page on filter update
    },
    updatePage: (state, action) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearBookError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch books list
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books = action.payload.data.books;
        state.totalPages = action.payload.pagination?.pages || 1;
        state.currentPage = action.payload.pagination?.page || 1;
        state.totalResults = action.payload.results || 0;
        state.loading = false;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch book details
      .addCase(fetchBookDetails.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
        state.selectedBook = null;
      })
      .addCase(fetchBookDetails.fulfilled, (state, action) => {
        state.selectedBook = action.payload;
        state.detailLoading = false;
      })
      .addCase(fetchBookDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updateFilters, updatePage, resetFilters, clearBookError } = bookSlice.actions;

export const selectBooks = (state) => state.books;

export default bookSlice.reducer;
