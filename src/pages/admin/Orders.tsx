import { useState, useMemo } from 'react';
import { Search, Eye, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Order } from '../../types';

export function Orders() {
  const { orders, updateOrderStatus, updateOrderPayment } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                            o.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, filterStatus]);

  const handleStatusChange = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status);
  };

  const handlePaymentChange = (id: string, payment: Order['paymentStatus']) => {
    updateOrderPayment(id, payment);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#111111]">Orders</h1>
          <p className="text-[#777777] mt-1 text-sm">View and manage customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E7E3DC] flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search by ID or customer..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F5F1] border border-transparent focus:border-[#E7E3DC] rounded-xl text-sm outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-[#E7E3DC] rounded-xl text-sm font-medium text-[#111111] hover:bg-[#F7F5F1] transition-colors outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F7F5F1] border-b border-[#E7E3DC]">
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Order ID</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Total</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Payment</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DC]">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F7F5F1]/50 transition-colors">
                  <td className="p-4 font-semibold text-[#111111]">{order.id}</td>
                  <td className="p-4 text-sm text-[#111111]">{order.customerName}</td>
                  <td className="p-4 text-sm text-[#777777]">{order.date}</td>
                  <td className="p-4 text-sm font-medium text-[#111111]">${order.total.toFixed(2)} <span className="text-xs text-[#777777] font-normal">({order.items.length} items)</span></td>
                  <td className="p-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className={`text-xs font-bold uppercase tracking-wider rounded-full px-2 py-1 outline-none cursor-pointer border-none
                        ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${order.status === 'Processing' ? 'bg-amber-100 text-amber-700' : ''}
                        ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : ''}
                        ${order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}
                        ${order.status === 'Returned' ? 'bg-gray-100 text-gray-700' : ''}
                      `}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handlePaymentChange(order.id, e.target.value as Order['paymentStatus'])}
                      className={`text-xs font-semibold bg-transparent outline-none cursor-pointer border-none
                        ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : ''}
                        ${order.paymentStatus === 'Refunded' ? 'text-red-600' : ''}
                        ${order.paymentStatus === 'Pending' ? 'text-amber-600' : ''}
                      `}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-[#777777] hover:text-[#111111] hover:bg-[#E7E3DC] rounded-lg transition-colors" 
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#777777]">No orders found matching filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-[#E7E3DC] flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-[#111111]">Order {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-[#777777] hover:bg-[#F7F5F1] rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-grow overflow-y-auto space-y-8">
              {/* Summary */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-4">Summary</h3>
                <div className="bg-[#F7F5F1] p-4 rounded-xl space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Customer</span>
                    <span className="font-semibold text-[#111111]">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Date</span>
                    <span className="font-semibold text-[#111111]">{selectedOrder.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777777]">Items</span>
                    <span className="font-semibold text-[#111111]">{selectedOrder.items.length}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#E7E3DC]">
                    <span className="font-bold text-[#111111]">Total Amount</span>
                    <span className="font-bold text-[#111111]">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#777777] mb-4">Manage Order</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-2">Fulfillment Status</label>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => {
                        handleStatusChange(selectedOrder.id, e.target.value as Order['status']);
                        setSelectedOrder({...selectedOrder, status: e.target.value as Order['status']});
                      }}
                      className="w-full px-4 py-2 bg-white border border-[#E7E3DC] rounded-xl text-sm"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-2">Payment Status</label>
                    <select 
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => {
                        handlePaymentChange(selectedOrder.id, e.target.value as Order['paymentStatus']);
                        setSelectedOrder({...selectedOrder, paymentStatus: e.target.value as Order['paymentStatus']});
                      }}
                      className="w-full px-4 py-2 bg-white border border-[#E7E3DC] rounded-xl text-sm"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t border-[#E7E3DC]">
              <button onClick={() => setSelectedOrder(null)} className="w-full py-3 bg-[#111111] text-white rounded-xl font-semibold text-sm">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
