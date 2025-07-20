import { useState, useEffect } from 'react';
import CreateUserForm from './CreateUserForm';
import AllUsers from './AllUsers';
import { checkRole } from '../../utils/auth';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  useEffect(() => {
    checkRole('admin');
  }, []);

 useEffect(() => {
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/getuser/dashboard`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  fetchDashboardStats();
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    window.location.href = "/";
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">System Administrator Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">Total Users: <strong>{stats.totalUsers}</strong></div>
        <div className="bg-white p-4 rounded shadow">Total Stores: <strong>{stats.totalStores}</strong></div>
        <div className="bg-white p-4 rounded shadow">Total Ratings: <strong>{stats.totalRatings}</strong></div>
      </div>

      <CreateUserForm />

      <AllUsers />

       <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
