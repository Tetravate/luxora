import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Package, ExternalLink, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

export function AccountOrders() {
  const { products } = useAdminStore();
  const { orders = [], addToCart, user, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders.filter(order => {
    if (order.customerId !== user?.id) return false;
    if (filter !== 'All' && order.status !== filter) return false;
    if (search && !order.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleBuyAgain = (order: any) => {
    let addedCount = 0;
    order.items.forEach((item: any) => {
      const product = products.find(p => p.id === item.productId || p.name === item.name);
      if (product) {
        addToCart(product, item.quantity);
        addedCount++;
      }
    });
    
    if (addedCount === 0) {
      alert("Items are no longer available in the catalog.");
    }
  };

  const handleCancelOrder = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      updateOrderStatus(id, 'Cancelled');
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
      }
    }
  };

  const userOrders = orders.filter(order => order.customerId === user?.id);

  if (userOrders.length === 0) {
    return (
      <div className="text-center py-16 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-[#F7F5F1] rounded-full flex items-center justify-center mx-auto mb-4 text-[#111111]">
          <Package size={32} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#111111] mb-2">No Orders Yet</h2>
        <p className="text-[#777777] text-sm mb-6 max-w-md mx-auto">
          You haven't placed any orders with us yet. Discover our latest collections and start your journey.
        </p>
        <button className="px-8 py-3 bg-[#111111] text-white font-semibold rounded-xl text-sm hover:bg-black transition-colors">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E7E3DC] pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111] mb-1">Order History</h2>
          <p className="text-sm text-[#777777]">View details, track packages, or buy items again.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f ? 'bg-[#111111] text-white' : 'bg-[#F7F5F1] text-[#777777] hover:text-[#111111]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-[#F7F5F1] border border-transparent focus:border-[#E7E3DC] focus:bg-white text-sm outline-none"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-[#F7F5F1]/50 rounded-2xl border border-dashed border-[#E7E3DC]">
            <p className="text-[#777777] text-sm">No orders match your current filters.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="border border-[#E7E3DC] rounded-2xl p-6 hover:shadow-md transition-shadow bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-[#E7E3DC] gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F7F5F1] rounded-xl flex items-center justify-center text-[#111111]">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-1">Order Number</p>
                    <p className="text-lg font-serif font-bold text-[#111111]">{order.id}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  <div className="flex items-center gap-2">
                    {order.status === 'Delivered' && <CheckCircle2 size={16} className="text-emerald-500" />}
                    {order.status === 'Cancelled' && <AlertCircle size={16} className="text-red-500" />}
                    <span className="text-sm font-bold text-[#111111]">{order.status}</span>
                  </div>
                  <p className="text-xs text-[#777777]">Placed on {order.date}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-[#E7E3DC] bg-[#F7F5F1]" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#111111] truncate">{item.name}</h4>
                      <p className="text-xs text-[#777777] mt-1">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-sm font-bold text-[#111111]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-[#E7E3DC]">
                <div className="text-sm">
                  <span className="text-[#777777]">Order Total: </span>
                  <span className="text-lg font-serif font-bold text-[#111111]">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 sm:flex-none px-4 py-2 border border-[#E7E3DC] text-[#111111] text-xs font-bold rounded-xl hover:bg-[#F7F5F1] transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} /> View Details
                  </button>
                  <button 
                    onClick={() => handleBuyAgain(order)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#111111] text-white text-xs font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} /> Buy Again
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-[#E7E3DC] flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-[#111111]">Order {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-[#777777] hover:bg-[#F7F5F1] rounded-full">
                <AlertCircle size={20} className="hidden" />
                <span className="text-xl font-bold leading-none">&times;</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">Order Date</p>
                  <p className="text-sm font-semibold text-[#111111]">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">Status</p>
                  <span className="inline-block bg-[#F7F5F1] text-[#111111] text-xs font-bold px-3 py-1 rounded-full">
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">Total</p>
                  <p className="text-sm font-semibold text-[#111111]">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-[#111111] mb-4">Items Ordered</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 bg-[#F7F5F1] p-4 rounded-xl">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-white" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#111111] truncate">{item.name}</h4>
                        <p className="text-xs text-[#777777]">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-bold text-[#111111]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-[#111111] mb-2">Shipping Address</h3>
                  <div className="bg-[#F7F5F1] p-4 rounded-xl text-sm text-[#777777]">
                    <p className="font-semibold text-[#111111] mb-1">{selectedOrder.shippingAddress?.name || selectedOrder.customerName}</p>
                    <p>{selectedOrder.shippingAddress?.street}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</p>
                    <p>{selectedOrder.shippingAddress?.country}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111111] mb-2">Payment Details</h3>
                  <div className="bg-[#F7F5F1] p-4 rounded-xl text-sm text-[#777777]">
                    <p>Method: <span className="font-semibold text-[#111111]">{selectedOrder.paymentMethod || 'Credit / Debit Card'}</span></p>
                    <p>Status: <span className="font-semibold text-[#111111]">{selectedOrder.paymentStatus}</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-[#E7E3DC] flex justify-end gap-3">
              {(selectedOrder.status === 'Processing' || selectedOrder.status === 'Order Confirmed') && (
                <button 
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  className="px-6 py-2.5 bg-white border border-rose-200 text-rose-600 font-semibold rounded-xl text-sm hover:bg-rose-50 transition-colors"
                >
                  Cancel Order
                </button>
              )}
              <button onClick={() => setSelectedOrder(null)} className="px-6 py-2.5 bg-[#111111] text-white font-semibold rounded-xl text-sm hover:bg-black transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
