import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/common/Navbar';
import NotificationHandler from './components/common/NotificationHandler';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Page Imports
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import RequirePasswordReset from './pages/auth/RequirePasswordReset';

// User Pages
import UserSettings from './pages/user/Settings';
import MyOrders from './pages/customer/MyOrders';
import OrderDetails from './pages/customer/OrderDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminContent from './pages/admin/AdminContent';
import AdminNewsletter from './pages/admin/AdminNewsletter';
// TODO: Create these components
// import AdminProducts from './pages/admin/AdminProducts'; 
// import AdminOrders from './pages/admin/AdminOrders';

// Staff Pages
import StaffOrders from './pages/staff/StaffOrders';
import StaffOrderDetail from './pages/staff/StaffOrderDetail';
import StaffProducts from './pages/staff/StaffProducts';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-container"><div>Loading...</div></div>;
  }

  if (user && user.forcePasswordReset) {
    return <RequirePasswordReset />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Common Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/newsletter" element={<AdminNewsletter />} />
        {/* <Route path="/admin/products" element={<AdminProducts />} /> */}
        {/* <Route path="/admin/orders" element={<AdminOrders />} /> */}
      </Route>

      {/* Staff Routes */}
      <Route element={<ProtectedRoute roles={['staff', 'admin']} />}>
        <Route path="/staff/orders" element={<StaffOrders />} />
        <Route path="/staff/orders/:id" element={<StaffOrderDetail />} />
        <Route path="/staff/products" element={<StaffProducts />} />
      </Route>

      {/* Not Found Route */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <div className="App">
        <Navbar />
        <NotificationHandler />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
        </div>
      </SocketProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </QueryClientProvider>
  );
}

export default App;