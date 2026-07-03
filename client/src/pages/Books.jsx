import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchBooks, selectBooks, updateFilters, updatePage, resetFilters } from '../features/books/bookSlice';
import { fetchCategories, selectCategories } from '../features/books/categorySlice';
import { BookCard } from './Home';
import { BookCardSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';
import useDebounce from '../hooks/useDebounce';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, BookOpen } from 'lucide-react';

const Books = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { books, totalPages, currentPage, filters, loading } = useSelector(selectBooks);
  const { categories } = useSelector(selectCategories);

  // Local state for search query to provide instantaneous UI updates
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Handle mobile filter sidebar visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync category URL query params on load
  useEffect(() => {
    dispatch(fetchCategories());
    const catQuery = searchParams.get('category');
    if (catQuery) {
      dispatch(updateFilters({ category: catQuery }));
    }
  }, [dispatch, searchParams]);

  // Dispatch search action on debounced query changes
  useEffect(() => {
    dispatch(updateFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  // Load books whenever filters or page changes
  useEffect(() => {
    dispatch(fetchBooks(filters));
  }, [filters, dispatch]);

  const handleFilterChange = (key, val) => {
    dispatch(updateFilters({ [key]: val }));
  };

  const handlePageChange = (page) => {
    dispatch(updatePage(page));
  };

  const handleReset = () => {
    setSearchQuery('');
    dispatch(resetFilters());
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-indigo-600" /> Filters
            </h2>
            <button onClick={handleReset} className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1 font-semibold">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm glass-input placeholder:text-slate-400 text-slate-100"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm glass-input text-slate-100"
            >
              <option value="" className="text-slate-900">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id} className="text-slate-900">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Max Price (₹)</label>
            <input
              type="number"
              placeholder="e.g. 1000"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm glass-input placeholder:text-slate-400 text-slate-100"
            />
          </div>

          {/* Sorting */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 text-sm glass-input text-slate-100"
            >
              <option value="-createdAt" className="text-slate-900">Newest Releases</option>
              <option value="price" className="text-slate-900">Price: Low to High</option>
              <option value="-price" className="text-slate-900">Price: High to Low</option>
              <option value="-ratings.average" className="text-slate-900">Highest Rated</option>
            </select>
          </div>
        </aside>

        {/* Catalog list grid */}
        <main className="flex-1 space-y-8">
          {/* Header toolbar */}
          <div className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
            <p className="text-sm text-slate-500 font-semibold">
              Showing <span className="text-slate-800">{books.length}</span> results
            </p>
            
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden py-2 px-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Mobile Filters Overlay (collapsible) */}
          {showMobileFilters && (
            <div className="md:hidden bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 text-base">Quick Filter</h3>
                <button onClick={handleReset} className="text-xs text-indigo-600 font-bold">
                  Reset All
                </button>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm text-slate-900 placeholder:text-slate-500"
              />
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm text-slate-900"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm text-slate-900"
              >
                <option value="-createdAt">Newest Releases</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-ratings.average">Highest Rated</option>
              </select>
            </div>
          )}

          {/* Book Grid Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          ) : books.length === 0 ? (
            <EmptyState
              title="No Books Found"
              description="There are no books matching your search query or filters. Try adjusting your fields."
              icon={BookOpen}
              actionText="Reset Filters"
              onActionClick={handleReset}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 fade-in-slide">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm font-bold text-slate-600 px-4">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Books;
