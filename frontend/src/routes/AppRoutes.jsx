import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/Admin/Dashboard';
import UserDashboard from '../pages/User/StoreList';
import StoreOwnerDashboard from '../pages/storeOwner/RatingDashboard';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/store/dashboard" element={<StoreOwnerDashboard />} />
      </Routes>
    </Router>
  );
}
