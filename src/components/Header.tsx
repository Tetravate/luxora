import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/useAdminStore';
import { brands } from '../lib/data';
import { cn } from '../lib/utils';
import { DeliveryAddressSelector } from './DeliveryAddressSelector';

export function Header() {
  const { categories, products } = useAdminStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [mobileCategoriesExpanded, setMobileCategoriesExpanded] = useState(false);

  const { 
    cart, 
    wishlist, 
    setCartOpen, 
    isMobileMenuOpen, 
    setMobileMenuOpen,
    user 
  } = useStore();

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);

  // Cart item count calculation
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Scroll listener for sticky elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns and mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setBrandsOpen(false);
    setIsSearchActive(false);
  }, [location.pathname, setMobileMenuOpen]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchActive(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
      if (brandsRef.current && !brandsRef.current.contains(e.target as Node)) {
        setBrandsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCategoriesOpen(false);
        setBrandsOpen(false);
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Search suggestions filtered by name, category, or brand
  const searchSuggestions = searchQuery.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchActive(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (slug: string) => {
    setIsSearchActive(false);
    setSearchQuery('');
    navigate(`/shop/${slug}`);
  };

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white border-b",
          isScrolled 
            ? "border-[#E7E3DC] shadow-sm py-0" 
            : "border-[#E7E3DC] py-0"
        )}
      >
        <div className="luxora-container">
          <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
            
            {/* Left: Mobile Toggle & Logo */}
            <div className="flex items-center gap-3">
              <button 
                className="lg:hidden p-2 -ml-2 text-[#111111] hover:bg-[#F7F5F1] rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                <Menu size={22} />
              </button>

              <Link 
                to="/" 
                className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#111111] hover:opacity-90 transition-opacity mr-2"
              >
                TETRAVATE
              </Link>
              
              <DeliveryAddressSelector />
            </div>

            {/* Center: Desktop Navigation Bar with Gap */}
            <nav className="hidden lg:flex items-center gap-7">
              <Link 
                to="/shop" 
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors py-2 text-[#171717] hover:text-[#111111] border-b-2",
                  location.pathname === '/shop' ? "border-[#111111]" : "border-transparent"
                )}
              >
                Shop
              </Link>

              {/* Categories Mega Dropdown Trigger */}
              <div 
                ref={categoriesRef}
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button 
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors py-2 text-[#171717] hover:text-[#111111] border-b-2",
                    categoriesOpen || location.pathname.startsWith('/category') ? "border-[#111111]" : "border-transparent"
                  )}
                  aria-expanded={categoriesOpen}
                >
                  Categories
                  <ChevronDown size={14} className={cn("transition-transform duration-200", categoriesOpen && "rotate-180")} />
                </button>

                {/* Categories Dropdown Menu */}
                {categoriesOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[720px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-2xl shadow-2xl border border-[#E7E3DC] p-6">
                      <div className="flex items-center justify-between pb-4 border-b border-[#E7E3DC] mb-5">
                        <span className="text-xs font-semibold tracking-widest uppercase text-[#777777]">Explore All Collections</span>
                        <Link 
                          to="/categories" 
                          onClick={() => setCategoriesOpen(false)}
                          className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1"
                        >
                          View Full Directory <ArrowRight size={12} />
                        </Link>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        {categories.map((cat) => (
                          <Link 
                            key={cat.slug} 
                            to={`/category/${cat.slug}`}
                            onClick={() => setCategoriesOpen(false)}
                            className="group flex flex-col items-center p-3 rounded-xl hover:bg-[#F7F5F1] transition-all text-center"
                          >
                            <div className="w-16 h-16 rounded-full overflow-hidden mb-2.5 bg-[#F7F5F1] border border-[#E7E3DC] group-hover:scale-105 transition-transform">
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm font-medium text-[#111111] group-hover:text-black">
                              {cat.name}
                            </span>
                            <span className="text-xs text-[#777777] mt-0.5">
                              {cat.itemCount} items
                            </span>
                          </Link>
                        ))}
                      </div>

                      <div className="mt-5 pt-4 border-t border-[#E7E3DC] bg-[#F7F5F1] -mx-6 -mb-6 p-4 rounded-b-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-[#111111]" />
                          <span className="text-xs font-medium text-[#111111]">Complimentary worldwide luxury packaging on all orders</span>
                        </div>
                        <Link 
                          to="/collections" 
                          onClick={() => setCategoriesOpen(false)}
                          className="text-xs font-bold text-[#111111] hover:underline"
                        >
                          Explore Curated Capsules &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>



              {/* Brands Dropdown */}
              <div 
                ref={brandsRef}
                className="relative"
                onMouseEnter={() => setBrandsOpen(true)}
                onMouseLeave={() => setBrandsOpen(false)}
              >
                <button 
                  onClick={() => setBrandsOpen(!brandsOpen)}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors py-2 text-[#171717] hover:text-[#111111] border-b-2",
                    brandsOpen || location.pathname === '/brands' ? "border-[#111111]" : "border-transparent"
                  )}
                  aria-expanded={brandsOpen}
                >
                  Brands
                  <ChevronDown size={14} className={cn("transition-transform duration-200", brandsOpen && "rotate-180")} />
                </button>

                {brandsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-2xl shadow-2xl border border-[#E7E3DC] p-4">
                      <div className="text-xs font-semibold tracking-wider uppercase text-[#777777] px-2 py-1 mb-2 border-b border-[#E7E3DC]">
                        Featured Houses
                      </div>
                      <div className="flex flex-col gap-1">
                        {brands.slice(0, 6).map((b) => (
                          <Link
                            key={b.slug}
                            to={`/shop?brand=${encodeURIComponent(b.name)}`}
                            onClick={() => setBrandsOpen(false)}
                            className="px-3 py-2 rounded-xl text-sm font-medium text-[#171717] hover:bg-[#F7F5F1] hover:text-[#111111] flex items-center justify-between"
                          >
                            <span>{b.name}</span>
                            <span className="text-xs text-[#777777]">{b.itemCount}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-[#E7E3DC] px-2">
                        <Link 
                          to="/brands" 
                          onClick={() => setBrandsOpen(false)}
                          className="text-xs font-bold text-[#111111] hover:underline block text-center py-1"
                        >
                          All Brands Directory &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right: Functional Search Bar & Action Icons */}
            <div className="flex items-center gap-3 sm:gap-5">
              
              {/* Desktop Search Input with Autocomplete */}
              <div ref={searchRef} className="relative hidden md:block">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchActive(true);
                    }}
                    onFocus={() => setIsSearchActive(true)}
                    placeholder="Search products, brands..." 
                    className="w-56 lg:w-72 pl-10 pr-8 py-2 bg-[#F7F5F1] rounded-full text-sm border border-transparent focus:border-[#E7E3DC] focus:bg-white focus:outline-none transition-all placeholder:text-[#777777]"
                    aria-label="Search catalog"
                  />
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111]"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </form>

                {/* Live Search Suggestions Dropdown */}
                {isSearchActive && searchQuery.trim() !== '' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E7E3DC] p-3 z-50 max-h-80 overflow-y-auto">
                    {searchSuggestions.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-[#777777] px-2 py-1">
                          Product Matches
                        </span>
                        {searchSuggestions.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSuggestionClick(item.slug)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F7F5F1] text-left transition-colors"
                          >
                            <img src={item.images[0]} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-[#F7F5F1]" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#111111] truncate">{item.name}</p>
                              <p className="text-[11px] text-[#777777]">{item.brand} • ${item.price.toFixed(2)}</p>
                            </div>
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="mt-2 pt-2 border-t border-[#E7E3DC] text-xs font-semibold text-center text-[#111111] hover:underline w-full py-1"
                        >
                          View all results for "{searchQuery}" &rarr;
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-xs text-[#777777]">No products found for "{searchQuery}"</p>
                        <Link 
                          to="/shop" 
                          onClick={() => setIsSearchActive(false)}
                          className="text-xs font-bold text-[#111111] hover:underline mt-2 inline-block"
                        >
                          Browse all products
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Search Toggle Icon */}
              <button 
                onClick={() => {
                  setMobileMenuOpen(true);
                }}
                className="md:hidden p-2 text-[#111111] hover:bg-[#F7F5F1] rounded-full transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Account Link */}
              <Link 
                to={user?.role === 'admin' ? '/admin/dashboard' : '/account'}
                className="p-2 text-[#111111] hover:bg-[#F7F5F1] rounded-full transition-colors flex items-center justify-center relative group"
                aria-label={user?.role === 'admin' ? "Admin Dashboard" : "Account"}
                title={user?.isLoggedIn ? (user.role === 'admin' ? `Admin Dashboard (${user.name})` : `Account (${user.name})`) : "Account / Sign In"}
              >
                <User size={20} />
                {user?.isLoggedIn && (
                  <span className="absolute bottom-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </Link>

              {/* Wishlist Link */}
              <Link 
                to="/wishlist" 
                className="p-2 text-[#111111] hover:bg-[#F7F5F1] rounded-full transition-colors relative flex items-center justify-center"
                aria-label={`Wishlist, ${wishlist.length} items`}
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute 0 top-0.5 right-0.5 min-w-4 h-4 px-1 bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center rounded-full leading-none">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Button */}
              <button 
                onClick={() => setCartOpen(true)}
                className="p-2 text-[#111111] hover:bg-[#F7F5F1] rounded-full transition-colors relative flex items-center justify-center"
                aria-label={`Shopping Cart, ${cartItemCount} items`}
              >
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center rounded-full leading-none">
                    {cartItemCount}
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Spacer so page content begins right below the 80px fixed header */}
      <div className="h-20" />

      {/* Mobile Menu Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-xs z-[70] lg:hidden transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Slide-Out Drawer */}
      <div 
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[80] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="p-5 flex items-center justify-between border-b border-[#E7E3DC]">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-serif font-bold text-[#111111]"
          >
            TETRAVATE
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="p-2 -mr-2 text-[#111111] hover:bg-[#F7F5F1] rounded-full transition-colors"
            aria-label="Close mobile menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-6">
          
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F1] rounded-xl text-sm border border-[#E7E3DC] focus:bg-white focus:outline-none placeholder:text-[#777777]"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
          </form>

          {/* Navigation Links */}
          <nav className="flex flex-col divide-y divide-[#E7E3DC]">
            <Link 
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3.5 text-base font-medium text-[#111111] flex items-center justify-between"
            >
              <span>Shop All</span>
              <ArrowRight size={16} className="text-[#777777]" />
            </Link>

            {/* Categories Accordion */}
            <div className="py-2">
              <button 
                onClick={() => setMobileCategoriesExpanded(!mobileCategoriesExpanded)}
                className="w-full py-2.5 text-base font-medium text-[#111111] flex items-center justify-between text-left"
              >
                <span>Categories</span>
                <ChevronDown size={16} className={cn("text-[#777777] transition-transform", mobileCategoriesExpanded && "rotate-180")} />
              </button>

              {mobileCategoriesExpanded && (
                <div className="grid grid-cols-2 gap-2 pt-2 pb-3">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-[#F7F5F1] hover:bg-[#E7E3DC] text-xs font-medium text-[#111111] flex items-center gap-2"
                    >
                      <img src={cat.image} alt={cat.name} className="w-6 h-6 rounded-full object-cover" />
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  ))}
                  <Link
                    to="/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className="col-span-2 text-center py-2 text-xs font-bold text-[#111111] hover:underline"
                  >
                    View All Categories &rarr;
                  </Link>
                </div>
              )}
            </div>



            <Link 
              to="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3.5 text-base font-medium text-[#111111] flex items-center justify-between"
            >
              <span>Featured Collections</span>
              <ArrowRight size={16} className="text-[#777777]" />
            </Link>

            <Link 
              to="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3.5 text-base font-medium text-[#111111] flex items-center justify-between"
            >
              <span>Brands Directory</span>
              <ArrowRight size={16} className="text-[#777777]" />
            </Link>
          </nav>

          {/* User Links in Drawer Bottom */}
          <div className="mt-auto pt-6 border-t border-[#E7E3DC] flex flex-col gap-3">
            <Link 
              to={user?.role === 'admin' ? '/admin/dashboard' : '/account'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F5F1] text-sm font-medium text-[#111111]"
            >
              <User size={18} />
              <span>{user?.isLoggedIn ? (user.role === 'admin' ? `Admin Dashboard (${user.name})` : `Account (${user.name})`) : 'Sign In / Account'}</span>
            </Link>

            <Link 
              to="/wishlist" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-[#F7F5F1] text-sm font-medium text-[#111111]"
            >
              <div className="flex items-center gap-3">
                <Heart size={18} />
                <span>My Wishlist</span>
              </div>
              <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full border border-[#E7E3DC]">
                {wishlist.length}
              </span>
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCartOpen(true);
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-[#111111] text-white text-sm font-medium"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} />
                <span>View Cart</span>
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                {cartItemCount}
              </span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
