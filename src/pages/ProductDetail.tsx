import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Share2, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight, 
  Minus, 
  Plus, 
  Check,
  Sparkles
} from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';
import { ProductReviews } from '../components/ProductReviews';

export function ProductDetail() {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const { products } = useAdminStore();
  
  // Find product by slug or ID
  const product = products.find(p => p.slug === slug || p.id === id || p.id === slug);
  const { addToCart, wishlist, toggleWishlist, addToast } = useStore();
  
  const { reviews } = useAdminStore();
  const productReviews = reviews.filter(r => r.productId === product?.id && r.status === 'Approved');
  const displayReviewCount = productReviews.length;
  const displayRating = displayReviewCount > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / displayReviewCount) : 0;
  const displayRatingFixed = displayRating.toFixed(1);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(product?.sizes?.[0] || null);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');

  if (!product) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-serif font-bold mb-3 text-[#111111]">Product Not Found</h2>
        <p className="text-sm text-[#777777] mb-6 max-w-sm">
          The requested luxury piece is no longer in the active catalog or the link has expired.
        </p>
        <Link to="/shop" className="px-8 py-3.5 bg-[#111111] text-white text-xs font-semibold rounded-full hover:bg-black transition-colors">
          Return to Shop Directory
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some(item => item.id === product.id);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor || undefined, selectedSize || undefined);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor || undefined, selectedSize || undefined);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    } else {
      addToast('Link copied: ' + window.location.href, 'info');
    }
  };

  return (
    <div className="py-8 bg-white">
      <div className="luxora-container">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#777777] mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-[#111111] transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <Link to={`/category/${product.category.toLowerCase().replace(' & ', '-')}`} className="hover:text-[#111111] transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#111111] font-medium truncate">{product.name}</span>
        </nav>

        {/* Primary Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16 items-start">
          
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="aspect-[4/5] bg-[#F7F5F1] rounded-3xl overflow-hidden border border-[#E7E3DC] relative">
              <img 
                src={product.images[activeImageIndex] || product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.discount && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Thumbnail switcher if multiple images exist */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "w-20 h-24 rounded-xl overflow-hidden border-2 transition-all bg-[#F7F5F1]",
                      activeImageIndex === idx ? "border-[#111111]" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Purchasing & Specifications (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            
            {/* Header info */}
            <div className="mb-6 pb-6 border-b border-[#E7E3DC]">
              <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-2 block">
                {product.brand}
              </span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] mb-3">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={15} 
                      className={cn("fill-current", i < Math.round(displayRating) ? "text-amber-400" : "text-gray-300")} 
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#111111]">
                  {displayRatingFixed}
                </span>
                <span className="text-xs text-[#777777]">
                  ({displayReviewCount} verified client reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#111111]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-[#777777] line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description Summary */}
            <p className="text-sm text-[#777777] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Color selection if available */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2.5">
                  Color Option: <span className="font-normal text-[#777777]">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-semibold border transition-all",
                        selectedColor === color 
                          ? "bg-[#111111] text-white border-[#111111]" 
                          : "bg-white text-[#111111] border-[#E7E3DC] hover:border-black"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection if available */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-2.5">
                  Size: <span className="font-normal text-[#777777]">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-11 h-11 rounded-xl text-xs font-semibold border flex items-center justify-center transition-all",
                        selectedSize === size 
                          ? "bg-[#111111] text-white border-[#111111]" 
                          : "bg-white text-[#111111] border-[#E7E3DC] hover:border-black"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-2 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#E7E3DC] rounded-xl bg-[#F7F5F1] h-12">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 h-full text-[#777777] hover:text-[#111111] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#111111]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 h-full text-[#777777] hover:text-[#111111] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-xs">
                  {product.stock > 0 ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check size={14} /> In Stock ({product.stock} units available)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold">Out of Stock</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 bg-[#111111] text-white rounded-xl text-xs font-semibold flex justify-center items-center gap-2 hover:bg-black transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag</span>
                </button>

                <button 
                  onClick={() => toggleWishlist(product)}
                  className="w-12 h-12 border border-[#E7E3DC] rounded-xl flex items-center justify-center text-[#111111] hover:bg-[#F7F5F1] transition-colors"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={18} className={cn(isWishlisted ? "fill-rose-600 text-rose-600" : "")} />
                </button>

                <button
                  onClick={handleShare}
                  className="w-12 h-12 border border-[#E7E3DC] rounded-xl flex items-center justify-center text-[#111111] hover:bg-[#F7F5F1] transition-colors"
                  aria-label="Share product link"
                  title="Share product"
                >
                  <Share2 size={18} />
                </button>
              </div>

              <button 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full py-4 bg-white text-[#111111] border-2 border-[#111111] rounded-xl text-xs font-bold hover:bg-[#F7F5F1] transition-all disabled:opacity-50"
              >
                Instant Buy with Fast Checkout
              </button>
            </div>

            {/* Service Guarantee Chips */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[#E7E3DC]">
              <div className="flex items-center gap-2.5 text-xs text-[#777777]">
                <Truck size={16} className="text-[#111111] flex-shrink-0" />
                <span>Complimentary luxury shipping &gt;$100</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#777777]">
                <RotateCcw size={16} className="text-[#111111] flex-shrink-0" />
                <span>30-day effortless returns</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#777777]">
                <ShieldCheck size={16} className="text-[#111111] flex-shrink-0" />
                <span>2-year atelier quality warranty</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#777777]">
                <Sparkles size={16} className="text-[#111111] flex-shrink-0" />
                <span>Hand-finished signature packaging</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed In-Depth Information */}
        <div className="mb-16">
          <div className="border-b border-[#E7E3DC] mb-8">
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setActiveTab('details')}
                className={cn(
                  "pb-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2",
                  activeTab === 'details' ? "border-[#111111] text-[#111111]" : "border-transparent text-[#777777] hover:text-[#111111]"
                )}
              >
                Product Details
              </button>
              <button 
                onClick={() => setActiveTab('specs')}
                className={cn(
                  "pb-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2",
                  activeTab === 'specs' ? "border-[#111111] text-[#111111]" : "border-transparent text-[#777777] hover:text-[#111111]"
                )}
              >
                Specifications
              </button>
              <button 
                onClick={() => setActiveTab('shipping')}
                className={cn(
                  "pb-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2",
                  activeTab === 'shipping' ? "border-[#111111] text-[#111111]" : "border-transparent text-[#777777] hover:text-[#111111]"
                )}
              >
                Shipping & Returns
              </button>
            </div>
          </div>

          <div className="bg-[#F7F5F1] p-8 rounded-3xl border border-[#E7E3DC] text-sm leading-relaxed text-[#171717]">
            {activeTab === 'details' && (
              <div className="space-y-4 max-w-3xl">
                <p>
                  Handcrafted according to the highest standards of the Luxora guild, the {product.name} seamlessly combines ergonomic performance with timeless minimalist beauty.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-[#777777]">
                  <li>Ethically sourced and responsibly fabricated materials</li>
                  <li>Tested through 50+ durability and wear checkpoints</li>
                  <li>Timeless colorway harmonizes with existing luxury collections</li>
                  <li>Signature serialized authenticity seal included</li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-[#E7E3DC]">
                  <span className="text-[#777777] block">Design House</span>
                  <span className="font-bold text-[#111111]">{product.brand}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-[#E7E3DC]">
                  <span className="text-[#777777] block">Category</span>
                  <span className="font-bold text-[#111111]">{product.category}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-[#E7E3DC]">
                  <span className="text-[#777777] block">Item Identification SKU</span>
                  <span className="font-bold text-[#111111]">LX-{product.id.padStart(4, '0')}-MOD</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-[#E7E3DC]">
                  <span className="text-[#777777] block">Warranty Protection</span>
                  <span className="font-bold text-[#111111]">24 Months Full Coverage</span>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 max-w-3xl text-xs text-[#777777] leading-relaxed">
                <p><strong className="text-[#111111]">Complimentary Courier Delivery:</strong> Free on all orders exceeding $100. Dispatched within 24 hours in secure bespoke climate-neutral packaging.</p>
                <p><strong className="text-[#111111]">30-Day Return Privilege:</strong> If you are not fully satisfied, returns are accepted within 30 days of receipt in original condition with intact security tags.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Customer Reviews Section */}
        <ProductReviews productId={product.id} />

        {/* You May Also Like Product Grid */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#111111] mb-8">
              Complementary Selections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
