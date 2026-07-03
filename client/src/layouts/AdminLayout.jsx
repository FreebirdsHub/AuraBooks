import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { BarChart, BookOpen, FolderOpen, ShoppingCart, Users, Home, Settings } from 'lucide-react';
import {
  ADMIN_DASHBOARD,
  ADMIN_BOOKS,
  ADMIN_CATEGORIES,
  ADMIN_ORDERS,
  ADMIN_USERS
} from '../constants/routes';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const sidebarLinks = [
    { label: 'Overview Metrics', path: ADMIN_DASHBOARD, icon: <BarChart className="w-5 h-5" /> },
    { label: 'Books Catalog', path: ADMIN_BOOKS, icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Genres & Categories', path: ADMIN_CATEGORIES, icon: <FolderOpen className="w-5 h-5" /> },
    { label: 'Order Records', path: ADMIN_ORDERS, icon: <ShoppingCart className="w-5 h-5" /> },
    { label: 'User Directory', path: ADMIN_USERS, icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-400 border-r border-slate-800 flex flex-col justify-between flex-shrink-0 shadow-lg">
        <div>
          {/* Header */}
          <div className="h-16 px-6 flex items-center gap-2.5 border-b border-slate-800">
            <Settings className="w-6 h-6 text-brand-500" />
            <span className="font-extrabold text-white tracking-tight font-display text-lg">
              Admin Panel
            </span>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Exit back to store link */}
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 hover:text-white transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Store Home</span>
          </Link>
        </div>
      </aside>

      {/* Main Administrative Context Panel */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
