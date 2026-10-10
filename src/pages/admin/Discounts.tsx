
import { Plus, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

export function Discounts() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdminStore();


  const handleCreate = () => {
    addCoupon({
      id: `c-${Date.now()}`,
      code: 'NEWCODE',
      type: 'percentage',
      value: 10,
      minOrder: 0,
      active: true,
      usageLimit: null,
      used: 0,
    });
  };

  const toggleActive = (id: string, active: boolean) => {
    updateCoupon(id, { active: !active });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#111111]">Discounts</h1>
          <p className="text-[#777777] mt-1 text-sm">Manage coupons and promotional offers.</p>
        </div>
        <button onClick={handleCreate} className="bg-[#111111] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F5F1] border-b border-[#E7E3DC]">
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Code</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Discount</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Usage</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-[#777777] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DC]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#F7F5F1]/50">
                  <td className="p-4">
                    <span className="font-bold text-[#111111]">{c.code}</span>
                  </td>
                  <td className="p-4 text-sm font-medium">
                    {c.type === 'percentage' ? `${c.value}%` : `$${c.value}`} 
                    <span className="text-xs text-[#777777] font-normal block">Min order: ${c.minOrder}</span>
                  </td>
                  <td className="p-4 text-sm">
                    {c.used} {c.usageLimit ? `/ ${c.usageLimit}` : 'uses'}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleActive(c.id, c.active)}
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => deleteCoupon(c.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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
