import { checkRole } from '../../utils/auth';
import React, { useEffect, useState } from 'react';

const StoreOwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      checkRole('storeowner');
    }, []);

  const storeOwnerId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        console.log
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/storeowner/ratings?id=${storeOwnerId}`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setRatings(data.ratings || []);
          setAvgRating(data.average || 0);
        } else {
          setError(data.message || "Failed to fetch ratings.");
        }
      } catch (err) {
        console.error("Error fetching ratings:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (storeOwnerId) {
      fetchRatings();
    }
  }, [storeOwnerId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    window.location.href = "/";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Store Owner Dashboard</h1>
      <p className="mt-2 text-gray-700">Welcome, Store Owner!</p>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>

      {loading ? (
        <p className="mt-6">Loading...</p>
      ) : error ? (
        <p className="mt-6 text-red-600">{error}</p>
      ) : (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Average Rating: {avgRating?.toFixed(1)}</h2>

          <h3 className="text-md font-semibold mt-4 mb-2">User Ratings:</h3>
          {ratings.length > 0 ? (
            ratings.map((r, idx) => (
              <div key={idx} className="border p-2 mb-2 rounded shadow-sm">
                <p><strong>User:</strong> {r.reviewer_name || `User #${r.reviewer_user_id}`}</p>
                <p><strong>Rating:</strong> {r.rating}</p>
              </div>
            ))
          ) : (
            <p>No ratings yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;


