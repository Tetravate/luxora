import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Lock, CheckCircle2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Checkout() {
  const { cart, clearCart, coupon, applyCoupon, removeCoupon, addToast, user, addresses, selectedAddressId, guestZipCode, addOrder } = useStore();
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [promoInput, setPromoInput] = useState('');

  // Form Fields
  const selectedAddr = addresses.find(a => a.id === selectedAddressId);
  const isDefaultSelected = !!selectedAddr;

  // Form Fields
  const [email, setEmail] = useState(user?.email || 'eleanor.vance@luxora.com');
  const [firstName, setFirstName] = useState(isDefaultSelected ? selectedAddr.name.split(' ')[0] : 'Eleanor');
  const [lastName, setLastName] = useState(isDefaultSelected ? selectedAddr.name.split(' ').slice(1).join(' ') : 'Vance');
  const [address, setAddress] = useState(isDefaultSelected ? selectedAddr.street : '742 Evergreen Terrace');
  const [city, setCity] = useState(isDefaultSelected ? selectedAddr.city : 'San Francisco');
  const [state, setState] = useState(isDefaultSelected ? selectedAddr.state : 'CA');
  const [zip, setZip] = useState(isDefaultSelected ? selectedAddr.postalCode : (guestZipCode || '94102'));
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      const generatedOrder = `LX-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      
      // Construct the order
      const newOrder = {
        id: generatedOrder,
        customerId: user?.id || 'guest',
        customerName: `${firstName} ${lastName}`.trim(),
        customerEmail: email,
        date: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
        total: total,
        status: 'Processing' as const,
        paymentStatus: 'Paid' as const,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.images[0]
        })),
        shippingAddress: {
          id: `addr-${Date.now()}`,
          name: `${firstName} ${lastName}`.trim(),
          phone: '', // Optional in checkout form currently
          street: address,
          city: city,
          state: state,
          postalCode: zip,
          country: 'United States'
        },
        paymentMethod: 'Credit / Debit Card'
      };
      
      addOrder(newOrder);

      setIsSubmitted(true);
      setIsProcessing(false);
      addToast(`Order ${generatedOrder} confirmed!`, 'success');
      clearCart();
    }, 1500);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyCoupon(promoInput.trim());
      setPromoInput('');
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-20 min-h-[80vh] bg-[#F7F5F1] flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-[#E7E3DC]">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-3 inline-block">
            Payment Verified
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#111111] mb-3">Order Confirmed!</h2>
          <p className="text-sm text-[#777777] mb-6 leading-relaxed">
            Thank you for shopping with Luxora. A confirmation receipt and live courier tracking link have been dispatched to <strong>{email}</strong>.
          </p>
          <div className="p-4 bg-[#F7F5F1] rounded-2xl mb-8 border border-[#E7E3DC]">
            <p className="text-xs uppercase tracking-wider text-[#777777] mb-1">Confirmation Order Number</p>
            <p className="text-lg font-bold text-[#111111]">{orderNumber}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link 
              to="/account" 
              className="w-full py-3.5 bg-[#111111] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors"
            >
              View Order in My Account
            </Link>
            <Link 
              to="/shop" 
              className="w-full py-3.5 border border-[#E7E3DC] text-[#111111] text-xs font-semibold rounded-xl hover:bg-[#F7F5F1] transition-colors"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[#F7F5F1] rounded-full flex items-center justify-center mb-4 text-[#777777]">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2 text-[#111111]">Your bag is currently empty</h2>
        <p className="text-sm text-[#777777] mb-6 max-w-sm">
          Please add items to your shopping bag before proceeding to the checkout portal.
        </p>
        <Link to="/shop" className="px-8 py-3.5 bg-[#111111] text-white text-xs font-semibold rounded-full hover:bg-black transition-colors">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#F7F5F1]/40 min-h-screen">
      <div className="luxora-container">
        
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center text-xs font-semibold text-[#777777] hover:text-[#111111] transition-colors">
            <ChevronLeft size={16} className="mr-1" /> Return to Bag
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Checkout Steps Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Contact Information */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E3DC] shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E7E3DC]">
                  <h2 className="text-base font-serif font-bold text-[#111111]">
                    1. Contact Details
                  </h2>
                  <span className="text-xs text-[#777777]">Step 1 of 3</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-[#111111] mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Destination */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E3DC] shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E7E3DC]">
                  <h2 className="text-base font-serif font-bold text-[#111111]">
                    2. Shipping Address
                  </h2>
                  <span className="text-xs text-[#777777]">Step 2 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-semibold text-[#111111] mb-1">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required 
                      className="w-full px-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-semibold text-[#111111] mb-1">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required 
                      className="w-full px-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-xs font-semibold text-[#111111] mb-1">Street Address</label>
                    <input 
                      type="text" 
                      id="address" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required 
                      className="w-full px-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-xs font-semibold text-[#111111] mb-1">City</label>
                    <input 
                      type="text" 
                      id="city" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required 
                      className="w-full px-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="state" className="block text-xs font-semibold text-[#111111] mb-1">State</label>
                      <input 
                        type="text" 
                        id="state" 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required 
                        className="w-full px-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-xs font-semibold text-[#111111] mb-1">ZIP Code</label>
                      <input 
                        type="text" 
                        id="zip" 
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        required 
                        className="w-full px-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Encryption */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E3DC] shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E7E3DC]">
                  <h2 className="text-base font-serif font-bold text-[#111111]">
                    3. Payment Information
                  </h2>
                  <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                    <ShieldCheck size={14} /> 256-Bit SSL
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border-2 border-[#111111] rounded-2xl bg-[#F7F5F1] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" id="card" checked readOnly className="text-[#111111]" />
                      <label htmlFor="card" className="text-xs font-bold text-[#111111] cursor-pointer">
                        Credit / Debit Card
                      </label>
                    </div>
                    <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                      Visa / Mastercard / Amex
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-[#111111] mb-1">Card Number</label>
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required 
                      className="w-full px-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none font-mono" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        defaultValue="12/28"
                        required 
                        className="w-full px-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">Security Code (CVV)</label>
                      <input 
                        type="text" 
                        defaultValue="842"
                        required 
                        className="w-full px-4 py-3 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Order Button */}
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-4 bg-[#111111] text-white rounded-2xl text-sm font-semibold flex justify-center items-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-wait"
              >
                <Lock size={16} />
                <span>{isProcessing ? 'Processing Payment...' : `Complete Purchase — $${total.toFixed(2)}`}</span>
              </button>

            </form>
          </div>

          {/* Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E3DC] shadow-xs sticky top-28">
              <h3 className="text-base font-serif font-bold text-[#111111] pb-3 mb-4 border-b border-[#E7E3DC]">
                Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.cartItemId} className="flex gap-3 items-center">
                    <img src={item.images[0]} alt={item.name} className="w-14 h-16 rounded-xl object-cover bg-[#F7F5F1] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs text-[#111111] truncate">{item.name}</h4>
                      <p className="text-[11px] text-[#777777]">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="text-xs font-bold text-[#111111] flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyPromo} className="mb-4 pt-3 border-t border-[#E7E3DC]">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Coupon code (LUXORA10)"
                    className="flex-1 px-3 py-2 bg-[#F7F5F1] border border-[#E7E3DC] rounded-xl text-xs uppercase focus:outline-none"
                  />
                  <button type="submit" className="px-3 py-2 bg-[#111111] text-white text-xs font-semibold rounded-xl hover:bg-black">
                    Apply
                  </button>
                </div>
                {coupon && (
                  <div className="mt-2 text-xs text-emerald-700 flex justify-between">
                    <span>{coupon.code} active (-{coupon.discountPercent}%)</span>
                    <button type="button" onClick={removeCoupon} className="underline">Remove</button>
                  </div>
                )}
              </form>

              {/* Calculations */}
              <div className="space-y-2.5 pt-3 border-t border-[#E7E3DC] text-xs">
                <div className="flex justify-between text-[#777777]">
                  <span>Subtotal</span>
                  <span className="text-[#111111] font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#777777]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-700">Free</strong> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="border-t border-[#E7E3DC] pt-3 flex justify-between font-bold text-base text-[#111111]">
                  <span>Total Due</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
