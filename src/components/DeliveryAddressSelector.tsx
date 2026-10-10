import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check, Plus, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

export function DeliveryAddressSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    user,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    guestZipCode,
    setGuestZipCode,
  } = useStore();

  const [zipInput, setZipInput] = useState('');

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // If selectedAddressId is invalid (e.g., deleted), fall back to default or null
  useEffect(() => {
    if (user?.isLoggedIn && addresses.length > 0) {
      const validAddress = addresses.find(a => a.id === selectedAddressId);
      if (!validAddress) {
        const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }, [user, addresses, selectedAddressId, setSelectedAddressId]);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const displayLocation = user?.isLoggedIn && selectedAddress
    ? `${selectedAddress.city} ${selectedAddress.postalCode}`
    : guestZipCode 
      ? `Zip ${guestZipCode}`
      : 'Select your location';

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipInput.trim()) {
      setGuestZipCode(zipInput.trim());
      setIsOpen(false);
      setZipInput('');
    }
  };

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
    setIsOpen(false);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Mock geocoding
          setGuestZipCode('Current Location');
          setIsOpen(false);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  };

  return (
    <div className="relative hidden md:flex" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm p-1.5 rounded hover:bg-[#F7F5F1] transition-colors"
        aria-label="Select delivery address"
      >
        <MapPin size={18} className="text-[#111111] mb-0.5" />
        <div className="flex flex-col text-left leading-none">
          <span className="text-[10px] text-[#777777] uppercase tracking-wide">Deliver to</span>
          <span className="text-xs font-bold text-[#111111] max-w-[120px] truncate">
            {displayLocation}
          </span>
        </div>
        <ChevronDown size={14} className={cn("text-[#777777] transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#E7E3DC] p-5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E3DC] mb-4">
            <h3 className="font-serif font-bold text-[#111111] text-base">Choose your location</h3>
            <button onClick={() => setIsOpen(false)} className="text-[#777777] hover:text-[#111111]">
              <X size={18} />
            </button>
          </div>
          
          <p className="text-xs text-[#777777] mb-4">
            Delivery options and delivery speeds may vary for different locations.
          </p>

          {user?.isLoggedIn ? (
            <div className="space-y-3">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => handleAddressSelect(address.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-colors",
                    selectedAddressId === address.id 
                      ? "border-[#111111] bg-[#F7F5F1]" 
                      : "border-[#E7E3DC] hover:border-[#111111] hover:bg-[#F7F5F1]"
                  )}
                >
                  <div className="mt-0.5 w-4 flex justify-center">
                    {selectedAddressId === address.id ? (
                      <Check size={16} className="text-[#111111]" />
                    ) : (
                      <MapPin size={16} className="text-[#777777]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111111]">
                      {address.name} {address.isDefault && <span className="font-normal text-[#777777] bg-white border px-1 rounded ml-1 text-[10px]">Default</span>}
                    </p>
                    <p className="text-xs text-[#777777] mt-0.5 truncate max-w-[200px]">
                      {address.street}, {address.city} {address.postalCode}
                    </p>
                  </div>
                </button>
              ))}
              
              <Link 
                to="/account/addresses" 
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 p-3 rounded-xl border border-dashed border-[#E7E3DC] text-[#777777] hover:text-[#111111] hover:border-[#111111] transition-colors text-xs font-semibold"
              >
                <Plus size={16} /> Add a new address
              </Link>
              
              <div className="pt-2">
                 <Link 
                  to="/account/addresses" 
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-[#111111] hover:underline"
                >
                  Manage addresses &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleZipSubmit}>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">Enter a US zip code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value)}
                    placeholder="e.g. 94102"
                    className="flex-1 px-3 py-2 bg-[#F7F5F1] rounded-xl text-xs border border-[#E7E3DC] focus:bg-white focus:outline-none"
                    maxLength={10}
                  />
                  <button type="submit" className="px-4 py-2 bg-[#111111] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors">
                    Apply
                  </button>
                </div>
              </form>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E7E3DC]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-[#777777]">or</span>
                </div>
              </div>
              
              <button 
                onClick={handleUseLocation}
                className="w-full py-2 bg-[#F7F5F1] text-[#111111] text-xs font-semibold rounded-xl hover:bg-[#E7E3DC] transition-colors flex items-center justify-center gap-2"
              >
                <MapPin size={14} /> Use current location
              </button>
              
              <p className="text-xs text-center text-[#777777] mt-3">
                <button onClick={() => { setIsOpen(false); navigate('/login'); }} className="text-[#111111] font-bold hover:underline">Sign in</button> to see your addresses
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
