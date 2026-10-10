import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t border-white/10">
      <div className="luxora-container">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* Column 1 & 2: Brand Editorial Statement */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-3xl font-serif font-bold tracking-tight mb-5 inline-block text-white hover:opacity-90">
              LUXORA
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-sm leading-relaxed">
              Curated luxury living. Thoughtful designs, premium materials, and products that elevate your everyday rituals. Quality you can trust, crafted for the way you live.
            </p>
            <div className="flex items-center space-x-5 text-xs text-gray-400">
              <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
              <span className="hover:text-white cursor-pointer transition-colors">Pinterest</span>
              <span className="hover:text-white cursor-pointer transition-colors">Vogue Archive</span>
            </div>
          </div>
          
          {/* Column 3: Navigation Directory */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-5">
              Collections
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>

              <li><Link to="/categories" className="hover:text-white transition-colors">Category Directory</Link></li>
              <li><Link to="/brands" className="hover:text-white transition-colors">Partner Ateliers</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Client Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-5">
              Client Concierge
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Concierge</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Freight</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ & Sizing Help</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Measurements Guide</Link></li>
            </ul>
          </div>
          
          {/* Column 5: Private Circle Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-3">
              The Private Circle
            </h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Subscribe to receive private capsule launches and bespoke previews.
            </p>
            
            {subscribed ? (
              <div className="p-3 bg-white/10 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Subscribed successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@luxora.com" 
                  required
                  className="bg-white/10 border border-white/20 px-3.5 py-2.5 w-full rounded-l-xl text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors"
                />
                <button 
                  type="submit" 
                  className="bg-white text-[#111111] px-4 py-2.5 rounded-r-xl hover:bg-gray-100 transition-colors flex items-center justify-center flex-shrink-0"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>

        </div>
        
        {/* Sub-footer Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>&copy; 2026 LUXORA International Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
