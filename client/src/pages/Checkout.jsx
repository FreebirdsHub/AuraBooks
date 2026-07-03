import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCart, selectCartTotal } from '../features/cart/cartSlice';
import { selectAuth } from '../features/auth/authSlice';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { CreditCard, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react';
import { ORDERS, CART } from '../constants/routes';

const Checkout = () => {
  const { items } = useSelector(selectCart);
  const totalAmount = useSelector(selectCartTotal);
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      showToast('Your cart is empty', 'warning');
      navigate(CART);
      return;
    }

    // Prepopulate user default address if available
    if (user?.addresses && user.addresses.length > 0) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setAddress({
        street: def.street || '',
        city: def.city || '',
        state: def.state || '',
        postalCode: def.postalCode || '',
        country: def.country || 'India',
      });
    }
  }, [items, user, navigate, showToast]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.postalCode) {
      showToast('Please fill out all address fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create a Pending order in our DB
      const orderRes = await api.post('/orders', { shippingAddress: address });
      const order = orderRes.data.data.order;

      // Step 2: Create a Razorpay Order
      const rzpRes = await api.post('/payments/create-order', { orderId: order._id });
      const rzpOrder = rzpRes.data.data;

      // Step 3: Open RazorPay Checkout Window
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'AuraBooks',
        description: 'Purchase payment for your order',
        order_id: rzpOrder.id,
        handler: async function (response) {
          try {
            // Step 4: Verify Payment Signature on backend
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });

            showToast('Order purchased and paid successfully!', 'success');
            navigate(ORDERS);
          } catch (err) {
            showToast(err.message || 'Signature verification failed', 'error');
            navigate(ORDERS);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#4f46e5', // Brand Indigo
        },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();
    } catch (err) {
      showToast(err.message || 'Payment pipeline failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 font-display flex items-center gap-3">
        <CreditCard className="w-8 h-8 text-brand-600" /> Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Address form (Left 2-Cols) */}
        <form onSubmit={handlePayment} className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" /> Shipping Details
            </h2>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Street Address</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={address.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm glass-input"
                  placeholder="Apartment, suite, unit, building, street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={address.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">State / Region</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={address.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Postal / Zip Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={address.postalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={address.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500 text-sm glass-input animate-pulse"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="flex items-center gap-2 uppercase tracking-wider font-bold">
                Proceed to Payment (₹{totalAmount})
              </span>
            )}
          </button>
        </form>

        {/* Summary side columns (Right 1-Col) */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShoppingBag className="w-5 h-5 text-brand-600" /> Order Summary
            </h3>

            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-2">
              {items.map((item) => (
                <div key={item._id} className="py-2.5 flex justify-between text-sm">
                  <div>
                    <p className="font-bold text-slate-800 line-clamp-1">{item.book?.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-800">₹{item.book?.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between font-extrabold text-slate-900 text-base">
              <span>Total Price</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payments are processed securely via RazorPay gateway.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
