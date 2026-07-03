import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers, updateAdminUserRole, selectAdmin } from '../../features/admin/adminSlice';
import { selectAuth } from '../../features/auth/authSlice';
import { useToast } from '../../context/ToastContext';
import { Users, ShieldAlert, Award, Calendar, Mail } from 'lucide-react';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { users, loading } = useSelector(selectAdmin);
  const { user: currentUser } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser._id) {
      showToast('You cannot modify your own administrative role', 'warning');
      return;
    }

    try {
      await dispatch(updateAdminUserRole({ userId, role: newRole })).unwrap();
      showToast(`User role successfully changed to "${newRole}"!`, 'success');
      dispatch(fetchAdminUsers()); // Refresh users grid
    } catch (err) {
      showToast(err || 'Failed to update user role', 'error');
    }
  };

  return (
    <div className="space-y-6 py-4 fade-in-slide">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display flex items-center gap-2">
          <Users className="w-8 h-8 text-brand-600" /> Manage Users
        </h1>
        <p className="text-slate-500 mt-1 text-sm">View user accounts, verify login registration times, and adjust roles</p>
      </div>

      {/* Users table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6 text-center">Registration Date</th>
                <th className="py-4 px-6 text-center">Role Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">Loading user accounts directory...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">No users registered on the platform.</td>
                </tr>
              ) : (
                users.map((usr) => (
                  <tr key={usr._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                          {usr.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">{usr.name}</span>
                        {usr._id === currentUser._id && (
                          <span className="bg-brand-50 border border-brand-100 text-brand-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{usr.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-slate-500">
                        <Calendar className="w-4.5 h-4.5 text-slate-400" />
                        <span>{new Date(usr.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        usr.role === 'admin'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {usr.role === 'admin' ? <Award className="w-3.5 h-3.5" /> : null}
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {usr._id === currentUser._id ? (
                        <span className="text-xs text-slate-400 italic">Protected Self</span>
                      ) : (
                        <select
                          value={usr.role}
                          onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                          className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider focus:outline-none"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-2.5 text-slate-500 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <p className="leading-relaxed">
          <strong>Security Notice:</strong> Granting administrative access delegates all catalog CRUD operations, user privilege overrides, and financial revenue trackers to that account. Make changes cautiously.
        </p>
      </div>
    </div>
  );
};

export default AdminUsers;
