import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyOrders, selectOrders } from '../features/orders/orderSlice';
import ImageWithFallback from '../components/ImageWithFallback';
import EmptyState from '../components/EmptyState';
import { ShoppingBag, ChevronDown, ChevronUp, Calendar, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { BOOKS } from '../constants/routes';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myOrders, loading } = useSelector(selectOrders);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
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

  const getOrderBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading && myOrders.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (myOrders.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16">
        <EmptyState
          title="No Orders Placed Yet"
          description="It looks like you haven't bought any books yet. Explore our selection to place your first order."
          icon={ShoppingBag}
          actionText="Shop Catalog"
          onActionClick={() => navigate(BOOKS)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 font-display flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-brand-600" /> Order History
      </h1>

      <div className="space-y-4">
        {myOrders.map((order) => {
          const isExpanded = expandedOrder === order._id;
          const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          return (
            <div key={order._id} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
              {/* Collapsed/Expanded Header Summary Card */}
              <div
                onClick={() => toggleExpand(order._id)}
                className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
              >
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Order ID</span>
                  <p className="font-mono text-xs text-slate-800 font-bold">#{order._id}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-600 font-semibold">{formattedDate}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider mb-1">Total</span>
                  <p className="font-extrabold text-slate-900 text-base">₹{order.totalAmount}</p>
                </div>

                <div className="flex gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getPaymentBadge(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getOrderBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Expansion Detail Drawer containing timeline track */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/30 p-6 space-y-6 fade-in-slide">
                  {/* Timeline Tracker */}
                  <div className="relative pt-4 pb-2">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                    
                    {/* Active highlight bar */}
                    <div
                      className={`absolute top-1/2 left-0 h-1 bg-brand-600 -translate-y-1/2 z-0 transition-all duration-500`}
                      style={{
                        width:
                          order.orderStatus === 'cancelled'
                            ? '100%'
                            : order.orderStatus === 'delivered'
                            ? '100%'
                            : order.orderStatus === 'shipped'
                            ? '75%'
                            : order.orderStatus === 'processing'
                            ? '50%'
                            : '25%',
                      }}
                    />

                    <div className="relative z-10 flex justify-between text-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${
                          order.paymentStatus === 'paid' ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-300 text-slate-500'
                        }`}>
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">Paid</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${
                          ['processing', 'shipped', 'delivered'].includes(order.orderStatus)
                            ? 'bg-brand-600 border-brand-600 text-white'
                            : 'bg-white border-slate-300 text-slate-500'
                        }`}>
                          P
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">Processing</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${
                          ['shipped', 'delivered'].includes(order.orderStatus)
                            ? 'bg-brand-600 border-brand-600 text-white'
                            : 'bg-white border-slate-300 text-slate-500'
                        }`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">Shipped</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-red-600 border-red-600 text-white'
                            : 'bg-white border-slate-300 text-slate-500'
                        }`}>
                          {order.orderStatus === 'cancelled' ? 'X' : <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                          {order.orderStatus === 'cancelled' ? 'Cancelled' : 'Delivered'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* List items inside order */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Items in Order</h4>
                    
                    <div className="divide-y divide-slate-100 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-inner">
                      {order.items.map((item) => {
                        const imageUrl = item.book?.coverImage
                          ? `${import.meta.env.VITE_ASSET_URL || 'http://localhost:5000'}/${item.book.coverImage.replace(/\\/g, '/')}`
                          : null;

                        return (
                          <div key={item._id} className="p-4 flex gap-4 items-center">
                            <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 border border-slate-100">
                              <ImageWithFallback src={imageUrl} alt={item.title} title={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-800 text-sm line-clamp-1">{item.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5">₹{item.price} each</p>
                            </div>
                            <span className="text-xs bg-slate-50 border border-slate-200 text-slate-700 font-bold px-2 py-1 rounded-lg">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shipping address details */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                    <div>
                      <span className="font-bold text-slate-400 uppercase block mb-1">Shipping Address</span>
                      <p>{order.shippingAddress?.street}</p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
