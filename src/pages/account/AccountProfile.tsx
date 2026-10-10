import { useState } from 'react';
import { useStore } from '../../store/useStore';


export function AccountProfile() {
  const { user, updateProfile } = useStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E7E3DC] pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111] mb-1">Personal Profile</h2>
          <p className="text-sm text-[#777777]">Manage your personal information.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 flex flex-col items-center p-6 border border-[#E7E3DC] rounded-3xl bg-[#F7F5F1]/30">
          <div className="w-24 h-24 rounded-full bg-[#111111] text-white flex items-center justify-center text-3xl font-serif font-bold mb-4 shadow-sm">
            {user?.name.charAt(0)}
          </div>
          <button className="text-sm font-semibold text-[#111111] hover:underline mb-1">Change Photo</button>
          <p className="text-[10px] text-[#777777] uppercase tracking-wider">Max 2MB, JPG/PNG</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full md:w-2/3 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">Full Name</label>
              <input 
                required 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm bg-white" 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">Email Address</label>
              <input 
                required 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm bg-white" 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm bg-white" 
              />
            </div>
          </div>
          <div className="pt-4 border-t border-[#E7E3DC] mt-6 flex justify-end">
            <button type="submit" className="px-8 py-3 bg-[#111111] text-white font-semibold rounded-xl text-sm hover:bg-black transition-colors shadow-sm">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
