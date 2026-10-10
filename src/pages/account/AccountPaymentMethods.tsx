import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CreditCard, Trash2, Plus } from 'lucide-react';

export function AccountPaymentMethods() {
  const { paymentMethods = [], addPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } = useStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const cardNum = formData.get('cardNumber') as string;
    
    addPaymentMethod({
      id: `pm-${Date.now()}`,
      type: 'Visa', // Hardcoded for demo
      last4: cardNum.slice(-4) || '1234',
      expiry: formData.get('expiry') as string,
      isDefault: formData.get('isDefault') === 'on'
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E7E3DC] pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111] mb-1">Payment Methods</h2>
          <p className="text-sm text-[#777777]">Manage your saved cards and payment options.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#111111] text-white font-semibold rounded-xl text-sm hover:bg-black transition-colors"
          >
            <Plus size={16} /> Add Payment Method
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-[#F7F5F1]/50 p-6 rounded-2xl border border-[#E7E3DC] space-y-4 mb-8">
          <h3 className="text-lg font-bold text-[#111111] mb-4">Add Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">Card Number</label>
              <input required name="cardNumber" type="text" placeholder="**** **** **** ****" maxLength={19} className="w-full px-4 py-2.5 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">Expiry Date</label>
              <input required name="expiry" type="text" placeholder="MM/YY" maxLength={5} className="w-full px-4 py-2.5 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#777777] mb-1 uppercase tracking-wider">CVV</label>
              <input required name="cvv" type="text" placeholder="***" maxLength={4} className="w-full px-4 py-2.5 rounded-xl border border-[#E7E3DC] outline-none focus:border-[#111111] text-sm" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-2 mt-2">
              <input type="checkbox" name="isDefault" id="isDefault" className="w-4 h-4 rounded border-[#E7E3DC] text-[#111111] focus:ring-[#111111]" />
              <label htmlFor="isDefault" className="text-sm font-semibold text-[#111111]">Set as default payment method</label>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-[#E7E3DC] mt-6">
            <button type="submit" className="px-6 py-2.5 bg-[#111111] text-white font-semibold rounded-xl text-sm hover:bg-black transition-colors">
              Save Card
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 bg-white border border-[#E7E3DC] text-[#111111] font-semibold rounded-xl text-sm hover:bg-[#F7F5F1] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {paymentMethods.length === 0 && !isAdding ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-[#F7F5F1] rounded-full flex items-center justify-center mx-auto mb-4 text-[#111111]">
            <CreditCard size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#111111] mb-2">No payment methods saved.</h2>
          <p className="text-[#777777] text-sm">Add a card for faster checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map(pm => (
            <div key={pm.id} className={`p-6 rounded-2xl border ${pm.isDefault ? 'border-[#111111] bg-[#F7F5F1]/30' : 'border-[#E7E3DC] bg-white'} relative transition-colors`}>
              {pm.isDefault && (
                <span className="absolute top-4 right-4 bg-[#111111] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Default
                </span>
              )}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-8 bg-white border border-[#E7E3DC] rounded flex items-center justify-center font-bold text-[#111111] text-[10px]">
                  {pm.type}
                </div>
                <div>
                  <h3 className="font-bold text-[#111111]">•••• {pm.last4}</h3>
                  <p className="text-xs text-[#777777]">Expires {pm.expiry}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-[#E7E3DC]">
                <button 
                  onClick={() => deletePaymentMethod(pm.id)}
                  className="text-red-500 text-sm font-semibold flex items-center gap-1 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} /> Remove
                </button>
                {!pm.isDefault && (
                  <button 
                    onClick={() => setDefaultPaymentMethod(pm.id)}
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
