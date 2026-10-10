import { useStore } from '../../store/useStore';
import { ShieldAlert, Download, Lock } from 'lucide-react';

export function AccountSettings() {
  const { 
    preferences = { orderUpdates: false, shippingUpdates: false, promotions: false, priceDrops: false }, 
    updatePreferences, 
    addToast 
  } = useStore();

  const handleToggle = (key: keyof typeof preferences) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  const handleAction = (message: string) => {
    addToast(message, 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-[#E7E3DC] pb-6">
        <h2 className="text-2xl font-serif font-bold text-[#111111] mb-1">Account Settings</h2>
        <p className="text-sm text-[#777777]">Manage your preferences and security.</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-[#111111]">Notification Preferences</h3>
        <div className="space-y-3 bg-[#F7F5F1]/30 p-6 rounded-3xl border border-[#E7E3DC]">
          {[
            { id: 'orderUpdates', label: 'Order Updates', desc: 'Get updates on your order status' },
            { id: 'shippingUpdates', label: 'Shipping Updates', desc: 'Get tracking and delivery updates' },
            { id: 'promotions', label: 'Promotions & Offers', desc: 'Receive exclusive deals and news' },
            { id: 'priceDrops', label: 'Price Drops', desc: 'Get notified when wishlist items go on sale' },
          ].map(pref => (
            <div key={pref.id} className="flex items-center justify-between py-3 border-b border-[#E7E3DC] last:border-0 last:pb-0">
              <div>
                <p className="font-bold text-[#111111] text-sm">{pref.label}</p>
                <p className="text-xs text-[#777777]">{pref.desc}</p>
              </div>
              <button 
                onClick={() => handleToggle(pref.id as any)}
                className={`w-12 h-6 rounded-full transition-colors relative ${preferences[pref.id as keyof typeof preferences] ? 'bg-[#111111]' : 'bg-[#E7E3DC]'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${preferences[pref.id as keyof typeof preferences] ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-[#E7E3DC]">
        <h3 className="text-lg font-bold text-[#111111]">Security</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border border-[#E7E3DC] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F7F5F1] rounded-full flex items-center justify-center text-[#111111]">
              <Lock size={18} />
            </div>
            <div>
              <p className="font-bold text-[#111111] text-sm">Password</p>
              <p className="text-xs text-[#777777]">Last changed 3 months ago</p>
            </div>
          </div>
          <button 
            onClick={() => handleAction('A password reset link has been sent to your email.')}
            className="px-5 py-2.5 bg-white border border-[#E7E3DC] text-[#111111] font-semibold rounded-xl text-sm hover:bg-[#F7F5F1] transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-[#E7E3DC]">
        <h3 className="text-lg font-bold text-[#111111]">Data & Privacy</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border border-[#E7E3DC] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F7F5F1] rounded-full flex items-center justify-center text-[#111111]">
              <Download size={18} />
            </div>
            <div>
              <p className="font-bold text-[#111111] text-sm">Download Account Data</p>
              <p className="text-xs text-[#777777]">Get a copy of your personal data</p>
            </div>
          </div>
          <button 
            onClick={() => handleAction('Your data request has been initiated. You will receive an email shortly.')}
            className="px-5 py-2.5 bg-white border border-[#E7E3DC] text-[#111111] font-semibold rounded-xl text-sm hover:bg-[#F7F5F1] transition-colors"
          >
            Request Data
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border border-red-100 bg-red-50/30 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="font-bold text-red-600 text-sm">Delete Account</p>
              <p className="text-xs text-red-500/80">Permanently delete your account and data</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                handleAction('Account deletion request submitted.');
              }
            }}
            className="px-5 py-2.5 bg-white border border-red-200 text-red-600 font-semibold rounded-xl text-sm hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

    </div>
  );
}
