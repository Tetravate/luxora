import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    coupon 
  } = useStore();

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-xs z-[85] transition-opacity duration-300",
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setCartOpen(false)}
      />

      {/* Slide-out Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-white z-[90] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-[#E7E3DC] bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} className="text-[#111111]" />
            <h2 className="text-lg font-serif font-bold text-[#111111]">
              Shopping Bag
            </h2>
            <span className="text-xs font-semibold bg-[#F7F5F1] text-[#777777] px-2.5 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button 
                onClick={clearCart} 
                className="text-xs text-[#777777] hover:text-rose-600 transition-colors p-1"
                title="Clear all items"
              >
                Clear
              </button>
            )}
            <button 
              onClick={() => setCartOpen(false)} 
              className="p-1.5 -mr-1 text-[#111111] hover:bg-[#F7F5F1] rounded-full transition-colors"
              aria-label="Close cart drawer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Free Shipping Tracker Bar */}
        {cart.length > 0 && (
          <div className="bg-[#F7F5F1] px-5 py-3 border-b border-[#E7E3DC]">
            {subtotal >= 100 ? (
              <p className="text-xs font-semibold text-emerald-800 text-center">
                ✨ You've unlocked Complimentary Express Shipping!
              </p>
            ) : (
              <div>
                <p className="text-xs text-[#171717] text-center mb-1.5">
                  Add <span className="font-bold">${(100 - subtotal).toFixed(2)}</span> more to qualify for <span className="font-semibold">Free Shipping</span>
                </p>
                <div className="w-full bg-[#E7E3DC] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#111111] h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-[#F7F5F1] rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-[#777777]" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#111111] mb-2">Your bag is empty</h3>
              <p className="text-sm text-[#777777] max-w-xs mb-6">
                Explore our curated collections of luxury apparel, timeless decor, and everyday essentials.
              </p>
              <button 
                onClick={() => setCartOpen(false)}
                className="px-6 py-3 bg-[#111111] text-white text-sm font-semibold rounded-full hover:bg-black transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div 
                  key={item.cartItemId} 
                  className="flex gap-4 p-3.5 rounded-2xl bg-white border border-[#E7E3DC] hover:border-[#111111]/30 transition-all"
                >
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#F7F5F1] flex-shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#777777] font-semibold">{item.brand}</p>
                        <h4 className="text-sm font-medium text-[#111111] truncate">{item.name}</h4>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#777777] hover:text-rose-600 transition-colors p-1"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-[#777777] my-1">
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center border border-[#E7E3DC] rounded-lg bg-[#F7F5F1]">
                        <button 
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2.5 py-1 text-[#777777] hover:text-[#111111] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2.5 py-1 text-[#777777] hover:text-[#111111] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      
                      <span className="font-bold text-sm text-[#111111]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations */}
        {cart.length > 0 && (
          <div className="border-t border-[#E7E3DC] bg-white p-5 shadow-lg">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-[#777777]">
                <span>Subtotal</span>
                <span className="text-[#111111] font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({coupon.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#777777]">
                <span>Shipping</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">Free</strong> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-[#E7E3DC] pt-2 flex justify-between font-bold text-base text-[#111111]">
                <span>Estimated Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={() => setCartOpen(false)}
                className="py-3 px-4 border border-[#111111] rounded-xl text-xs font-semibold text-center text-[#111111] hover:bg-[#F7F5F1] transition-colors flex items-center justify-center gap-1.5"
              >
                View Full Bag
              </Link>
              <Link 
                to="/checkout"
                onClick={() => setCartOpen(false)}
                className="py-3 px-4 bg-[#111111] text-white rounded-xl text-xs font-semibold text-center hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Checkout</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
