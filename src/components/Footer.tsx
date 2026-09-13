import React, { useState } from 'react';
import { Award, ShieldCheck, Mail, ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer aria-label="Brand Footer" className="bg-[#080809] text-[#EDE8E0] border-t border-white/10 pt-16 sm:pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Newsletter & Monogram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center justify-between pb-12 border-b border-white/10">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
              Confidential Manufacture Gazette
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#EDE8E0] font-light">
              Receive First-Allocation Privileges
            </h3>
            <p className="text-xs text-[#8E8A82] max-w-md leading-relaxed">
              Subscribers receive private salon invitations and advance notice before new piece-unique tourbillon allocations are announced publicly.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#C5A059] p-4 bg-[#141416] border border-[#C5A059]/40 rounded-xs">
                <Check className="w-4 h-4" />
                <span>Your correspondence has been inscribed into our private registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  required
                  placeholder="Private Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-[#141416] border border-white/15 focus:border-[#C5A059] text-xs text-[#EDE8E0] outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C5A059] hover:bg-[#E5C384] text-[#0B0B0C] text-[10px] uppercase tracking-[0.2em] font-semibold transition-all rounded-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Inscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
              Manufacture
            </span>
            <ul className="space-y-2.5 text-[#8E8A82]">
              <li><a href="#collection-section" className="hover:text-[#EDE8E0] transition-colors">Chrono-Tourbillon 1888</a></li>
              <li><a href="#collection-section" className="hover:text-[#EDE8E0] transition-colors">Celestial Tourbillon</a></li>
              <li><a href="#collection-section" className="hover:text-[#EDE8E0] transition-colors">Tachymètre Titanium</a></li>
              <li><a href="#collection-section" className="hover:text-[#EDE8E0] transition-colors">Emerald Heritage</a></li>
              <li><a href="#calibre-section" className="hover:text-[#EDE8E0] transition-colors">Calibre 9820-T Engine</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
              Atelier & Lab
            </span>
            <ul className="space-y-2.5 text-[#8E8A82]">
              <li><a href="#3d-atelier-section" className="hover:text-[#EDE8E0] transition-colors">3D Interactive Studio</a></li>
              <li><a href="#3d-atelier-section" className="hover:text-[#EDE8E0] transition-colors">Exploded Calibre Mode</a></li>
              <li><a href="#calibre-section" className="hover:text-[#EDE8E0] transition-colors">Hand-Polished Anglage</a></li>
              <li><a href="#calibre-section" className="hover:text-[#EDE8E0] transition-colors">Besançon Certification</a></li>
              <li><a href="#heritage-section" className="hover:text-[#EDE8E0] transition-colors">Vallée de Joux Archive</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
              Private Salons
            </span>
            <ul className="space-y-2.5 text-[#8E8A82]">
              <li><a href="#salons-section" className="hover:text-[#EDE8E0] transition-colors">Geneva (Rue du Rhône)</a></li>
              <li><a href="#salons-section" className="hover:text-[#EDE8E0] transition-colors">London (Mayfair)</a></li>
              <li><a href="#salons-section" className="hover:text-[#EDE8E0] transition-colors">New York (Fifth Ave)</a></li>
              <li><a href="#salons-section" className="hover:text-[#EDE8E0] transition-colors">Tokyo (Ginza)</a></li>
              <li><a href="#salons-section" className="hover:text-[#EDE8E0] transition-colors">Dubai (DIFC)</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
              Custodian Services
            </span>
            <ul className="space-y-2.5 text-[#8E8A82]">
              <li><span className="text-[#EDE8E0]">5-Year Manufacture Warranty</span></li>
              <li><span>Bespoke Caseback Engraving</span></li>
              <li><span>Armored Courier Delivery</span></li>
              <li><span>Chronometric Recertification</span></li>
              <li><span>Private Concierge Desk</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Hallmarks */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#8E8A82]">
          <div className="flex items-center gap-3">
            <span className="font-serif text-sm text-[#C5A059] font-light">A U R A</span>
            <span>•</span>
            <span>Manufacture Horlogère Suisse • Le Brassus</span>
          </div>

          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()} AURA Horlogerie. All rights reserved.</span>
            <span>Geneva Seal Hallmarked</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
