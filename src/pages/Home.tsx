import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Clock, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useAdminStore } from '../store/useAdminStore';

interface HeroSlide {
  tag: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
}

const heroSlides: HeroSlide[] = [
  {
    tag: 'NEW COLLECTION',
    title: 'Live Beautifully.\nEvery Day.',
    description: 'Curated products for a better lifestyle. Quality, comfort & elegance — all in one place.',
    ctaText: 'Shop Now',
    ctaLink: '/shop',
    secondaryCtaText: 'Explore Collection',
    secondaryCtaLink: '/collections',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop',
  },
  {
    tag: 'AUTUMN / WINTER 2026',
    title: 'Refined Living.\nTimeless Form.',
    description: 'Architectural knitwear, artisanal ceramics, and purposeful tech engineered to endure.',
    ctaText: 'Explore New In',
    ctaLink: '/shop',
    secondaryCtaText: 'View Lookbook',
    secondaryCtaLink: '/collections',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop',
  },
  {
    tag: 'SEASONAL ARCHIVE',
    title: 'Curated Luxury.\nElevated Value.',
    description: 'Discover up to 40% off selected luxury goods from our prestigious seasonal archive.',
    ctaText: 'Shop the Sale',
    ctaLink: '/shop',
    secondaryCtaText: 'All Categories',
    secondaryCtaLink: '/categories',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop',
  },
];

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const { products, categories } = useAdminStore();

  // Best sellers filtered from mock data
  const bestSellers = products.filter(p => p.bestSeller).slice(0, 4);

  // Autoplay hero carousel with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 4000);
    }
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* ==================================================
          PHASE 4 — CONTROLLED HERO SECTION
          ================================================== */}
      <section className="pt-6 pb-12 sm:pb-16 bg-[#F7F5F1]">
        <div className="luxora-container">
          <div 
            className="relative rounded-3xl overflow-hidden bg-white border border-[#E7E3DC] shadow-sm min-h-[480px] lg:h-[540px] flex flex-col justify-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 h-full items-center">
              
              {/* Left Column: Editorial Copy */}
              <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center z-10">
                <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-3 block">
                  {slide.tag}
                </span>

                <h1 className="luxora-hero-title font-serif text-[#111111] mb-5 whitespace-pre-line tracking-tight">
                  {slide.title}
                </h1>

                <p className="text-base sm:text-lg text-[#777777] mb-8 max-w-lg leading-relaxed">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link 
                    to={slide.ctaLink} 
                    className="px-8 py-4 bg-[#111111] text-white text-center text-sm font-semibold rounded-full hover:bg-black transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {slide.ctaText}
                  </Link>

                  <Link 
                    to={slide.secondaryCtaLink} 
                    className="px-8 py-4 bg-white text-[#111111] border border-[#E7E3DC] text-center text-sm font-semibold rounded-full hover:bg-[#F7F5F1] transition-all flex items-center justify-center gap-2"
                  >
                    <span>{slide.secondaryCtaText}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Controlled Cropped Image */}
              <div className="lg:col-span-5 h-[320px] lg:h-full relative overflow-hidden bg-[#F1EDE5]">
                <img 
                  key={slide.image}
                  src={slide.image} 
                  alt={slide.title.replace('\n', ' ')} 
                  className="w-full h-full object-cover object-center transition-all duration-700 ease-out animate-in fade-in"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

            </div>

            {/* Carousel Controls: Arrows & Dots */}
            <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 flex items-center gap-3 z-20">
              <button 
                onClick={prevSlide}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-[#E7E3DC] text-[#111111] flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-sm"
                aria-label="Previous hero slide"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'w-6 bg-[#111111]' : 'w-2 bg-[#111111]/30 hover:bg-[#111111]/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-[#E7E3DC] text-[#111111] flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-sm"
                aria-label="Next hero slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          PHASE 5 — SERVICE BENEFITS SECTION (4 COLUMNS)
          ================================================== */}
      <section className="py-12 border-b border-[#E7E3DC] bg-white">
        <div className="luxora-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 bg-[#F7F5F1] rounded-2xl flex items-center justify-center text-[#111111] flex-shrink-0 border border-[#E7E3DC]">
                <Truck size={22} />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-[#111111] truncate">Free Shipping</h4>
                <p className="text-xs sm:text-sm text-[#777777]">On orders above $100</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 bg-[#F7F5F1] rounded-2xl flex items-center justify-center text-[#111111] flex-shrink-0 border border-[#E7E3DC]">
                <RotateCcw size={22} />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-[#111111] truncate">Easy Returns</h4>
                <p className="text-xs sm:text-sm text-[#777777]">30 days return policy</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 bg-[#F7F5F1] rounded-2xl flex items-center justify-center text-[#111111] flex-shrink-0 border border-[#E7E3DC]">
                <ShieldCheck size={22} />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-[#111111] truncate">Secure Payments</h4>
                <p className="text-xs sm:text-sm text-[#777777]">100% secure checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 bg-[#F7F5F1] rounded-2xl flex items-center justify-center text-[#111111] flex-shrink-0 border border-[#E7E3DC]">
                <Clock size={22} />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-[#111111] truncate">24/7 Support</h4>
                <p className="text-xs sm:text-sm text-[#777777]">We're here to help</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          PHASE 6 — SHOP BY CATEGORY (8 CIRCULAR CARDS)
          ================================================== */}
      <section className="luxora-section bg-white">
        <div className="luxora-container">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-1 block">Curated Departments</span>
              <h2 className="luxora-section-title font-serif text-[#111111]">
                Shop by Category
              </h2>
            </div>
            <Link 
              to="/categories" 
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111111] hover:underline self-start sm:self-auto"
            >
              <span>View All Categories</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          
          {/* Responsive Category Grid: 8 on desktop, 4 on tablet, 4 on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link 
                key={category.slug} 
                to={`/category/${category.slug}`}
                className="flex flex-col items-center group text-center"
              >
                {/* 50% border radius circle container with identical dimensions */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-[#F7F5F1] border-2 border-[#E7E3DC] group-hover:border-[#111111] transition-all duration-300 p-0.5 shadow-xs group-hover:shadow-md mb-3 flex-shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                    />
                  </div>
                </div>

                {/* Text clearly placed BELOW the image */}
                <span className="text-xs sm:text-sm font-medium text-[#111111] group-hover:text-black transition-colors line-clamp-1">
                  {category.name}
                </span>
                <span className="text-[11px] text-[#777777] mt-0.5">
                  {category.itemCount} items
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================
          PHASE 8 — PROMOTIONAL CARDS (4 COLUMNS)
          ================================================== */}
      <section className="luxora-section bg-[#F7F5F1]">
        <div className="luxora-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Promo 1: New Arrivals */}
            <div className="bg-white p-7 rounded-3xl border border-[#E7E3DC] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow min-h-[260px]">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-[#F7F5F1] text-[#111111] px-2.5 py-1 rounded-full border border-[#E7E3DC]">
                  Fresh Drop
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#111111] mt-4 mb-2">
                  New Arrivals
                </h3>
                <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
                  Discover the latest luxury designs curated specifically for you.
                </p>
              </div>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 text-xs font-bold text-[#111111] hover:gap-3 transition-all pt-4"
              >
                <span>Shop New Drops</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            {/* Promo 2: Trending Now */}
            <div className="bg-[#F1EDE5] p-7 rounded-3xl border border-[#E7E3DC] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow min-h-[260px]">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/70 text-[#111111] px-2.5 py-1 rounded-full border border-[#E7E3DC]">
                  Trending
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#111111] mt-4 mb-2">
                  Trending Now
                </h3>
                <p className="text-xs sm:text-sm text-[#171717]/80 leading-relaxed">
                  Explore customer favorites and viral seasonal staples.
                </p>
              </div>
              <Link 
                to="/collections" 
                className="inline-flex items-center gap-2 text-xs font-bold text-[#111111] hover:gap-3 transition-all pt-4"
              >
                <span>Explore Trend Edit</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            {/* Promo 3: Best Sellers */}
            <div className="bg-[#111111] text-white p-7 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow min-h-[260px]">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/10 text-white px-2.5 py-1 rounded-full">
                  Customer Top Picks
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-4 mb-2">
                  Best Sellers
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  Proven icons with 5-star verified customer feedback.
                </p>
              </div>
              <Link 
                to="/shop?sort=rating" 
                className="inline-flex items-center gap-2 text-xs font-bold text-white hover:gap-3 transition-all pt-4"
              >
                <span>Shop Best Rated</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            {/* Promo 4: Sale */}
            <div className="bg-rose-950 text-white p-7 rounded-3xl flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow min-h-[260px] relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-rose-600 text-white px-2.5 py-1 rounded-full">
                  Special Offer
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-4 mb-2">
                  Up to 40% Off
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Limited seasonal markdowns on premier apparel & decor.
                </p>
              </div>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 text-xs font-bold text-white hover:gap-3 transition-all pt-4 relative z-10"
              >
                <span>Shop Sale Edit</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          FEATURED BEST SELLERS PRODUCT GRID
          ================================================== */}
      <section className="luxora-section bg-white">
        <div className="luxora-container">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-1 block">Timeless Favorites</span>
              <h2 className="luxora-section-title font-serif text-[#111111]">
                Best Selling Icons
              </h2>
            </div>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111111] hover:underline self-start sm:self-auto"
            >
              <span>View All Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================
          EDITORIAL FEATURED COLLECTIONS (VERIFIED IMAGES)
          ================================================== */}
      <section className="luxora-section bg-[#F7F5F1]">
        <div className="luxora-container">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-1 block">Capsule Series</span>
              <h2 className="luxora-section-title font-serif text-[#111111]">
                Featured Collections
              </h2>
            </div>
            <Link 
              to="/collections" 
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#111111] hover:underline self-start sm:self-auto"
            >
              <span>Explore All Capsules</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Primary Large Editorial Hero Feature (7 cols) */}
            <div className="lg:col-span-7 relative rounded-3xl overflow-hidden min-h-[440px] flex flex-col justify-end p-8 sm:p-12 group">
              <img 
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1600&auto=format&fit=crop" 
                alt="Summer Edit Collection" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 text-white">
                <span className="text-xs font-bold tracking-widest uppercase mb-2 block text-white/80">Capsule No. 01</span>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold mb-3">Effortless Essentials</h3>
                <p className="text-sm sm:text-base text-white/80 max-w-md mb-6 leading-relaxed">
                  Light, breathable organic weaves engineered for everyday grace.
                </p>
                <Link 
                  to="/shop?category=Women" 
                  className="px-6 py-3.5 bg-white text-[#111111] text-xs font-semibold rounded-full hover:bg-[#F7F5F1] transition-colors inline-block"
                >
                  Shop the Capsule &rarr;
                </Link>
              </div>
            </div>

            {/* Twin Secondary Editorial Cards (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="relative rounded-3xl overflow-hidden min-h-[210px] flex-1 flex flex-col justify-end p-6 sm:p-8 group">
                <img 
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop" 
                  alt="Home & Living" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="relative z-10 text-white">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1">Architectural Living</h3>
                  <p className="text-xs text-white/80 mb-3">Minimalist furnishings and stoneware decor.</p>
                  <Link 
                    to="/category/home-living" 
                    className="text-xs font-bold uppercase tracking-wider text-white hover:underline"
                  >
                    Explore Home &rarr;
                  </Link>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden min-h-[210px] flex-1 flex flex-col justify-end p-6 sm:p-8 group">
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop" 
                  alt="Clean Beauty" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="relative z-10 text-white">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1">Botanical Apothecary</h3>
                  <p className="text-xs text-white/80 mb-3">Artisanal perfumery and potent serums.</p>
                  <Link 
                    to="/category/beauty" 
                    className="text-xs font-bold uppercase tracking-wider text-white hover:underline"
                  >
                    Explore Beauty &rarr;
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          TRUST & NEWSLETTER SECTION
          ================================================== */}
      <section className="luxora-section bg-white border-t border-[#E7E3DC]">
        <div className="luxora-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-2 block">
              The Luxora Philosophy
            </span>
            <h2 className="luxora-section-title font-serif text-[#111111] mb-4">
              Quality You Can Trust.
            </h2>
            <p className="text-base sm:text-lg text-[#777777] leading-relaxed">
              We believe in conscious craft, ethical sourcing, and products built to stand the test of time. Every piece in our repository is rigorously audited for sustainable excellence.
            </p>
          </div>

          <div className="bg-[#F7F5F1] rounded-3xl p-8 sm:p-12 border border-[#E7E3DC] max-w-4xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#111111] mb-2">
              Join the Luxora Private Circle
            </h3>
            <p className="text-xs sm:text-sm text-[#777777] mb-6 max-w-md mx-auto">
              Subscribe to receive exclusive invitations, early capsule previews, and complimentary VIP concierge shipping.
            </p>

            {newsletterSuccess ? (
              <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-emerald-800 text-sm font-semibold">
                <CheckCircle2 size={18} />
                <span>Thank you! You are now subscribed to the Luxora Circle.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  required
                  className="flex-1 px-5 py-3.5 bg-white rounded-full text-xs sm:text-sm border border-[#E7E3DC] focus:outline-none focus:border-[#111111]"
                />
                <button 
                  type="submit"
                  className="px-7 py-3.5 bg-[#111111] text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-black transition-colors shadow-sm"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
