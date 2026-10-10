import { useAdminStore } from '../../store/useAdminStore';

export function Settings() {
  const { settings, updateSettings } = useAdminStore();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#111111]">Settings</h1>
        <p className="text-[#777777] mt-1 text-sm">Configure store preferences and operational defaults.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E3DC] shadow-sm p-6">
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold mb-2">Store Name</label>
              <input type="text" value={settings.storeName} onChange={e => updateSettings({ storeName: e.target.value })} className="w-full px-4 py-2 bg-[#F7F5F1] rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2">Contact Email</label>
              <input type="email" value={settings.contactEmail} onChange={e => updateSettings({ contactEmail: e.target.value })} className="w-full px-4 py-2 bg-[#F7F5F1] rounded-xl text-sm" />
            </div>
          </div>
          
          <h3 className="text-sm font-bold pt-4 border-t border-[#E7E3DC]">Shipping & Taxes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold mb-2">Flat Rate Shipping ($)</label>
              <input type="number" value={settings.shippingFlatRate} onChange={e => updateSettings({ shippingFlatRate: parseFloat(e.target.value) })} className="w-full px-4 py-2 bg-[#F7F5F1] rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2">Free Shipping Threshold</label>
              <input type="number" value={settings.freeShippingThreshold} onChange={e => updateSettings({ freeShippingThreshold: parseFloat(e.target.value) })} className="w-full px-4 py-2 bg-[#F7F5F1] rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2">Tax Rate (%)</label>
              <input type="number" value={settings.taxRate} onChange={e => updateSettings({ taxRate: parseFloat(e.target.value) })} className="w-full px-4 py-2 bg-[#F7F5F1] rounded-xl text-sm" />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="bg-[#111111] text-white px-6 py-3 rounded-xl font-semibold text-sm">Save Preferences</button>
          </div>
        </form>
      </div>
    </div>
  );
}
