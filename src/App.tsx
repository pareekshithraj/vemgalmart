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
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { RefundPage } from './pages/RefundPage';
import { WishlistPage } from './pages/WishlistPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PWABadge } from './components/common/PWABadge';

import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/useAuthStore';
import { requestNotificationPermissionAndToken, onMessageListener } from './lib/firebase';
import { useToast } from './context/ToastContext';

import { useServerWakeup } from './hooks/useServerWakeup';

function App() {
  const { fetchProducts, fetchCart, fetchBanners } = useStore();
  const { user } = useAuthStore();
  const { addToast } = useToast();
  useServerWakeup();

  useEffect(() => {
    // Initialize app data
    fetchProducts();
    fetchCart();
    fetchBanners();
  }, [fetchProducts, fetchCart, fetchBanners]);

  useEffect(() => {
    // Initialize push notifications if user is logged in
    if (user) {
      requestNotificationPermissionAndToken();

      // Listen for foreground messages
      onMessageListener().then((payload: any) => {
        if (payload?.notification) {
          addToast(`${payload.notification.title}: ${payload.notification.body}`, 'success');
        }
      }).catch(err => console.log('failed to setup foreground listener: ', err));
    }
  }, [user, addToast]);

  return (
    <Router>
      <PWABadge />
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
          <ProtectedRoute allowedRoles={['seller', 'ADMIN']}>
            <SellerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/delivery" element={
          <ProtectedRoute allowedRoles={['delivery_man', 'ADMIN']}>
            <DeliveryDashboard />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <WishlistPage />
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

        {/* Legal Pages */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
