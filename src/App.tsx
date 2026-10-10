import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { Categories } from './pages/Categories';
import { Collections } from './pages/Collections';
import { Brands } from './pages/Brands';
// Account Pages
import { AccountLayout } from './pages/account/AccountLayout';
import { AccountOverview } from './pages/account/AccountOverview';
import { AccountOrders } from './pages/account/AccountOrders';
import { AccountWishlist } from './pages/account/AccountWishlist';
import { AccountAddresses } from './pages/account/AccountAddresses';
import { AccountPaymentMethods } from './pages/account/AccountPaymentMethods';
import { AccountNotifications } from './pages/account/AccountNotifications';
import { AccountProfile } from './pages/account/AccountProfile';
import { AccountSettings } from './pages/account/AccountSettings';
import { AccountSupport } from './pages/account/AccountSupport';
import { Auth } from './pages/Auth';
import { 
  About, 
  Contact, 
  ShippingInfo, 
  ReturnsInfo, 
  FAQ, 
  SizeGuide, 
  LegalPage 
} from './pages/InfoPages';

// Admin
import { AdminLayout } from './components/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Products } from './pages/admin/Products';
import { Orders } from './pages/admin/Orders';
import { Categories as AdminCategories } from './pages/admin/Categories';
import { Customers } from './pages/admin/Customers';
import { Inventory } from './pages/admin/Inventory';
import { Discounts } from './pages/admin/Discounts';
import { Reviews } from './pages/admin/Reviews';
import { Analytics } from './pages/admin/Analytics';
import { Settings } from './pages/admin/Settings';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function StoreLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#171717]">
      <ScrollToTop />
      <Header />
      <main className="flex-grow"><Outlet /></main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
}

// Wrapper for /category/:slug that passes category param to Shop
function CategoryShopWrapper() {
  return <Shop />;
}



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
            <ToastContainer />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="customers" element={<Customers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="discounts" element={<Discounts />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Public & Customer Routes */}
        <Route element={<StoreLayout />}>
          {/* Core Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          
          {/* Product Detail Routes */}
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/shop/:slug" element={<ProductDetail />} />
          
          {/* Department & Collections Routes */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:categoryId" element={<CategoryShopWrapper />} />
          <Route path="/category/:categoryId/:sub" element={<CategoryShopWrapper />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collection/:id" element={<Collections />} />

          <Route path="/brands" element={<Brands />} />
          
          {/* User & Transactional Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<ProtectedRoute allowedRoles={['customer']}><Checkout /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute allowedRoles={['customer']}><AccountLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AccountOverview />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="wishlist" element={<AccountWishlist />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="payment-methods" element={<AccountPaymentMethods />} />
            <Route path="notifications" element={<AccountNotifications />} />
            <Route path="profile" element={<AccountProfile />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="support" element={<AccountSupport />} />
          </Route>
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          
          {/* Customer Service & Informational Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/returns" element={<ReturnsInfo />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/privacy" element={<LegalPage title="Privacy Policy" />} />
          <Route path="/terms" element={<LegalPage title="Terms of Service" />} />
          
          {/* Not Found Route */}
          <Route path="*" element={
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
              <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-2">404 Error</span>
              <h1 className="text-4xl font-serif font-bold text-[#111111] mb-3">Page Not Found</h1>
              <p className="text-sm text-[#777777] max-w-md mx-auto mb-6">
                The requested page does not exist or has been relocated to another section of the boutique.
              </p>
              <a href="/shop" className="px-8 py-3.5 bg-[#111111] text-white text-xs font-semibold rounded-full hover:bg-black transition-colors">
                Return to Shop Catalog
              </a>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
