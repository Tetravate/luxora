import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { brands } from '../lib/data';
import { useAdminStore } from '../store/useAdminStore';
import { ProductCard } from '../components/ProductCard';
import { 
  Filter, 
  Check, 
  X, 
  Search, 
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const { products, categories } = useAdminStore();

  // Derive filters directly from URL searchParams
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedBrand = searchParams.get('brand') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'featured';
  const priceRange = searchParams.get('price') || 'all';
  const onlyInStock = searchParams.get('inStock') === 'true';
  const minRating = Number(searchParams.get('minRating')) || 0;

  // Update URL helper
  const updateFilterParam = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'all' || value === '0' || value === 'false') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleCategorySelect = (cat: string) => {
    updateFilterParam('category', cat);
  };

  const handleBrandSelect = (b: string) => {
    updateFilterParam('brand', b);
  };

  const handlePriceSelect = (range: string) => {
    updateFilterParam('price', range);
  };

  const handleRatingSelect = (rating: number) => {
    updateFilterParam('minRating', rating > 0 ? rating.toString() : null);
  };

  const handleStockToggle = () => {
    updateFilterParam('inStock', !onlyInStock ? 'true' : null);
  };

  const handleSortChange = (sort: string) => {
    updateFilterParam('sort', sort);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filtered and sorted products computation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'All' && product.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // In stock filter
      if (onlyInStock && product.stock <= 0) {
        return false;
      }

      // Minimum rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // Price range filter
      if (priceRange === 'under-50' && product.price >= 50) return false;
      if (priceRange === '50-100' && (product.price < 50 || product.price > 100)) return false;
      if (priceRange === '100-200' && (product.price < 100 || product.price > 200)) return false;
      if (priceRange === 'over-200' && product.price <= 200) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      return 0; // featured default
    });
  }, [searchQuery, selectedCategory, selectedBrand, onlyInStock, minRating, priceRange, sortBy]);

  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) +
    (selectedBrand !== 'All' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  return (
    <div className="py-8 bg-white min-h-screen">
      <div className="luxora-container">
        
        {/* Page Banner Header */}
        <div className="bg-[#F7F5F1] rounded-3xl p-8 sm:p-12 mb-8 border border-[#E7E3DC]">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-2 block">
              The Entire Repository
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#111111] mb-3">
              {searchQuery ? `Search: "${searchQuery}"` : selectedCategory !== 'All' ? selectedCategory : 'Shop All Products'}
            </h1>
            <p className="text-sm sm:text-base text-[#777777] leading-relaxed">
              Explore our verified portfolio of timeless apparel, artisanal homeware, clean beauty formulations, and precision wearables.
            </p>
          </div>
        </div>

        {/* Top Control Bar (Search, Mobile Filter Toggle, Sort Selector) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between pb-6 mb-8 border-b border-[#E7E3DC] gap-4">
          
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#111111] text-xs font-semibold text-[#111111]"
            >
              <Filter size={15} />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            <span className="text-xs sm:text-sm text-[#777777]">
              Showing <strong className="text-[#111111]">{filteredProducts.length}</strong> items
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Inline Search Input */}
            <div className="relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  updateFilterParam('search', e.target.value.trim() || null);
                }}
                placeholder="Filter catalog..."
                className="w-full sm:w-56 pl-9 pr-8 py-2 bg-[#F7F5F1] rounded-full text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
              {searchQuery && (
                <button 
                  onClick={() => {
                    updateFilterParam('search', null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111]"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-[#F7F5F1] border border-[#E7E3DC] rounded-full px-3 py-1.5">
              <ArrowUpDown size={14} className="text-[#777777]" />
              <label htmlFor="shop-sort" className="text-xs text-[#777777] font-medium">Sort:</label>
              <select 
                id="shop-sort"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#111111] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-[#F7F5F1] rounded-2xl border border-[#E7E3DC]">
            <span className="text-xs font-bold text-[#111111] mr-1">Active Filters:</span>
            
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E7E3DC] rounded-full text-xs font-medium text-[#111111]">
                Category: {selectedCategory}
                <button onClick={() => handleCategorySelect('All')} className="text-[#777777] hover:text-black">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedBrand !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E7E3DC] rounded-full text-xs font-medium text-[#111111]">
                Brand: {selectedBrand}
                <button onClick={() => handleBrandSelect('All')} className="text-[#777777] hover:text-black">
                  <X size={12} />
                </button>
              </span>
            )}

            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E7E3DC] rounded-full text-xs font-medium text-[#111111]">
                Price: {priceRange.replace('-', ' to ')}
                <button onClick={() => handlePriceSelect('all')} className="text-[#777777] hover:text-black">
                  <X size={12} />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E7E3DC] rounded-full text-xs font-medium text-[#111111]">
                Rating: {minRating}★+
                <button onClick={() => handleRatingSelect(0)} className="text-[#777777] hover:text-black">
                  <X size={12} />
                </button>
              </span>
            )}

            {onlyInStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E7E3DC] rounded-full text-xs font-medium text-[#111111]">
                In Stock Only
                <button onClick={handleStockToggle} className="text-[#777777] hover:text-black">
                  <X size={12} />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E7E3DC] rounded-full text-xs font-medium text-[#111111]">
                Keyword: "{searchQuery}"
                <button onClick={() => updateFilterParam('search', null)} className="text-[#777777] hover:text-black">
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="ml-auto text-xs font-bold text-rose-600 hover:text-rose-700 underline flex items-center gap-1"
            >
              <RotateCcw size={12} /> Clear all
            </button>
          </div>
        )}

        {/* Main Content Layout (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Sidebar Filters (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-7 sticky top-28 bg-white p-5 rounded-3xl border border-[#E7E3DC]">
            
            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3 pb-2 border-b border-[#E7E3DC]">
                Categories
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => handleCategorySelect('All')}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left",
                      selectedCategory === 'All'
                        ? "bg-[#111111] text-white"
                        : "text-[#171717] hover:bg-[#F7F5F1]"
                    )}
                  >
                    <span>All Categories</span>
                    {selectedCategory === 'All' && <Check size={14} />}
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      onClick={() => handleCategorySelect(cat.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left",
                        selectedCategory.toLowerCase() === cat.name.toLowerCase()
                          ? "bg-[#111111] text-white"
                          : "text-[#171717] hover:bg-[#F7F5F1]"
                      )}
                    >
                      <span>{cat.name}</span>
                      {selectedCategory.toLowerCase() === cat.name.toLowerCase() && <Check size={14} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3 pb-2 border-b border-[#E7E3DC]">
                Design House / Brand
              </h3>
              <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <li>
                  <button
                    onClick={() => handleBrandSelect('All')}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left",
                      selectedBrand === 'All' ? "text-[#111111] font-bold" : "text-[#777777] hover:text-[#111111]"
                    )}
                  >
                    <span>All Brands</span>
                    {selectedBrand === 'All' && <Check size={13} />}
                  </button>
                </li>
                {brands.map((b) => (
                  <li key={b.slug}>
                    <button
                      onClick={() => handleBrandSelect(b.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left",
                        selectedBrand.toLowerCase() === b.name.toLowerCase() ? "text-[#111111] font-bold" : "text-[#777777] hover:text-[#111111]"
                      )}
                    >
                      <span>{b.name}</span>
                      {selectedBrand.toLowerCase() === b.name.toLowerCase() && <Check size={13} />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3 pb-2 border-b border-[#E7E3DC]">
                Price Range
              </h3>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-50', label: 'Under $50' },
                  { id: '50-100', label: '$50 to $100' },
                  { id: '100-200', label: '$100 to $200' },
                  { id: 'over-200', label: 'Over $200' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => handlePriceSelect(tier.id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors text-left",
                      priceRange === tier.id ? "bg-[#F7F5F1] font-bold text-[#111111]" : "text-[#777777] hover:text-[#111111]"
                    )}
                  >
                    <span>{tier.label}</span>
                    {priceRange === tier.id && <Check size={13} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3 pb-2 border-b border-[#E7E3DC]">
                Customer Rating
              </h3>
              <div className="flex flex-col gap-1">
                {[
                  { val: 0, label: 'All Ratings' },
                  { val: 4.8, label: '4.8★ & Above' },
                  { val: 4.5, label: '4.5★ & Above' },
                  { val: 4.0, label: '4.0★ & Above' },
                ].map((r) => (
                  <button
                    key={r.val}
                    onClick={() => handleRatingSelect(r.val)}
                    className={cn(
                      "flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors text-left",
                      minRating === r.val ? "bg-[#F7F5F1] font-bold text-[#111111]" : "text-[#777777] hover:text-[#111111]"
                    )}
                  >
                    <span>{r.label}</span>
                    {minRating === r.val && <Check size={13} />}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-[#E7E3DC]">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-xs font-semibold text-[#111111]">In Stock Only</span>
                <input 
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={handleStockToggle}
                  className="w-4 h-4 rounded text-[#111111] focus:ring-0 cursor-pointer"
                />
              </label>
            </div>

          </aside>

          {/* Product Grid Area (9 cols) */}
          <main className="lg:col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-[#F7F5F1] rounded-3xl p-12 text-center border border-[#E7E3DC] my-6">
                <h3 className="text-2xl font-serif font-bold text-[#111111] mb-2">
                  No products matched your filters
                </h3>
                <p className="text-sm text-[#777777] max-w-md mx-auto mb-6">
                  Try adjusting your price range, clearing search terms, or resetting category selections.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-[#111111] text-white text-xs font-semibold rounded-full hover:bg-black transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filters Slide-Out Modal Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-[95] lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className="relative ml-auto w-[85%] max-w-md bg-white h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC] mb-6">
              <h2 className="text-lg font-serif font-bold text-[#111111]">Filters</h2>
              <button 
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 rounded-full text-[#777777] hover:text-[#111111]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">Categories</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategorySelect('All')}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border",
                    selectedCategory === 'All' ? "bg-[#111111] text-white border-[#111111]" : "border-[#E7E3DC] text-[#111111]"
                  )}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategorySelect(cat.name)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border",
                      selectedCategory.toLowerCase() === cat.name.toLowerCase() ? "bg-[#111111] text-white border-[#111111]" : "border-[#E7E3DC] text-[#111111]"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] mb-3">Price Range</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'under-50', label: 'Under $50' },
                  { id: '50-100', label: '$50 - $100' },
                  { id: '100-200', label: '$100 - $200' },
                  { id: 'over-200', label: '$200+' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => handlePriceSelect(tier.id)}
                    className={cn(
                      "p-2 rounded-xl text-xs font-medium border text-center",
                      priceRange === tier.id ? "bg-[#111111] text-white border-[#111111]" : "border-[#E7E3DC] text-[#111111]"
                    )}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-[#E7E3DC] flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 border border-[#E7E3DC] rounded-xl text-xs font-semibold text-[#111111]"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-3 bg-[#111111] text-white rounded-xl text-xs font-semibold"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
