import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats, selectAdmin } from '../../features/admin/adminSlice';
import { DashboardSkeleton } from '../../components/Skeletons';
import { BarChart, DollarSign, ShoppingBag, BookOpen, Users, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector(selectAdmin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading || !stats) return <DashboardSkeleton />;

  const { totalBooks, totalUsers, totalOrders, totalRevenue, monthlyRevenue } = stats;

  const maxMonthRev = monthlyRevenue?.length > 0
    ? Math.max(...monthlyRevenue.map((m) => m.revenue))
    : 1;

  return (
    <div className="space-y-8 py-4 fade-in-slide">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">Overview Analytics</h1>
        <p className="text-slate-500 mt-1 text-sm">System administration and bookstore overview metrics</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Sales</span>
            <h3 className="text-2xl font-black text-slate-900 font-display">₹{totalRevenue}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Orders</span>
            <h3 className="text-2xl font-black text-slate-900 font-display">{totalOrders}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Books */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Books catalog</span>
            <h3 className="text-2xl font-black text-slate-900 font-display">{totalBooks}</h3>
          </div>
          <div className="w-12 h-12 bg-violet-50 text-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Users */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Users Registered</span>
            <h3 className="text-2xl font-black text-slate-900 font-display">{totalUsers}</h3>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Monthly analytics representation using CSS bars */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
        <h3 className="text-lg font-bold font-display text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <BarChart className="w-5 h-5 text-indigo-600" /> Revenue Stream Overview
        </h3>

        {!monthlyRevenue || monthlyRevenue.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No monthly analytics logs recorded. Complete paid transactions to populate data.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-end justify-between gap-6 h-48 px-4 pt-4 border-b border-slate-200">
              {monthlyRevenue.map((data) => {
                const heightPercentage = `${Math.max(12, (data.revenue / maxMonthRev) * 100)}%`;
                return (
                  <div key={data._id} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Hover detail tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md absolute -translate-y-[200%] pointer-events-none">
                      ₹{data.revenue} ({data.count} orders)
                    </div>
                    {/* Bar representation */}
                    <div
                      style={{ height: heightPercentage }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-indigo-600 to-indigo-400 hover:from-indigo-500 hover:to-indigo-300 rounded-t-lg transition-all shadow-md group-hover:shadow-lg"
                    />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{data._id}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Bars illustrate percentage comparison to peak sales months.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
