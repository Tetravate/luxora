import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  User, Package, MapPin, Heart, LogOut, 
  CreditCard, Bell, Settings, HelpCircle, 
  Menu, X, ChevronRight
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const navItems = [
  { id: 'overview', label: 'Overview', icon: User, path: '/account/overview' },
  { id: 'orders', label: 'Orders', icon: Package, path: '/account/orders' },
  { id: 'wishlist', label: 'Wishlist', icon: Heart, path: '/account/wishlist' },
  { id: 'addresses', label: 'Addresses', icon: MapPin, path: '/account/addresses' },
  { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard, path: '/account/payment-methods' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/account/notifications' },
  { id: 'profile', label: 'Profile', icon: User, path: '/account/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/account/settings' },
  { id: 'support', label: 'Support', icon: HelpCircle, path: '/account/support' },
];

export function AccountLayout() {
  const navigate = useNavigate();
  const { user, logout, notifications = [], wishlist = [] } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || !user.isLoggedIn) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="py-8 sm:py-12 bg-[#F7F5F1]/40 min-h-screen">
      <div className="luxora-container">
        
        {/* Account Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E3DC] mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center text-2xl font-serif font-bold shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-1">My Account</h1>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#111111]">Good morning, {user.name.split(' ')[0]}.</h2>
              <p className="text-sm text-[#777777] mt-1">Manage your orders, profile, preferences and saved items.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/shop')}
              className="px-5 py-2.5 rounded-xl bg-[#F7F5F1] border border-[#E7E3DC] text-sm font-semibold text-[#111111] hover:bg-[#E7E3DC] transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/account/orders')}
              className="px-5 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-black transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden mb-6 relative">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full bg-white border border-[#E7E3DC] rounded-2xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3 font-semibold text-[#111111]">
              <Menu size={20} />
              Account Menu
            </div>
            {mobileMenuOpen ? <X size={20} className="text-[#777777]" /> : <ChevronRight size={20} className="text-[#777777]" />}
          </button>
          
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E7E3DC] shadow-xl z-20 overflow-hidden">
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center justify-between p-4 border-b border-[#E7E3DC] last:border-0
                      ${isActive ? 'bg-[#F7F5F1] text-[#111111]' : 'text-[#777777] hover:bg-[#F7F5F1] hover:text-[#111111]'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="font-semibold text-sm">{item.label}</span>
                    </div>
                    {item.id === 'notifications' && unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                    )}
                    {item.id === 'wishlist' && wishlist.length > 0 && (
                      <span className="bg-[#111111] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{wishlist.length}</span>
                    )}
                  </NavLink>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 font-semibold text-sm text-left"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-4 rounded-3xl border border-[#E7E3DC] shadow-sm">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all
                    ${isActive ? 'bg-[#111111] text-white shadow-md' : 'text-[#777777] hover:bg-[#F7F5F1] hover:text-[#111111]'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'notifications' && unreadCount > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${false ? 'bg-white text-[#111111]' : 'bg-red-500 text-white'}`}>
                      {unreadCount}
                    </span>
                  )}
                  {item.id === 'wishlist' && wishlist.length > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${false ? 'bg-white text-[#111111]' : 'bg-[#E7E3DC] text-[#111111]'}`}>
                      {wishlist.length}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-[#E7E3DC]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E3DC] shadow-sm min-h-[500px]">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}
