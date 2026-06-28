import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import ProtectedRoute from '@/components/ProtectedRoute'

const HomePage = lazy(() => import('@/pages/HomePage'))
const ShopPage = lazy(() => import('@/pages/ShopPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const AccountPage = lazy(() => import('@/pages/AccountPage'))
const WishlistPage = lazy(() => import('@/pages/WishlistPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
