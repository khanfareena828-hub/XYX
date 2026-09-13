import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { WatchEdition } from '../types';
import { WATCH_EDITIONS } from '../data/watches';

interface TimepieceCollectionProps {
  onSelectEdition: (edition: WatchEdition) => void;
  onReserve: (edition: WatchEdition) => void;
}

export const TimepieceCollection: React.FC<TimepieceCollectionProps> = ({
  onSelectEdition,
  onReserve,
}) => {
  const [filter, setFilter] = useState<'all' | 'Tourbillon' | 'Grand Complication' | 'Chronograph'>('all');

  const filteredWatches = filter === 'all'
    ? WATCH_EDITIONS
    : WATCH_EDITIONS.filter((w) => w.category === filter);

  return (
    <section id="collection-section" aria-label="Timepiece Collection" className="py-20 sm:py-28 bg-[#0B0B0C] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              The Manufacture Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#EDE8E0] font-light tracking-tight">
              Curated <span className="italic font-normal gold-gradient-text">Timepieces</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#8E8A82] max-w-xl leading-relaxed">
              Every timepiece is numbered and handcrafted by a single master horologist over four months of painstaking assembly and chronometric regulation.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'Tourbillon', 'Grand Complication', 'Chronograph'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-all cursor-pointer rounded-xs border ${
                  filter === cat
                    ? 'bg-[#C5A059] text-[#0B0B0C] border-[#C5A059] font-semibold shadow-md'
                    : 'bg-[#141416] text-[#8E8A82] border-white/10 hover:border-white/20 hover:text-[#EDE8E0]'
                }`}
              >
                {cat === 'all' ? 'All Editions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredWatches.map((watch) => (
            <motion.div
              key={watch.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group bg-[#141416] border border-white/10 hover:border-[#C5A059]/40 transition-all duration-300 rounded-xs overflow-hidden flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0F0F11]">
                <img
                  src={watch.image}
                  alt={watch.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent opacity-80" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 bg-[#0B0B0C]/85 backdrop-blur-md text-[#C5A059] border border-[#C5A059]/30 font-medium">
                    {watch.badge || watch.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#EDE8E0] px-2 py-0.5 bg-black/60 backdrop-blur-md">
                    {watch.reference}
                  </span>
                </div>

                {/* Quick 3D Inspect Trigger */}
                <button
                  onClick={() => {
                    onSelectEdition(watch);
                    const el = document.getElementById('3d-atelier-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="absolute bottom-4 right-4 px-3 py-1.5 bg-[#C5A059] hover:bg-[#E5C384] text-[#0B0B0C] text-[10px] uppercase tracking-[0.2em] font-semibold transition-all rounded-xs flex items-center gap-1.5 shadow-xl cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect in 3D</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-2xl text-[#EDE8E0] font-light group-hover:text-[#C5A059] transition-colors">
                      {watch.name}
                    </h3>
                    <span className="font-serif text-2xl text-[#C5A059] font-light shrink-0">
                      ${watch.price.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#C5A059] uppercase tracking-wider font-medium">
                    {watch.subTitle}
                  </p>

                  <p className="text-xs text-[#8E8A82] leading-relaxed font-sans line-clamp-2">
                    {watch.description}
                  </p>
                </div>

                {/* Feature checklist */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  {watch.details.slice(0, 3).map((det, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-[#EDE8E0]/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                      <span className="truncate">{det}</span>
                    </div>
                  ))}
                </div>

                {/* Specifications Bar */}
                <div className="grid grid-cols-3 gap-2 py-3 bg-[#1B1B1E] border border-white/5 rounded-xs text-center">
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-[#8E8A82]">Diameter</span>
                    <span className="text-[11px] text-[#EDE8E0] font-mono">{watch.specs.diameter}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-[#8E8A82]">Reserve</span>
                    <span className="text-[11px] text-[#EDE8E0] font-mono">{watch.specs.powerReserve.split(' ')[0]}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-[#8E8A82]">Allocation</span>
                    <span className="text-[11px] text-[#C5A059] font-mono">
                      {watch.availablePieces}/{watch.limitedPieces}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onReserve(watch)}
                    className="flex-1 py-3.5 bg-[#C5A059] hover:bg-[#E5C384] text-[#0B0B0C] text-[10px] uppercase tracking-[0.2em] font-semibold transition-all rounded-xs cursor-pointer text-center"
                  >
                    Reserve Allocation
                  </button>
                  <button
                    onClick={() => {
                      onSelectEdition(watch);
                      const el = document.getElementById('3d-atelier-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-3.5 bg-[#1B1B1E] hover:bg-[#252528] text-[#EDE8E0] border border-white/10 hover:border-[#C5A059]/30 text-[10px] uppercase tracking-[0.2em] transition-all rounded-xs cursor-pointer flex items-center justify-center"
                    title="Load into 3D Studio"
                  >
                    <Eye className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
