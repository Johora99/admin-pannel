// UserTable.jsx
import React, { useEffect, useState } from 'react';
import Toolbar from './Toolbar';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import Toast from './Toast';
import ConfirmationModal from './ConfirmationModal';
import useAuth from '../Hooks/useAuth';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [action, setAction] = useState(null);
  const {user} = useAuth()
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await axiosSecure.get('/api/admin/users');
      setUsers(res.data);
      setSelected(new Set());
      setSelectAll(false);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        window.location.href = '/';
        return;
      }
      setMessage({ type: 'error', text: 'Failed to load users.' });
    } finally {
      setLoading(false);
    }
  }

  function toggleOne(id) {
    const copy = new Set(selected);
    if (copy.has(id)) copy.delete(id);
    else copy.add(id);
    setSelected(copy);
    setSelectAll(copy.size === users.length && users.length > 0);
  }

  function toggleAll() {
    if (selectAll) {
      setSelected(new Set());
      setSelectAll(false);
    } else {
      const all = new Set(users.map((u) => u._id));
      setSelected(all);
      setSelectAll(true);
    }
  }

  function selectedIds() {
    return Array.from(selected);
  }

  async function handleAction(action) {
  try {
    if (action === 'delete-unverified') {
      setAction(action);
      setIsModalOpen(true);
      return;
    }
if (action === 'select-non-current') {
  const currentUserEmail = localStorage.getItem('userEmail'); 
  const nonCurrentUsers = users.filter(u => u.email !== currentUserEmail);
  const allIds = new Set(nonCurrentUsers.map(u => u._id));
  setSelected(allIds);
  setSelectAll(false); 
  return;
}
    const ids = selectedIds();
    if (ids.length === 0) {
      setMessage({ type: 'error', text: 'Select at least one user.' });
      return;
    }
    await axiosSecure.post(`/api/admin/${action}`, { ids });
    setMessage({ type: 'success', text: `${action} succeeded.` });
    fetchUsers();
  } catch (err) {
    setMessage({ type: 'error', text: 'Operation failed.' });
  }
}

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  function formatRelativeTime(date) {
    if (!date) return '—';
    const now = new Date();
    const lastLogin = new Date(date);
    const diffMs = now - lastLogin;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffMs / 604800000);

    if (diffMins < 1) return 'less than a minute ago';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  }

  function generateActivityBars() {
    return Array.from({ length: 7 }, () => Math.random() * 100);
  }

  return (
    <div className="container w-full sm:w-11/12 mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">User Management</h2>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <Toolbar selectedCount={selected.size} onAction={handleAction} />
        <button
          onClick={handleLogout}
          className="ml-0 sm:ml-4 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-medium rounded-lg shadow cursor-pointer"
        >
          Logout
        </button>
      </div>

      <Toast message={message} />

      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="w-10 px-3 py-2 sm:px-6 sm:py-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  aria-label="Select all"
                />
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                Last seen
              </th>
              <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider">
                Registered
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-3 sm:px-6 py-12 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-3 sm:px-6 py-12 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u._id}
                  className={`hover:bg-gray-50 transition-colors ${selected.has(u._id) ? 'bg-blue-50' : ''}`}
                  onMouseEnter={() => setHoveredRow(u._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-3 sm:px-6 py-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selected.has(u._id)}
                      onChange={() => toggleOne(u._id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      aria-label={`Select ${u.name}`}
                    />
                  </td>
                  <td className="px-3 sm:px-6 py-2 whitespace-nowrap">
                    <div className="text-sm sm:text-base font-medium text-gray-900">{u.name}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-2 whitespace-nowrap">
                    <div className="text-sm sm:text-base text-gray-900">{u.email}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${
                        u.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : u.status === 'blocked'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-2 whitespace-nowrap">
                    <div className="relative">
                      <div className="text-sm sm:text-base text-gray-900">{formatRelativeTime(u.lastLogin)}</div>
                      <div className="flex items-end gap-0.5 mt-1 h-6">
                        {generateActivityBars().map((height, i) => (
                          <div
                            key={i}
                            className="w-2 bg-blue-400 rounded-sm transition-all"
                            style={{ height: `${height}%`, opacity: 0.7 }}
                          ></div>
                        ))}
                      </div>
                      {hoveredRow === u._id && u.lastLogin && (
                        <div className="absolute left-0 top-full mt-1 z-10 px-2 py-1 bg-gray-900 text-white text-xs sm:text-sm rounded shadow-lg whitespace-nowrap">
                          {new Date(u.lastLogin).toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-2 whitespace-nowrap">
                    <div className="text-sm sm:text-base text-gray-900">{new Date(u.createdAt).toLocaleDateString()}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={async () => {
          try {
            if (action === 'delete-unverified') {
              await axiosSecure.post('/api/admin/delete-unverified');
              setMessage({ type: 'success', text: 'Deleted unverified users.' });
              fetchUsers();
            }
          } catch (err) {
            setMessage({ type: 'error', text: 'Operation failed.' });
          } finally {
            setIsModalOpen(false);
            setAction(null);
          }
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setAction(null);
        }}
        message="Are you sure you want to delete all unverified users?"
      />
    </div>
  );
}
