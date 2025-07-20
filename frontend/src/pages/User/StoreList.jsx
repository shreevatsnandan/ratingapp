import React, { useEffect, useState } from 'react';
import { checkRole } from '../../utils/auth';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({});
  const [message, setMessage] = useState('');

  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    checkRole('user');
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/getuser/stores?user_id=${user_id}`);
        const data = await res.json();
        setStores(data);
        const initialRatings = {};
        data.forEach(store => {
          if (store.user_rating) initialRatings[store.id] = store.user_rating;
        });
        setRatings(initialRatings);
      } catch (err) {
        console.error('Error fetching stores:', err);
      }
    };
    fetchStores();
  }, [user_id]);

  const handleRatingChange = (storeId, value) => {
    setRatings(prev => ({ ...prev, [storeId]: value }));
  };

  const submitRating = async (storeId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/getuser/addRating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_user_id: storeId,
          reviewer_user_id: user_id,
          rating: ratings[storeId],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Rating submitted!');
      } else {
        setMessage(data.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Rating error:', error);
      setMessage('Error submitting rating');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    window.location.href = "./";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Store List</h1>
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {stores.map((store) => (
        <div key={store.id} className="border p-4 rounded mb-4 shadow">
          <h2 className="text-lg font-semibold">{store.name}</h2>
          <p className="text-gray-600">{store.address}</p>

          <p className="text-sm text-yellow-600">
            Average Rating: {store.average_rating || 'No ratings yet'}
          </p>
          <p className="text-sm text-blue-600">
            My Rating: {store.user_rating ? `${store.user_rating}` : 'Not rated yet'}
          </p>

          <div className="flex items-center mt-2 space-x-2">
            <select
              value={ratings[store.id] || ''}
              onChange={(e) => handleRatingChange(store.id, e.target.value)}
              className="border p-1 rounded"
            >
              <option value="">Rate this store</option>
              {[1, 2, 3, 4, 5].map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
            <button
              onClick={() => submitRating(store.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              disabled={!ratings[store.id]}
            >
              {store.user_rating ? 'Update' : 'Submit'}
            </button>
          </div>
        </div>
      ))}
       <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
    
  );
};

export default UserDashboard;