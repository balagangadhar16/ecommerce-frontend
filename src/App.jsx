import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Cart from './pages/Cart/Cart';
import PaymentResult from './pages/PaymentResult/PaymentResult';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminAddProduct from './pages/AdminAddProduct/AdminAddProduct';
import AdminDeleteProduct from './pages/AdminDeleteProduct/AdminDeleteProduct';
import AdminModifyUser from './pages/AdminModifyUser/AdminModifyUser';
import AdminUserDetails from './pages/AdminUserDetails/AdminUserDetails';
import AdminAnalytics from './pages/AdminAnalytics/AdminAnalytics';

const AUTH_PATHS = ['/login', '/register'];

// Pages that render their own standalone header instead of the customer navbar.
const STANDALONE_PREFIXES = ['/admin'];

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppShell />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}

function AppShell() {
  const location = useLocation();
  const isStandalonePage =
    STANDALONE_PREFIXES.some((prefix) => location.pathname.startsWith(prefix)) ||
    AUTH_PATHS.includes(location.pathname);

  return (
    <>
      {!isStandalonePage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/result"
          element={
            <ProtectedRoute>
              <PaymentResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AdminAddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/delete-product"
          element={
            <AdminRoute>
              <AdminDeleteProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/modify-user"
          element={
            <AdminRoute>
              <AdminModifyUser />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/user-details"
          element={
            <AdminRoute>
              <AdminUserDetails />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics/day"
          element={
            <AdminRoute>
              <AdminAnalytics mode="day" />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics/month"
          element={
            <AdminRoute>
              <AdminAnalytics mode="month" />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics/year"
          element={
            <AdminRoute>
              <AdminAnalytics mode="year" />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics/overall"
          element={
            <AdminRoute>
              <AdminAnalytics mode="overall" />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
