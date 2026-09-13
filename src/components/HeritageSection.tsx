import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Calendar, ShieldCheck, Award } from 'lucide-react';
import { SALONS } from '../data/watches';

interface HeritageSectionProps {
  onBookSalon: (city: string) => void;
}

export const HeritageSection: React.FC<HeritageSectionProps> = ({ onBookSalon }) => {
  return (
    <section id="heritage-section" aria-label="Heritage & Salons" className="py-20 sm:py-28 bg-[#0E0E10] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Heritage Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              The Manufacture Heritage • Since 1888
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#EDE8E0] font-light leading-tight">
              Forged in the Silent Snows of <span className="italic font-normal gold-gradient-text">Vallée de Joux.</span>
            </h2>
            <div className="h-[1px] w-16 bg-[#C5A059]/40" />
            <p className="text-xs sm:text-sm text-[#8E8A82] leading-relaxed font-sans">
              High in the Swiss Jura mountains, isolated by winter snowdrifts for months at a time, generations of horologists transformed patient solitude into mechanical art. AURA was founded upon a singular principle: that a mechanical chronometer should endure beyond mortal lifetimes, keeping time not by batteries or code, but by the relentless mathematics of balance springs and gravity-defying tourbillon cages.
            </p>
            <p className="text-xs sm:text-sm text-[#8E8A82] leading-relaxed font-sans">
              Today, our atelier maintains an uncompromising annual production of under 250 timepieces worldwide. Every client is welcomed into our archives as an eternal custodian of horological history.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div>
                <span className="font-serif text-3xl text-[#EDE8E0] font-light block">138</span>
                <span className="text-[9px] uppercase tracking-wider text-[#8E8A82]">Years of Heritage</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#C5A059] font-light block">&lt; 250</span>
                <span className="text-[9px] uppercase tracking-wider text-[#8E8A82]">Pieces Annually</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#EDE8E0] font-light block">100%</span>
                <span className="text-[9px] uppercase tracking-wider text-[#8E8A82]">Swiss In-House</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-xs border border-white/10 overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
                alt="Swiss Horological Watchmaker Atelier"
                className="w-full h-[450px] object-cover filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E10] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#141416]/90 border border-white/10 backdrop-blur-md">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-medium block">
                  Le Brassus Master Atelier
                </span>
                <p className="text-xs text-[#EDE8E0] mt-1 font-serif">
                  "We do not assemble parts; we choreograph balance."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Salons Grid */}
        <div id="salons-section" className="space-y-10 pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              Private Client Viewings
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#EDE8E0] font-light">
              International <span className="italic font-normal gold-gradient-text">Salons & Lounges</span>
            </h3>
            <p className="text-xs text-[#8E8A82]">
              Experience our complications firsthand with a dedicated master horologist in an intimate, secure setting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SALONS.map((salon) => (
              <div
                key={salon.city}
                className="p-6 bg-[#141416] border border-white/10 hover:border-[#C5A059]/40 rounded-xs space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-xl text-[#EDE8E0] font-light">
                      {salon.city}
                    </h4>
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#1B1B1E] text-[#C5A059] border border-white/5 font-mono">
                      By Appointment
                    </span>
                  </div>

                  <p className="text-xs text-[#C5A059] font-medium">
                    {salon.salon}
                  </p>

                  <div className="space-y-1.5 text-[11px] text-[#8E8A82]">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{salon.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>{salon.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#8E8A82] shrink-0" />
                      <span>{salon.hours}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onBookSalon(salon.city)}
                  className="w-full py-2.5 bg-[#1B1B1E] hover:bg-[#C5A059] hover:text-[#0B0B0C] text-[#EDE8E0] border border-white/10 hover:border-[#C5A059] text-[10px] uppercase tracking-[0.2em] font-medium transition-all rounded-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Request Appointment</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
