import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { collectionsData } from '../lib/data';

export function Collections() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="luxora-container">
        
        {/* Banner */}
        <div className="bg-[#F7F5F1] rounded-3xl p-8 sm:p-14 mb-12 border border-[#E7E3DC] text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#E7E3DC] text-xs font-semibold text-[#111111] mb-3">
            <Sparkles size={13} />
            <span>Curated Capsule Edits</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#111111] mb-3">
            Featured Collections
          </h1>
          <p className="text-sm sm:text-base text-[#777777] leading-relaxed max-w-xl mx-auto">
            Editorial capsules created by our creative directors to inspire your personal sanctuary and seasonal wardrobe.
          </p>
        </div>

        {/* Collections Editorial List */}
        <div className="space-y-12">
          {collectionsData.map((coll, index) => (
            <div 
              key={coll.title}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F7F5F1] rounded-3xl p-6 sm:p-10 border border-[#E7E3DC] ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`lg:col-span-7 aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-sm ${
                index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'
              }`}>
                <img src={coll.image} alt={coll.title} className="w-full h-full object-cover" />
              </div>

              <div className={`lg:col-span-5 flex flex-col justify-center ${
                index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'
              }`}>
                <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-2 block">
                  {coll.tag} • {coll.itemCount} Curated Pieces
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#111111] mb-4">
                  {coll.title}
                </h2>
                <p className="text-sm text-[#777777] leading-relaxed mb-6">
                  {coll.subtitle}
                </p>
                <Link
                  to={coll.link}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111111] text-white text-xs font-semibold rounded-full hover:bg-black transition-all self-start shadow-md hover:shadow-lg"
                >
                  <span>Explore Capsule Edit</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
