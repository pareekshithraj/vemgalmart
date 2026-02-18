import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SellerDashboard } from './pages/SellerDashboard';
import { DeliveryDashboard } from './pages/DeliveryDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { AddressesPage } from './pages/AddressesPage';
import { SupportPage } from './pages/SupportPage';
import { ProfilePage } from './pages/ProfilePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { ToastProvider } from './context/ToastContext';

import { useEffect } from 'react';
import { useStore } from './store/useStore';

function App() {
  const { fetchProducts, fetchCart, fetchBanners } = useStore();

  useEffect(() => {
    // Initialize app data
    fetchProducts();
    fetchCart();
    fetchBanners();
  }, [fetchProducts, fetchCart, fetchBanners]);

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Protected Routes */}
          <Route path="/seller" element={
            <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
              <SellerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/delivery" element={
            <ProtectedRoute allowedRoles={['DELIVERY_PARTNER', 'ADMIN']}>
              <DeliveryDashboard />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/addresses" element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          } />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
