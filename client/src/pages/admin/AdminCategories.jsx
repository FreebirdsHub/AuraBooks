import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectCategories } from '../../features/books/categorySlice';
import { createAdminCategory } from '../../features/admin/adminSlice';
import { useToast } from '../../context/ToastContext';
import { FolderPlus, BookOpen } from 'lucide-react';

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { categories, loading } = useSelector(selectCategories);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      showToast('Please provide a category name', 'warning');
      return;
    }

    setFormLoading(true);
    try {
      await dispatch(createAdminCategory({ name, description })).unwrap();
      showToast('New category added successfully!', 'success');
      setName('');
      setDescription('');
      dispatch(fetchCategories()); // Refresh categories
    } catch (err) {
      showToast(err || 'Failed to create category', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-4 fade-in-slide">
      {/* Category Creation Form (Left 1-Col) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FolderPlus className="w-5 h-5 text-indigo-600" /> Create Genre
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                placeholder="e.g. Science Fiction"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm bg-slate-50/50 text-slate-900 placeholder:text-slate-400"
                placeholder="Short genre summary..."
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
            >
              {formLoading ? 'Adding...' : 'Create Category'}
            </button>
          </form>
        </div>
      </div>

      {/* Categories table directory (Right 2-Cols) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> Category List
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
                {loading && categories.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-8 text-slate-400">Loading categories...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-8 text-slate-400">No categories found.</td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800">{cat.name}</td>
                      <td className="py-4 px-6 text-xs text-slate-400 leading-relaxed">
                        {cat.description || 'No descriptive information configured.'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
