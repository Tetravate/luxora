import { HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';

export function AccountSupport() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-[#E7E3DC] pb-6">
        <h2 className="text-2xl font-serif font-bold text-[#111111] mb-1">Customer Support</h2>
        <p className="text-sm text-[#777777]">We're here to help. Find answers or contact us.</p>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="How can we help you?" 
          className="w-full px-6 py-4 rounded-2xl bg-[#F7F5F1] border border-transparent focus:border-[#E7E3DC] focus:bg-white outline-none text-sm font-medium transition-colors"
        />
        <button className="absolute right-2 top-2 bottom-2 px-6 bg-[#111111] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: MessageSquare, title: 'Live Chat', desc: 'Available 24/7 for immediate assistance' },
          { icon: Mail, title: 'Email Support', desc: 'We typically reply within 24 hours' },
          { icon: Phone, title: 'Call Us', desc: '+1 (800) 123-4567\nMon-Fri, 9am-6pm EST' },
        ].map((contact, idx) => (
          <div key={idx} className="p-6 rounded-3xl border border-[#E7E3DC] text-center hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 bg-[#F7F5F1] rounded-full flex items-center justify-center mx-auto mb-4 text-[#111111]">
              <contact.icon size={20} />
            </div>
            <h3 className="font-bold text-[#111111] mb-1">{contact.title}</h3>
            <p className="text-xs text-[#777777] whitespace-pre-line">{contact.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-[#111111]">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {[
            'What is your return policy?',
            'How do I track my order?',
            'Do you ship internationally?',
            'How can I cancel or change my order?',
          ].map((faq, idx) => (
            <button key={idx} className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#E7E3DC] bg-white hover:bg-[#F7F5F1] transition-colors text-left">
              <span className="font-semibold text-sm text-[#111111]">{faq}</span>
              <HelpCircle size={16} className="text-[#777777]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
