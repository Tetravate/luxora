import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Package, Heart, MapPin, Award, ChevronRight, Clock } from 'lucide-react';


export function AccountOverview() {
  const navigate = useNavigate();
  const { orders = [], wishlist = [], addresses = [], recentlyViewed = [], user } = useStore();

  const userOrders = orders.filter(order => order.customerId === user?.id);
  const latestOrder = userOrders.length > 0 ? userOrders[0] : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#111111] mb-2">Account Overview</h2>
        <p className="text-sm text-[#777777]">Here's what's happening with your Tetravate account.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Orders', value: userOrders.length, icon: Package, path: '/account/orders' },
          { label: 'Wishlist', value: wishlist.length, icon: Heart, path: '/account/wishlist' },
          { label: 'Addresses', value: addresses.length, icon: MapPin, path: '/account/addresses' },
          { label: 'Rewards', value: '1,250', icon: Award, path: '/account/overview', highlight: true },
        ].map((stat, idx) => (
          <div 
            key={idx}
            onClick={() => navigate(stat.path)}
            className="p-5 rounded-2xl border border-[#E7E3DC] bg-[#F7F5F1]/50 hover:bg-[#F7F5F1] transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.highlight ? 'text-amber-600' : 'text-[#111111]'} />
              <ChevronRight size={16} className="text-[#777777] group-hover:text-[#111111] transition-colors" />
            </div>
            <p className={`text-2xl font-serif font-bold mb-1 ${stat.highlight ? 'text-amber-600' : 'text-[#111111]'}`}>{stat.value}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#777777]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Active Order Widget */}
      {latestOrder && (
        <div className="border border-[#E7E3DC] rounded-2xl p-6 relative overflow-hidden group hover:border-[#111111] transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#111111]" />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-1">Your Latest Order</h3>
              <p className="text-lg font-serif font-bold text-[#111111]">{latestOrder.id}</p>
            </div>
            <span className="bg-[#F7F5F1] text-[#111111] text-xs font-bold px-3 py-1 rounded-full">
              {latestOrder.status}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex -space-x-4">
              {latestOrder.items.slice(0, 3).map((item, idx) => (
                <img 
                  key={idx} 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 rounded-full border-2 border-white object-cover bg-[#F7F5F1] shadow-sm"
                />
              ))}
              {latestOrder.items.length > 3 && (
                <div className="w-16 h-16 rounded-full border-2 border-white bg-[#F7F5F1] flex items-center justify-center text-xs font-bold text-[#111111] shadow-sm">
                  +{latestOrder.items.length - 3}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between w-full max-w-md relative before:absolute before:top-1/2 before:-translate-y-1/2 before:w-full before:h-0.5 before:bg-[#E7E3DC] before:-z-10">
                {['Order Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                  const statusMap: Record<string, number> = { 'Order Confirmed': 0, 'Processing': 1, 'Shipped': 2, 'Out for Delivery': 3, 'Delivered': 4 };
                  const currentIdx = statusMap[latestOrder.status] || 0;
                  const isActive = idx <= currentIdx;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-[#111111] ring-4 ring-[#111111]/20' : 'bg-[#E7E3DC]'}`} />
                      <span className={`text-[10px] font-bold hidden sm:block ${isActive ? 'text-[#111111]' : 'text-[#777777]'}`}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              <button 
                onClick={() => navigate('/account/orders')}
                className="px-6 py-2.5 bg-[#111111] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors text-center"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-bold text-[#111111] flex items-center gap-2">
              <Clock size={18} className="text-[#777777]" />
              Recently Viewed
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.slice(0, 4).map(product => (
              <div 
                key={product.id} 
                onClick={() => navigate(`/product/${product.id}`)}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-[#F7F5F1] rounded-2xl mb-3 overflow-hidden border border-[#E7E3DC]">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="text-xs font-bold text-[#111111] truncate">{product.name}</h4>
                <p className="text-[11px] text-[#777777]">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
