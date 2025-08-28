import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  const [sorting, setSorting] = useState({ sortBy: 'createdAt', order: 'desc' });
  const location = useLocation();

  // Initialize filters from query string (e.g., ?role=customer or ?role=staff)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && ['customer', 'staff', 'admin'].includes(roleParam)) {
      setFilters(prev => ({ ...prev, role: roleParam }));
    }
  }, [location.search]);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = { ...filters, ...sorting };
      const response = await userService.getAllUsers(params);
      // Tolerate both shapes:
      // 1) { success, data: [...] }
      // 2) [...] (raw array)
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : response?.data?.data || [];
      // Debug
      // eslint-disable-next-line no-console
      console.log('GET /users params:', params, 'response:', response, 'list.length:', list.length);
      setUsers(list);
      // If filters produced no results, try fetching without filters to verify data exists
      if (list.length === 0 && (filters.role || filters.status || filters.search)) {
        try {
          const fallback = await userService.getAllUsers({ sortBy: sorting.sortBy, order: sorting.order });
          const fallbackList = Array.isArray(fallback)
            ? fallback
            : Array.isArray(fallback?.data)
              ? fallback.data
              : fallback?.data?.data || [];
          // eslint-disable-next-line no-console
          console.log('Fallback fetch (no filters) length:', fallbackList.length);
          if (fallbackList.length > 0) {
            toast.info('No users matched current filters. Showing all users.');
            setUsers(fallbackList);
            // Also clear filters in UI to reflect shown data
            setFilters(prev => ({ ...prev, search: '', role: '', status: '' }));
          }
        } catch (e) {
          // ignore, error already handled by outer catch on next render
        }
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch users.';
      toast.error(`Failed to fetch users: ${msg}`);
      // eslint-disable-next-line no-console
      console.error('GET /users failed', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sorting]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSort = (column) => {
    setSorting(prev => ({
      sortBy: column,
      order: prev.sortBy === column && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSetStatus = async (id, isActive) => {
    const action = isActive ? 'activate' : 'deactivate';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await userService.setUserStatus(id, isActive);
        toast.success(`User ${action}d successfully!`);
        fetchUsers();
      } catch (err) {
        toast.error(`Failed to ${action} user.`);
      }
    }
  };

  const handleResetPassword = async (id) => {
    if (window.confirm('Are you sure you want to send a password reset link to this user?')) {
      try {
        await userService.adminResetPassword(id);
        toast.success('Password reset link sent!');
      } catch (err) {
        toast.error('Failed to send password reset link.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      try {
        await userService.deleteUser(id);
        toast.success('User deleted successfully!');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  const SortIcon = ({ column }) => {
    if (sorting.sortBy !== column) return <FaSort />;
    if (sorting.order === 'asc') return <FaSortUp />;
    return <FaSortDown />;
  };

  return (
    <div className="admin-users-container">
      <h2>Manage Users</h2>

      <div className="filters-bar">
        <input
          type="text"
          name="search"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <select name="role" value={filters.role} onChange={handleFilterChange} className="filter-select">
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {isLoading ? <p>Loading users...</p> : (
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Name <SortIcon column="name" /></th>
                <th onClick={() => handleSort('email')}>Email <SortIcon column="email" /></th>
                <th onClick={() => handleSort('role')}>Role <SortIcon column="role" /></th>
                <th onClick={() => handleSort('isActive')}>Status <SortIcon column="isActive" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{padding:'1rem', textAlign:'center', color:'#6c757d'}}>
                    No users found.
                    { (filters.role || filters.status || filters.search) && (
                      <>
                        {' '}Try clearing filters. Current filters: 
                        role=<strong>{filters.role || 'all'}</strong>, 
                        status=<strong>{filters.status || 'all'}</strong>, 
                        search=<strong>{filters.search || 'none'}</strong>
                      </>
                    )}
                  </td>
                </tr>
              ) : users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleSetStatus(user.id, !user.isActive)} className="action-btn">
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleResetPassword(user.id)} className="action-btn">Reset Pass</button>
                    <button onClick={() => handleDelete(user.id)} className="action-btn delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
