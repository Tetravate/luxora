import { Link } from 'react-router-dom';
import { Mail, Phone, Clock } from 'lucide-react';

export function About() {
  return (
    <div className="py-16 bg-white min-h-[70vh]">
      <div className="luxora-container max-w-4xl">
        <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-2 block">Our Heritage</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#111111] mb-6">
          Thoughtfully Designed.<br />Responsibly Sourced.
        </h1>
        <div className="space-y-6 text-sm sm:text-base text-[#777777] leading-relaxed">
          <p>
            Founded with an unwavering vision for understated elegance, Luxora curates modern heirlooms across fashion, interior decor, conscious beauty, and everyday precision accessories.
          </p>
          <p>
            Every product in our catalog passes rigorous design, ergonomics, and material audits. We partner with multi-generational workshops that respect both artisan heritage and environmental preservation.
          </p>
          <div className="pt-6">
            <Link to="/shop" className="px-8 py-3.5 bg-[#111111] text-white text-xs font-semibold rounded-full hover:bg-black transition-colors inline-block">
              Explore Our Catalog &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <div className="py-16 bg-white min-h-[70vh]">
      <div className="luxora-container max-w-4xl">
        <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-2 block">Concierge Desk</span>
        <h1 className="text-4xl font-serif font-bold text-[#111111] mb-6">Contact Luxora Concierge</h1>
        <p className="text-sm text-[#777777] mb-10 max-w-lg">
          Our global client specialists are available 24 hours a day, 7 days a week for bespoke sourcing, order consultations, and returns.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-[#F7F5F1] border border-[#E7E3DC]">
            <Mail size={22} className="text-[#111111] mb-3" />
            <h3 className="font-serif font-bold text-base text-[#111111] mb-1">Email Concierge</h3>
            <p className="text-xs text-[#777777]">concierge@luxora.com</p>
            <p className="text-xs text-[#777777] mt-1">Average response: &lt;2 hours</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F5F1] border border-[#E7E3DC]">
            <Phone size={22} className="text-[#111111] mb-3" />
            <h3 className="font-serif font-bold text-base text-[#111111] mb-1">Direct Telephone</h3>
            <p className="text-xs text-[#777777]">+1 (800) 849-5896</p>
            <p className="text-xs text-[#777777] mt-1">Toll-free worldwide support</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F5F1] border border-[#E7E3DC]">
            <Clock size={22} className="text-[#111111] mb-3" />
            <h3 className="font-serif font-bold text-base text-[#111111] mb-1">Operating Hours</h3>
            <p className="text-xs text-[#777777]">Monday – Sunday</p>
            <p className="text-xs text-[#777777] mt-1">24 Hours continuous coverage</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShippingInfo() {
  return (
    <div className="py-16 bg-white min-h-[70vh]">
      <div className="luxora-container max-w-3xl">
        <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-2 block">Client Care</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mb-6">Shipping & Logistics Information</h1>
        <div className="space-y-6 text-sm text-[#777777] leading-relaxed">
          <div className="p-6 rounded-2xl bg-[#F7F5F1] border border-[#E7E3DC]">
            <h3 className="font-bold text-[#111111] mb-2">Complimentary Luxury Shipping</h3>
            <p>All orders over $100 receive complimentary carbon-neutral priority express shipping with end-to-end telemetry tracking.</p>
          </div>
          <div className="p-6 rounded-2xl bg-[#F7F5F1] border border-[#E7E3DC]">
            <h3 className="font-bold text-[#111111] mb-2">Standard Delivery ($15)</h3>
            <p>Orders under $100 are dispatched via insured courier arriving within 2–4 business days worldwide.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReturnsInfo() {
  return (
    <div className="py-16 bg-white min-h-[70vh]">
      <div className="luxora-container max-w-3xl">
        <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-2 block">Client Care</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mb-6">Returns & Exchanges Policy</h1>
        <div className="space-y-6 text-sm text-[#777777] leading-relaxed">
          <p>
            Luxora offers an effortless 30-day return policy. Items must be in their original, unused condition with all authenticity tags attached.
          </p>
          <p>
            Complimentary prepaid return courier collection labels are provided inside every parcel.
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const faqs = [
    { q: "Are all Luxora products authentic?", a: "Yes. Every item in our repository is directly commissioned or sourced from authorized signature ateliers with serialized certificates of authenticity." },
    { q: "How do I use a promotional code?", a: "Enter your code (such as LUXORA10) in the promo box in your shopping bag or during checkout." },
    { q: "How can I track my shipment?", a: "Once dispatched, you will receive an SMS and email notification with direct courier GPS tracking." },
    { q: "Can I cancel or modify an order?", a: "Orders may be modified within 60 minutes of placement by contacting concierge@luxora.com." }
  ];

  return (
    <div className="py-16 bg-white min-h-[70vh]">
      <div className="luxora-container max-w-3xl">
        <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-2 block">Help Center</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mb-8">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#F7F5F1] border border-[#E7E3DC]">
              <h3 className="font-serif font-bold text-base text-[#111111] mb-2">{f.q}</h3>
              <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SizeGuide() {
  return (
    <div className="py-16 bg-white min-h-[70vh]">
      <div className="luxora-container max-w-3xl">
        <span className="text-xs font-bold tracking-widest uppercase text-[#777777] mb-2 block">Fit Guide</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#111111] mb-6">Atelier Sizing Guide</h1>
        <p className="text-sm text-[#777777] mb-6">
          Our garments are cut to standard European luxury proportions with relaxed modern drapery.
        </p>
        <div className="border border-[#E7E3DC] rounded-2xl overflow-hidden text-xs">
          <div className="grid grid-cols-4 bg-[#F7F5F1] p-3 font-bold text-[#111111]">
            <span>Size</span>
            <span>Chest (in)</span>
            <span>Waist (in)</span>
            <span>Hips (in)</span>
          </div>
          <div className="divide-y divide-[#E7E3DC]">
            <div className="grid grid-cols-4 p-3 text-[#777777]"><span>S</span><span>36–38</span><span>30–32</span><span>36–38</span></div>
            <div className="grid grid-cols-4 p-3 text-[#777777]"><span>M</span><span>38–40</span><span>32–34</span><span>38–40</span></div>
            <div className="grid grid-cols-4 p-3 text-[#777777]"><span>L</span><span>40–42</span><span>34–36</span><span>40–42</span></div>
            <div className="grid grid-cols-4 p-3 text-[#777777]"><span>XL</span><span>42–44</span><span>36–38</span><span>42–44</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LegalPage({ title }: { title: string }) {
  return (
    <div className="py-16 bg-white min-h-[70vh]">
      <div className="luxora-container max-w-3xl">
        <h1 className="text-3xl font-serif font-bold text-[#111111] mb-6">{title}</h1>
        <p className="text-sm text-[#777777] leading-relaxed">
          At Luxora, we prioritize your data privacy, transparent business terms, and encrypted transactional security. For inquiries regarding our privacy policy or terms of service, please contact legal@luxora.com.
        </p>
      </div>
    </div>
  );
}
