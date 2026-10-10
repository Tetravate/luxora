import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Wishlist() {
  const { wishlist, removeFromWishlist, moveToCart, clearWishlist } = useStore();

  return (
    <div className="py-12 bg-[#F7F5F1]/40 min-h-[75vh]">
      <div className="luxora-container">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#E7E3DC] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F1EDE5] flex items-center justify-center text-[#111111]">
              <Heart size={20} className="fill-[#111111]" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#111111]">
                My Saved Wishlist
              </h1>
              <p className="text-xs text-[#777777] mt-0.5">
                {wishlist.length} {wishlist.length === 1 ? 'curated item' : 'curated items'}
              </p>
            </div>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearWishlist}
                className="text-xs font-semibold text-[#777777] hover:text-rose-600 transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} /> Clear Wishlist
              </button>
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E7E3DC] p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <div className="w-20 h-20 bg-[#F7F5F1] rounded-full flex items-center justify-center mx-auto mb-5 text-[#777777]">
              <Heart size={36} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#111111] mb-2">
              Your wishlist is currently empty
            </h2>
            <p className="text-sm text-[#777777] mb-8 max-w-sm mx-auto">
              Save items you desire as you browse, and revisit them anytime or move them seamlessly into your bag.
            </p>
            <Link 
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#111111] text-white text-sm font-semibold rounded-full hover:bg-black transition-colors"
            >
              Start Exploring Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E7E3DC] flex flex-col group hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[4/5] bg-[#F7F5F1] overflow-hidden">
                  <Link to={`/shop/${product.slug}`} className="block w-full h-full">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-[#777777] hover:text-rose-600 transition-colors"
                    title="Remove from wishlist"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>

                  {product.discount && (
                    <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[11px] uppercase tracking-wider text-[#777777] font-semibold">{product.brand}</span>
                  <Link to={`/shop/${product.slug}`} className="text-sm font-medium text-[#111111] hover:underline line-clamp-1 mt-0.5 mb-2">
                    {product.name}
                  </Link>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-bold text-base text-[#111111]">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#777777] line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => moveToCart(product)}
                      className="flex-1 py-2.5 px-3 bg-[#111111] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag size={14} />
                      <span>Move to Bag</span>
                    </button>
                    <Link
                      to={`/shop/${product.slug}`}
                      className="py-2.5 px-3 border border-[#E7E3DC] rounded-xl text-xs font-semibold text-[#111111] hover:bg-[#F7F5F1] transition-colors flex items-center justify-center"
                      title="View details"
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
