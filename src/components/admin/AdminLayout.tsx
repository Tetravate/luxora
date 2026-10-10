import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Archive, 
  TicketPercent, 
  Star, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu
} from 'lucide-react';

const AdminSidebarItem = ({ icon: Icon, label, to }: { icon: any, label: string, to: string }) => (
  <NavLink
    to={to}
    end={to === '/admin/dashboard'}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        isActive 
          ? 'bg-[#111111] text-white' 
          : 'text-[#777777] hover:bg-[#F7F5F1] hover:text-[#111111]'
      }`
    }
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </NavLink>
);

export function AdminLayout() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F1] flex flex-col md:flex-row">
      {/* Mobile Header Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E7E3DC] transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-[#E7E3DC]">
          <h1 className="text-2xl font-serif font-bold text-[#111111] tracking-tight">Tetravate</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#777777] mt-1 font-semibold">Admin Portal</p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto h-[calc(100vh-80px-80px)]">
          <nav className="space-y-1">
            <AdminSidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <AdminSidebarItem to="/admin/products" icon={Package} label="Products" />
            <AdminSidebarItem to="/admin/categories" icon={Tags} label="Categories" />
            <AdminSidebarItem to="/admin/orders" icon={ShoppingCart} label="Orders" />
            <AdminSidebarItem to="/admin/customers" icon={Users} label="Customers" />
            <AdminSidebarItem to="/admin/inventory" icon={Archive} label="Inventory" />
            <AdminSidebarItem to="/admin/discounts" icon={TicketPercent} label="Discounts" />
            <AdminSidebarItem to="/admin/reviews" icon={Star} label="Reviews" />
            <AdminSidebarItem to="/admin/analytics" icon={BarChart3} label="Analytics" />
            <AdminSidebarItem to="/admin/settings" icon={Settings} label="Settings" />
          </nav>
        </div>

        <div className="p-4 border-t border-[#E7E3DC] absolute bottom-0 w-full bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E7E3DC] h-16 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[#111111]"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center bg-[#F7F5F1] rounded-full px-4 py-2 border border-[#E7E3DC]">
              <Search size={16} className="text-[#777777] mr-2" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none focus:outline-none text-sm w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[#777777] hover:text-[#111111] transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-[#E7E3DC]"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#111111]">{user?.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
