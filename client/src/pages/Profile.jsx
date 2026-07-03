import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, fetchMe } from '../features/auth/authSlice';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { User, Mail, MapPin, Plus, Trash2, ShieldCheck, Home } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  // Address inputs state
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please fill out all credentials', 'warning');
      return;
    }

    setLoading(true);
    try {
      await api.patch('/auth/update-me', { name, email });
      showToast('Profile updated successfully!', 'success');
      dispatch(fetchMe()); // refresh local Redux user state
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
      showToast('Please fill out all address fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      const addressesCopy = [...(user?.addresses || [])];
      
      // If first address, make it default
      const isDefault = addressesCopy.length === 0;
      
      addressesCopy.push({ ...newAddress, isDefault });

      await api.patch('/auth/update-address', { addresses: addressesCopy });
      showToast('Address added successfully!', 'success');
      setNewAddress({ street: '', city: '', state: '', postalCode: '', country: 'India' });
      setShowAddressForm(false);
      dispatch(fetchMe());
    } catch (err) {
      showToast(err.message || 'Failed to add address', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    setLoading(true);
    try {
      const addressesCopy = (user?.addresses || []).filter((_, i) => i !== index);

      // If deleted address was default, set first remaining as default
      if (user?.addresses[index]?.isDefault && addressesCopy.length > 0) {
        addressesCopy[0] = { ...addressesCopy[0], isDefault: true };
      }

      await api.patch('/auth/update-address', { addresses: addressesCopy });
      showToast('Address removed', 'info');
      dispatch(fetchMe());
    } catch (err) {
      showToast(err.message || 'Failed to remove address', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (index) => {
    setLoading(true);
    try {
      const addressesCopy = (user?.addresses || []).map((addr, i) => ({
        ...addr,
        isDefault: i === index,
      }));

      await api.patch('/auth/update-address', { addresses: addressesCopy });
      showToast('Default address updated!', 'success');
      dispatch(fetchMe());
    } catch (err) {
      showToast(err.message || 'Failed to set default address', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 font-display flex items-center gap-3">
        <User className="w-8 h-8 text-brand-600" /> My Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Details Form (Left 1-Col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-xl font-bold font-display text-slate-800 border-b border-slate-100 pb-3">Details</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm glass-input"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold bg-brand-50 border border-brand-100 p-3 rounded-xl">
                <ShieldCheck className="w-4 h-4" />
                <span>Account Role: <span className="uppercase font-bold">{user?.role}</span></span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Addresses Management (Right 2-Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" /> Address Book
              </h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="py-1.5 px-3 bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Address
              </button>
            </div>

            {/* Inline add address form */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4 fade-in-slide">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* List addresses */}
            {(!user?.addresses || user.addresses.length === 0) ? (
              <div className="text-center py-6 text-slate-400 text-sm">
                No addresses added yet. Add one to complete checkouts faster.
              </div>
            ) : (
              <div className="space-y-4">
                {user.addresses.map((addr, index) => (
                  <div
                    key={addr._id || index}
                    className={`p-4 border rounded-xl flex items-center justify-between transition-all ${
                      addr.isDefault
                        ? 'bg-brand-50/20 border-brand-200 shadow-sm'
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        addr.isDefault ? 'bg-brand-100 text-brand-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-800 font-semibold leading-tight">{addr.street}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                        </p>
                        {addr.isDefault && (
                          <span className="inline-block bg-brand-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-2 uppercase tracking-wide">
                            Default Address
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(index)}
                          className="text-xs text-brand-600 hover:underline font-semibold pr-2"
                        >
                          Make Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(index)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-colors focus:outline-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
