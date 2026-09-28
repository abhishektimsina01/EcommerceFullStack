import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginModal } from './components/auth/LoginModal'
import { AdminLayout } from './components/layout/AdminLayout'
import { CustomerLayout } from './components/layout/CustomerLayout'
import { AuthProvider } from './context/AuthContext'
import { AuthGateProvider } from './context/AuthGateContext'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminProductDetailPage } from './pages/admin/AdminProductDetailPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminSignupPage } from './pages/AdminSignupPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { CustomerLoginPage } from './pages/CustomerLoginPage'
import { CustomerSignupPage } from './pages/CustomerSignupPage'
import { HomePage } from './pages/HomePage'
import { OrderDetailPage } from './pages/OrderDetailPage'
import { OrdersPage } from './pages/OrdersPage'
import { PaymentResultPage } from './pages/PaymentResultPage'
import { ProductDetailPage } from './pages/ProductDetailPage'

export default function App() {
  return (
    <AuthProvider>
      <AuthGateProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer store — no admin links */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout/:id" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/customer/login" element={<CustomerLoginPage />} />
              <Route path="/customer/signup" element={<CustomerSignupPage />} />
              <Route path="/payment/success" element={<PaymentResultPage success />} />
              <Route path="/payment/failure" element={<PaymentResultPage success={false} />} />
            </Route>

            {/* Separate admin portal — open directly, not linked from the store */}
            <Route path="/admin-portal/login" element={<AdminLoginPage />} />
            <Route path="/admin-portal/signup" element={<AdminSignupPage />} />
            <Route path="/admin/login" element={<Navigate to="/admin-portal/login" replace />} />
            <Route path="/admin/signup" element={<Navigate to="/admin-portal/signup" replace />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="product/:id" element={<AdminProductDetailPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <LoginModal />
        </BrowserRouter>
      </AuthGateProvider>
    </AuthProvider>
  )
}
