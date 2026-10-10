import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/useAdminStore';
import { cn } from '../lib/utils';
import { useState, useMemo } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const { reviews } = useAdminStore();
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const { displayRating, displayReviewCount } = useMemo(() => {
    const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'Approved');
    const count = productReviews.length;
    const avg = count > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    return { displayRating: avg.toFixed(1), displayReviewCount: count };
  }, [reviews, product.id]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.colors?.[0], product.sizes?.[0]);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E7E3DC] hover:border-[#111111]/30 hover:shadow-lg transition-all duration-300">
      
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F5F1]">
        <Link to={`/shop/${product.slug}`} className="block w-full h-full">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.newArrival && (
            <span className="bg-[#111111] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
              New
            </span>
          )}
          {product.discount && (
            <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
              -{product.discount}%
            </span>
          )}
          {product.bestSeller && !product.newArrival && (
            <span className="bg-[#F1EDE5] text-[#111111] border border-[#E7E3DC] text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded-full">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-xs rounded-full shadow-md text-[#111111] hover:bg-white hover:text-rose-600 transition-all z-10"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart 
            size={18} 
            className={cn(
              "transition-colors",
              isWishlisted ? "fill-rose-600 text-rose-600" : "text-[#111111]"
            )} 
          />
        </button>

        {/* Add to Cart - Slide up on hover desktop, always accessible */}
        <div className="absolute bottom-3 left-3 right-3 z-10 transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0">
          <button 
            onClick={handleQuickAdd}
            className={cn(
              "w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all",
              isAddedRecently 
                ? "bg-emerald-700 text-white" 
                : "bg-[#111111] text-white hover:bg-black"
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAddedRecently ? (
              <>
                <Check size={14} />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details Information */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1 text-xs text-[#777777]">
          <span className="uppercase tracking-wider font-semibold truncate max-w-[150px]">{product.brand}</span>
          <div className="flex items-center gap-1 font-medium text-[#111111]">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>{displayRating}</span>
            <span className="text-[#777777]">({displayReviewCount})</span>
          </div>
        </div>
        
        <Link 
          to={`/shop/${product.slug}`} 
          className="font-medium text-sm text-[#111111] hover:underline line-clamp-1 mb-2"
          title={product.name}
        >
          {product.name}
        </Link>
        
        <div className="mt-auto flex items-baseline gap-2 pt-1 border-t border-[#F7F5F1]">
          <span className="font-bold text-base text-[#111111]">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[#777777] line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
