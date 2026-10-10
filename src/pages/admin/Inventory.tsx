import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

export function Inventory() {
  const { products, updateInventory } = useAdminStore();
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  const handleStockChange = (id: string, newStock: string) => {
    const val = parseInt(newStock, 10);
    if (!isNaN(val) && val >= 0) {
      updateInventory(id, val);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#111111]">Inventory Management</h1>
        <p className="text-[#777777] mt-1 text-sm">Quickly adjust stock levels.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E7E3DC]">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F5F1] rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F5F1] border-b border-[#E7E3DC]">
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Product</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">SKU</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider text-right">Stock Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DC]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#F7F5F1]/50">
                  <td className="p-4">
                    <span className="font-bold text-[#111111]">{p.name}</span>
                  </td>
                  <td className="p-4 text-sm text-[#777777]">LX-{p.id.padStart(4, '0')}</td>
                  <td className="p-4">
                    {p.stock > 10 ? (
                      <span className="text-emerald-600 text-xs font-bold uppercase">In Stock</span>
                    ) : p.stock > 0 ? (
                      <span className="text-amber-600 text-xs font-bold uppercase">Low Stock</span>
                    ) : (
                      <span className="text-red-600 text-xs font-bold uppercase">Out of Stock</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <input 
                      type="number" 
                      value={p.stock} 
                      onChange={(e) => handleStockChange(p.id, e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-[#E7E3DC] rounded text-right font-medium outline-none focus:border-black"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
