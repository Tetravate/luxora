import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw, Tag } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Cart() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, coupon, applyCoupon, removeCoupon } = useStore();
  const [couponInput, setCouponInput] = useState('');

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  return (
    <div className="py-12 bg-[#F7F5F1]/50 min-h-[80vh]">
      <div className="luxora-container">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#E7E3DC] gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111]">
              Shopping Bag
            </h1>
            <p className="text-sm text-[#777777] mt-1">
              Review your selected luxury items before finalizing your order
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-[#777777] hover:text-rose-600 transition-colors flex items-center gap-1 self-start sm:self-auto"
            >
              <Trash2 size={14} /> Clear all items
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E7E3DC] p-12 text-center max-w-xl mx-auto shadow-sm my-8">
            <div className="w-20 h-20 bg-[#F7F5F1] rounded-full flex items-center justify-center mx-auto mb-5 text-[#777777]">
              <ShoppingBag size={36} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#111111] mb-2">
              Your shopping bag is currently empty
            </h2>
            <p className="text-sm text-[#777777] mb-8 max-w-md mx-auto">
              You haven't added any pieces to your bag yet. Explore our latest arrivals or seasonal collections.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link 
                to="/shop"
                className="px-8 py-3.5 bg-[#111111] text-white text-sm font-semibold rounded-full hover:bg-black transition-colors"
              >
                Browse All Products
              </Link>
              <Link 
                to="/shop"
                className="px-8 py-3.5 bg-white border border-[#E7E3DC] text-[#111111] text-sm font-semibold rounded-full hover:bg-[#F7F5F1] transition-colors"
              >
                Discover New In
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Bag Items List (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {cart.map((item) => (
                <div 
                  key={item.cartItemId} 
                  className="bg-white rounded-2xl p-5 border border-[#E7E3DC] flex flex-col sm:flex-row gap-5 items-start sm:items-center shadow-xs"
                >
                  <Link to={`/shop/${item.slug}`} className="w-24 h-28 rounded-xl overflow-hidden bg-[#F7F5F1] flex-shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs uppercase tracking-wider text-[#777777] font-semibold">{item.brand}</span>
                    <Link to={`/shop/${item.slug}`} className="block font-medium text-base text-[#111111] hover:underline truncate mt-0.5">
                      {item.name}
                    </Link>
                    
                    <div className="flex flex-wrap gap-3 text-xs text-[#777777] mt-1.5 mb-3">
                      {item.selectedColor && <span>Color: <strong className="text-[#111111]">{item.selectedColor}</strong></span>}
                      {item.selectedSize && <span>Size: <strong className="text-[#111111]">{item.selectedSize}</strong></span>}
                      <span>Unit: ${item.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[#E7E3DC] rounded-xl bg-[#F7F5F1]">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-3 py-1.5 text-[#777777] hover:text-[#111111] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#111111]">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-3 py-1.5 text-[#777777] hover:text-[#111111] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-xs text-[#777777] hover:text-rose-600 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="sm:text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E7E3DC] flex sm:flex-col justify-between items-center sm:items-end">
                    <span className="text-xs text-[#777777] sm:hidden">Total:</span>
                    <span className="text-lg font-bold text-[#111111]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Service Commitments */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-white p-4 rounded-xl border border-[#E7E3DC] flex items-center gap-3">
                  <Truck size={20} className="text-[#111111] flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-[#111111]">Free Worldwide Shipping</p>
                    <p className="text-[#777777]">On orders over $100</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E7E3DC] flex items-center gap-3">
                  <RotateCcw size={20} className="text-[#111111] flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-[#111111]">30-Day Returns</p>
                    <p className="text-[#777777]">Hassle-free guarantee</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E7E3DC] flex items-center gap-3">
                  <ShieldCheck size={20} className="text-[#111111] flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-[#111111]">Secure Payment</p>
                    <p className="text-[#777777]">Encrypted checkout</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary & Coupon (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-[#E7E3DC] p-6 shadow-sm sticky top-28">
                <h3 className="text-lg font-serif font-bold text-[#111111] pb-4 mb-4 border-b border-[#E7E3DC]">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyCoupon} className="mb-6">
                  <label htmlFor="promo" className="block text-xs font-semibold text-[#777777] uppercase tracking-wider mb-2">
                    Promotional Code
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
                      <input 
                        id="promo"
                        type="text" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. LUXORA10" 
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F7F5F1] rounded-xl border border-[#E7E3DC] uppercase focus:outline-none focus:bg-white"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-4 py-2.5 bg-[#111111] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {coupon && (
                    <div className="mt-2.5 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-800">
                        Code {coupon.code} active ({coupon.discountPercent}% off)
                      </span>
                      <button 
                        type="button" 
                        onClick={removeCoupon}
                        className="text-xs text-emerald-700 hover:text-emerald-900 underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <p className="text-[11px] text-[#777777] mt-1.5">Try code: <span className="font-semibold text-[#111111]">LUXORA10</span> for 10% off</p>
                </form>

                {/* Subtotals & Breakdown */}
                <div className="space-y-3 pb-4 mb-4 border-b border-[#E7E3DC] text-sm">
                  <div className="flex justify-between text-[#777777]">
                    <span>Subtotal</span>
                    <span className="text-[#111111] font-medium">${subtotal.toFixed(2)}</span>
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
                  <div className="flex justify-between text-[#777777]">
                    <span>Estimated Taxes</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-base font-bold text-[#111111]">Total Amount</span>
                  <span className="text-2xl font-bold text-[#111111]">${total.toFixed(2)}</span>
                </div>

                <Link
                  to="/checkout"
                  className="w-full py-4 bg-[#111111] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md hover:shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </Link>

                <div className="mt-4 text-center">
                  <Link to="/shop" className="text-xs text-[#777777] hover:text-[#111111] underline">
                    &larr; Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
