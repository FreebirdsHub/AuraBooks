import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, selectBooks } from '../../features/books/bookSlice';
import { fetchCategories, selectCategories } from '../../features/books/categorySlice';
import { createAdminBook, updateAdminBook, deleteAdminBook } from '../../features/admin/adminSlice';
import { useToast } from '../../context/ToastContext';
import ImageWithFallback from '../../components/ImageWithFallback';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

const AdminBooks = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { books, loading } = useSelector(selectBooks);
  const { categories } = useSelector(selectCategories);

  // Form Modal States
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [fileInput, setFileInput] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks({ limit: 100 })); // fetch large batch for admin list
    dispatch(fetchCategories());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      price: '',
      stock: '',
      category: '',
    });
    setFileInput(null);
    setSelectedBookId(null);
    setEditMode(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (book) => {
    setFormData({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      price: book.price || '',
      stock: book.stock || '',
      category: book.category?._id || book.category || '',
    });
    setSelectedBookId(book._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    setFileInput(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.price || !formData.stock || !formData.category) {
      showToast('Please fill out all required details', 'warning');
      return;
    }

    if (!editMode && !fileInput) {
      showToast('Please upload a cover art image', 'warning');
      return;
    }

    setFormLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('category', formData.category);
    if (fileInput) {
      data.append('coverImage', fileInput);
    }

    try {
      if (editMode) {
        await dispatch(updateAdminBook({ bookId: selectedBookId, formData: data })).unwrap();
        showToast('Book details updated successfully!', 'success');
      } else {
        await dispatch(createAdminBook(data)).unwrap();
        showToast('New book registered to catalog!', 'success');
      }
      setShowModal(false);
      resetForm();
      dispatch(fetchBooks({ limit: 100 })); // Refresh book tables
    } catch (err) {
      showToast(err || 'Failed to submit book data', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book? This action is irreversible.')) {
      try {
        await dispatch(deleteAdminBook(bookId)).unwrap();
        showToast('Book removed from bookstore catalog', 'info');
        dispatch(fetchBooks({ limit: 100 }));
      } catch (err) {
        showToast(err || 'Failed to delete book', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 py-4 fade-in-slide">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">Manage Books</h1>
          <p className="text-slate-500 mt-1 text-sm">Add, modify, and delete books in your store catalog</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Book
        </button>
      </div>

      {/* Books Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Book Details</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-center">Price</th>
                <th className="py-4 px-6 text-center">Stock</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
              {loading && books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">Loading catalog items...</td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">No books found in catalog.</td>
                </tr>
              ) : (
                books.map((book) => {
                  const imageUrl = book.coverImage
                    ? book.coverImage.startsWith('http') 
                      ? book.coverImage 
                      : `${import.meta.env.VITE_ASSET_URL || 'http://localhost:5000'}/${book.coverImage.replace(/\\/g, '/')}`
                    : null;
                  
                  return (
                    <tr key={book._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-10 h-14 rounded overflow-hidden border border-slate-100 flex-shrink-0">
                          <ImageWithFallback src={imageUrl} alt={book.title} title={book.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">{book.title}</p>
                          <p className="text-xs text-slate-400">by {book.author}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded">
                          {book.category?.name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-slate-900">₹{book.price}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`font-semibold ${book.stock < 5 ? 'text-amber-600' : 'text-slate-600'}`}>
                          {book.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(book)}
                          className="p-2 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50/50 transition-all inline-flex focus:outline-none"
                        >
                          <Edit className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50/50 transition-all inline-flex focus:outline-none"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Form Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 max-h-[90vh] overflow-y-auto fade-in-slide">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-slate-800">
                {editMode ? 'Edit Book Details' : 'Register New Book'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Book Title *</label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm bg-slate-50/50 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Author *</label>
                  <input
                    type="text"
                    required
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm bg-slate-50/50 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category *</label>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm bg-slate-50/50 text-slate-900"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm bg-slate-50/50 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Inventory Stock *</label>
                  <input
                    type="number"
                    required
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm bg-slate-50/50 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm bg-slate-50/50 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cover Art Image</label>
                <label className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/30 text-center hover:bg-slate-50 transition-colors cursor-pointer w-full">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-xs text-slate-500 focus:outline-none w-full flex justify-center mt-2"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or JPEG up to 5MB</p>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : 'Confirm Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
