import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';

export function Categories() {
  const { categories } = useAdminStore();
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="luxora-container">
        
        {/* Banner */}
        <div className="bg-[#F7F5F1] rounded-3xl p-8 sm:p-14 mb-12 border border-[#E7E3DC] text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#E7E3DC] text-xs font-semibold text-[#111111] mb-3">
            <Sparkles size={13} />
            <span>Master Department Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#111111] mb-3">
            Shop by Category
          </h1>
          <p className="text-sm sm:text-base text-[#777777] leading-relaxed max-w-xl mx-auto">
            Discover our curated portfolio spanning luxury womenswear, tailored menswear, architectural living decor, clean beauty formulations, and technical essentials.
          </p>
        </div>

        {/* Categories Grid (8 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E7E3DC] hover:border-[#111111]/40 hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-[#F7F5F1] overflow-hidden relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-[#111111] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {cat.itemCount} items
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-serif font-bold text-[#111111] mb-2 group-hover:underline">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#777777] leading-relaxed mb-6 flex-1">
                  {cat.description}
                </p>
                
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] group-hover:gap-2.5 transition-all">
                  <span>Explore Department</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
