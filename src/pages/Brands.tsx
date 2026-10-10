import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { brands } from '../lib/data';

export function Brands() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="luxora-container">
        
        {/* Banner */}
        <div className="bg-[#F7F5F1] rounded-3xl p-8 sm:p-14 mb-12 border border-[#E7E3DC] text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#E7E3DC] text-xs font-semibold text-[#111111] mb-3">
            <Sparkles size={13} />
            <span>Curated Partner Houses</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#111111] mb-3">
            Brands & Ateliers
          </h1>
          <p className="text-sm sm:text-base text-[#777777] leading-relaxed max-w-xl mx-auto">
            We partner exclusively with independent ateliers and renowned design studios committed to enduring craft, transparency, and sustainable luxury.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((b) => (
            <Link
              key={b.slug}
              to={`/shop?brand=${encodeURIComponent(b.name)}`}
              className="bg-white p-7 rounded-3xl border border-[#E7E3DC] hover:border-[#111111] hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold bg-[#F7F5F1] text-[#777777] px-2.5 py-1 rounded-full border border-[#E7E3DC]">
                    {b.itemCount} items
                  </span>
                  {b.featured && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Signature House
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#111111] mb-2 group-hover:underline">
                  {b.name}
                </h3>
                <p className="text-xs text-[#777777] leading-relaxed mb-6">
                  {b.description}
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] group-hover:gap-2.5 transition-all pt-2 border-t border-[#F7F5F1]">
                <span>Browse Products</span>
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
