import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  PackageSearch,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { useStore } from '../../store/useStore';

const StatCard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-[#E7E3DC] shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-[#F7F5F1] text-[#111111]">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {change}
      </div>
    </div>
    <h3 className="text-[#777777] text-sm font-medium">{title}</h3>
    <p className="text-3xl font-serif font-bold text-[#111111] mt-1">{value}</p>
  </div>
);

export function Dashboard() {
  const { products, customers } = useAdminStore();
  const { orders } = useStore();

  const totalRevenue = orders.reduce((sum, order) => sum + (order.paymentStatus === 'Paid' ? order.total : 0), 0);
  const activeProducts = products.filter(p => p.stock > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#111111]">Dashboard Overview</h1>
        <p className="text-[#777777] mt-1">Welcome back, here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          change="+12.5%" 
          isPositive={true} 
          icon={DollarSign} 
        />
        <StatCard 
          title="Total Orders" 
          value={orders.length.toLocaleString()} 
          change="+8.2%" 
          isPositive={true} 
          icon={ShoppingBag} 
        />
        <StatCard 
          title="Total Customers" 
          value={customers.length.toLocaleString()} 
          change="+2.4%" 
          isPositive={true} 
          icon={Users} 
        />
        <StatCard 
          title="Active Products" 
          value={activeProducts.toLocaleString()} 
          change="-1.2%" 
          isPositive={false} 
          icon={PackageSearch} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder for chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E3DC] shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-serif font-bold text-[#111111]">Revenue Analytics</h2>
            <select className="bg-[#F7F5F1] border border-[#E7E3DC] rounded-lg px-3 py-1.5 text-sm outline-none">
              <option>All Time</option>
              <option>Last 7 Days</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex-1 bg-[#F7F5F1] rounded-xl flex items-center justify-center border border-dashed border-[#E7E3DC]">
            <p className="text-[#777777] font-medium">Chart Visualization (Integrated with store data)</p>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-6 rounded-2xl border border-[#E7E3DC] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-serif font-bold text-[#111111]">Recent Orders</h2>
            <button className="text-sm font-semibold text-[#111111] hover:underline">View All</button>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between pb-4 border-b border-[#E7E3DC] last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F7F5F1] flex items-center justify-center text-[#111111] font-semibold text-xs">
                    {order.id.split('-')[1]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111111] truncate max-w-[120px]">{order.customerName}</p>
                    <p className="text-xs text-[#777777]">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#111111]">${order.total.toFixed(2)}</p>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-center text-[#777777] py-4">No recent orders.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
