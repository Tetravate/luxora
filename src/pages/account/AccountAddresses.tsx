import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';

export function AccountAddresses() {
  const { addresses = [], addAddress, updateAddress, deleteAddress, setDefaultAddress } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const addressData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      street: formData.get('street') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      isDefault: formData.get('isDefault') === 'on'
    };

    if (editingId) {
      updateAddress(editingId, addressData);
      setEditingId(null);
    } else {
      addAddress({
        id: `addr-${Date.now()}`,
        ...addressData
      });
      setIsAdding(false);
    }
  };

  const handleEditClick = (address: any) => {
    setEditForm(address);
    setEditingId(address.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E7E3DC] pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111] mb-1">Saved Addresses</h2>
          <p className="text-sm text-[#777777]">Manage your shipping and billing addresses.</p>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={() => {
              setEditForm(null);
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#111111] text-white font-semibold rounded-xl text-sm hover:bg-black transition-colors"
          >
            <Plus size={16} /> Add New Address
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="bg-[#F7F5F1]/50 p-6 rounded-2xl border border-[#E7E3DC] space-y-4 mb-8">
          <h3 className="text-lg font-bold text-[#111111] mb-4">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">Full Name</label>
              <input required name="name" type="text" defaultValue={editForm?.name || ''} className="w-full px-4 py-2.5 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">Phone</label>
              <input required name="phone" type="tel" defaultValue={editForm?.phone || ''} className="w-full px-4 py-2.5 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">Street Address</label>
              <input required name="street" type="text" defaultValue={editForm?.street || ''} className="w-full px-4 py-2.5 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">City</label>
              <input required name="city" type="text" defaultValue={editForm?.city || ''} className="w-full px-4 py-2.5 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">State / Province</label>
              <input required name="state" type="text" defaultValue={editForm?.state || ''} className="w-full px-4 py-2.5 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">Postal Code</label>
              <input required name="postalCode" type="text" defaultValue={editForm?.postalCode || ''} className="w-full px-4 py-2.5 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">Country</label>
              <input required name="country" type="text" defaultValue={editForm?.country || ''} className="w-full px-4 py-2.5 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2 mt-2">
              <input type="checkbox" name="isDefault" id="isDefault" defaultChecked={editForm?.isDefault || false} className="w-4 h-4 rounded border-[#E7E3DC] text-[#111111] focus:ring-[#111111]" />
              <label htmlFor="isDefault" className="text-sm font-semibold text-[#111111]">Set as default shipping address</label>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[#E7E3DC] mt-6">
            <button type="submit" className="px-6 py-2.5 bg-[#111111] text-white font-semibold rounded-xl text-sm hover:bg-black transition-colors">
              {editingId ? 'Save Changes' : 'Save Address'}
            </button>
            <button type="button" onClick={handleCancel} className="px-6 py-2.5 bg-white border border-[#E7E3DC] text-[#111111] font-semibold rounded-xl text-sm hover:bg-[#F7F5F1] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !isAdding ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#F7F5F1] rounded-full flex items-center justify-center mx-auto mb-4 text-[#111111]">
            <MapPin size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#111111] mb-2">No saved addresses.</h2>
          <p className="text-[#777777] text-sm">Add an address to speed up your checkout process.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(address => (
            <div key={address.id} className={`p-6 rounded-2xl border ${address.isDefault ? 'border-[#111111] bg-[#F7F5F1]/30' : 'border-[#E7E3DC] bg-white'} relative group transition-colors`}>
              {address.isDefault && (
                <span className="absolute top-4 right-4 bg-[#111111] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Default
                </span>
              )}
              <h3 className="font-bold text-[#111111] mb-1">{address.name}</h3>
              <p className="text-sm text-[#777777] mb-1">{address.phone}</p>
              <p className="text-sm text-[#777777] leading-relaxed mb-4">
                {address.street}<br />
                {address.city}, {address.state} {address.postalCode}<br />
                {address.country}
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-[#E7E3DC]">
                <button 
                  onClick={() => handleEditClick(address)}
                  className="text-[#111111] text-sm font-semibold flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  onClick={() => deleteAddress(address.id)}
                  className="text-red-500 text-sm font-semibold flex items-center gap-1 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
                {!address.isDefault && (
                  <button 
                    onClick={() => setDefaultAddress(address.id)}
                    className="ml-auto text-[#777777] text-xs font-semibold hover:text-[#111111] transition-colors"
                  >
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
