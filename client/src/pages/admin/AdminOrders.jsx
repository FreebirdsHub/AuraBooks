import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOrders, updateAdminOrderStatus, selectAdmin } from '../../features/admin/adminSlice';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag, Truck, Calendar, User, CheckCircle2, ChevronRight, X } from 'lucide-react';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { orders, loading } = useSelector(selectAdmin);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateAdminOrderStatus({ orderId, orderStatus: newStatus })).unwrap();
      showToast(`Order status updated to "${newStatus}"!`, 'success');
      // If active drawer is open, update selectedOrder locally
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (err) {
      showToast(err || 'Failed to update status', 'error');
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'pending':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 py-4 fade-in-slide relative">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">Manage Orders</h1>
        <p className="text-slate-500 mt-1 text-sm">Oversee shipment fulfillment and track payment status updates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders Table list (Left 2-Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6 text-center">Amount</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
                {loading && orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">Loading order history...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">No orders placed on system yet.</td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-800">#{ord._id.slice(-6)}...</td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-800">{ord.user?.name || 'User'}</p>
                        <p className="text-xs text-slate-400">{ord.user?.email || 'N/A'}</p>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-slate-900">₹{ord.totalAmount}</td>
                      <td className="py-4 px-6 text-center">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="py-1.5 px-3 bg-brand-50 hover:bg-brand-600 text-brand-600 hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-0.5"
                        >
                          View Details <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Drawer/Sidebar (Right 1-Col) */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6 fade-in-slide sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold font-display text-slate-800">Order Specification</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-slate-400 text-xs font-semibold uppercase block mb-1">Full ID</span>
                  <p className="font-mono text-xs text-slate-800 font-bold">#{selectedOrder._id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-slate-400" />
                    <div className="text-xs">
                      <span className="text-slate-400 block font-semibold">Date</span>
                      <span className="text-slate-700 font-bold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4.5 h-4.5 text-slate-400" />
                    <div className="text-xs">
                      <span className="text-slate-400 block font-semibold">Customer</span>
                      <span className="text-slate-700 font-bold">{selectedOrder.user?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-b border-slate-100 py-3 flex justify-between text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase block mb-0.5">Payment</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPaymentBadge(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 font-semibold uppercase block mb-0.5">Fulfillment</span>
                    <span className="bg-indigo-50 border border-indigo-200 text-brand-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <span className="text-slate-400 text-xs font-semibold uppercase block">Items List</span>
                  <div className="divide-y divide-slate-100 bg-slate-50 border border-slate-100 p-3 rounded-xl max-h-40 overflow-y-auto space-y-2">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs pt-1.5 first:pt-0">
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">{it.title}</p>
                          <p className="text-slate-400 text-[10px] mt-0.5">₹{it.price} x {it.quantity}</p>
                        </div>
                        <span className="font-bold text-slate-800">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping address details */}
                <div className="text-xs">
                  <span className="text-slate-400 font-semibold uppercase block mb-1">Shipping Target</span>
                  <p className="text-slate-600 leading-relaxed font-semibold">
                    {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-2xl text-center text-slate-400 text-sm sticky top-6">
              Select an order to view detailed metrics and address information.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
