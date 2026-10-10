import { useStore } from '../../store/useStore';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AccountWishlist() {
  const { wishlist = [], moveToCart, removeFromWishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-16 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-[#F7F5F1] rounded-full flex items-center justify-center mx-auto mb-4 text-[#111111]">
          <Heart size={32} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#111111] mb-2">Your wishlist is waiting.</h2>
        <p className="text-[#777777] text-sm mb-6 max-w-md mx-auto">
          Save items you love to your wishlist and easily move them to your cart when you're ready to buy.
        </p>
        <Link to="/shop" className="inline-block px-8 py-3 bg-[#111111] text-white font-semibold rounded-xl text-sm hover:bg-black transition-colors">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E7E3DC] pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111] mb-1">Your Wishlist</h2>
          <p className="text-sm text-[#777777]">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later.</p>
        </div>
        <button className="px-5 py-2.5 bg-[#F7F5F1] text-[#111111] font-semibold rounded-xl text-sm hover:bg-[#E7E3DC] transition-colors">
          Move All to Cart
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="group flex flex-col bg-white rounded-2xl border border-[#E7E3DC] overflow-hidden hover:shadow-md transition-shadow relative">
            <button 
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors z-10 opacity-0 group-hover:opacity-100"
              title="Remove from wishlist"
            >
              <Trash2 size={16} />
            </button>
            
            <Link to={`/product/${product.id}`} className="aspect-square bg-[#F7F5F1] block overflow-hidden">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </Link>
            
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-sm font-bold text-[#111111] line-clamp-1">{product.name}</h3>
              <p className="text-xs text-[#777777] mt-1 mb-3">{product.brand}</p>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-base font-bold text-[#111111]">${product.price.toFixed(2)}</span>
                <button 
                  onClick={() => moveToCart(product)}
                  className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center hover:bg-black transition-transform active:scale-95"
                  title="Add to Cart"
                >
                  <ShoppingBag size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
