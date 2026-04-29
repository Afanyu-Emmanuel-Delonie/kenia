import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationContainer } from './components/NotificationContainer';
import Layout from './components/Layout';
import PageLoader from './components/PageLoader';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AtelierPage from './pages/products/AtelierPage';
import VaultPage from './pages/materials/VaultPage';
import OrdersPage from './pages/orders/OrdersPage';
import InquiriesPage from './pages/inquiries/InquiriesPage';
import CatalogPage from './pages/store/CatalogPage';
import SettingsPage from './pages/settings/SettingsPage';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <AuthProvider>
      <NotificationProvider>
        {!loaded && <PageLoader onDone={() => setLoaded(true)} />}
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<AtelierPage />} />
            <Route path="/materials" element={<VaultPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/inquiries" element={<InquiriesPage />} />
            <Route path="/store" element={<CatalogPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <NotificationContainer />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
