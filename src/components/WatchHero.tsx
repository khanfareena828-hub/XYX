import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Award, Sparkles, Eye, Compass } from 'lucide-react';
import { WatchEdition } from '../types';
import { WatchViewer3D } from './WatchViewer3D';
import { WATCH_EDITIONS } from '../data/watches';

interface WatchHeroProps {
  selectedEdition: WatchEdition;
  onSelectEdition: (edition: WatchEdition) => void;
  onOpenReservation: (edition: WatchEdition) => void;
  onExploreComplication: () => void;
}

export const WatchHero: React.FC<WatchHeroProps> = ({
  selectedEdition,
  onSelectEdition,
  onOpenReservation,
  onExploreComplication,
}) => {
  return (
    <section aria-label="Hero showcase" className="relative min-h-screen pt-24 pb-16 flex flex-col justify-center overflow-hidden border-b border-white/10">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Horological Narrative & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6 sm:space-y-8 z-10"
          >
            {/* Eyebrow Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-[10px] uppercase tracking-[0.25em] font-medium rounded-xs">
                <Award className="w-3 h-3" />
                Besançon Observatory Chronomètre
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8E8A82]">
                Swiss Made
              </span>
            </div>

            {/* Display Headline */}
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#EDE8E0] font-light tracking-tight leading-[1.08]">
                The Architecture of <span className="italic font-normal gold-gradient-text">Eternal Time.</span>
              </h1>
              <div className="h-[1px] w-20 bg-gradient-to-r from-[#C5A059] to-transparent mt-4" />
            </div>

            {/* Story Paragraph */}
            <p className="text-xs sm:text-sm text-[#8E8A82] leading-relaxed font-sans max-w-lg">
              Conceived in the Vallée de Joux, the <span className="text-[#EDE8E0] font-medium">{selectedEdition.name}</span> unites an open-heart 60-second gravity-defying tourbillon with a twin-barrel 72-hour power reserve, encased in hand-chamfered precious metals.
            </p>

            {/* Micro-Metrics Bar */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 py-4 border-y border-white/10">
              <div>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-[#8E8A82]">Reserve</span>
                <span className="font-serif text-lg sm:text-xl text-[#EDE8E0] font-light">72h</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-[#8E8A82]">Calibre</span>
                <span className="font-serif text-lg sm:text-xl text-[#EDE8E0] font-light">9820-T</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-[#8E8A82]">Parts</span>
                <span className="font-serif text-lg sm:text-xl text-[#EDE8E0] font-light">312</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-[#8E8A82]">Waterproof</span>
                <span className="font-serif text-lg sm:text-xl text-[#EDE8E0] font-light">100m</span>
              </div>
            </div>

            {/* Material Finish Switcher */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8E8A82] font-semibold">
                  Atelier Reference Finish:
                </span>
                <span className="text-xs text-[#C5A059] font-medium">
                  {selectedEdition.subTitle}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WATCH_EDITIONS.map((ed) => {
                  const isSelected = ed.id === selectedEdition.id;
                  return (
                    <button
                      key={ed.id}
                      onClick={() => onSelectEdition(ed)}
                      className={`p-2.5 text-left border transition-all cursor-pointer rounded-xs ${
                        isSelected
                          ? 'bg-[#1B1B1E] border-[#C5A059] shadow-lg shadow-[#C5A059]/10'
                          : 'bg-[#141416]/70 border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40 shrink-0"
                          style={{ backgroundColor: ed.materials.caseColor }}
                        />
                        <span className="text-[9px] uppercase tracking-wider text-[#8E8A82] truncate">
                          {ed.category}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-[#EDE8E0] truncate">
                        {ed.name.replace('AURA ', '')}
                      </div>
                      <div className="text-[10px] text-[#C5A059] font-mono mt-0.5">
                        ${ed.price.toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                id="hero-reserve-btn"
                onClick={() => onOpenReservation(selectedEdition)}
                className="px-8 py-4 bg-[#C5A059] hover:bg-[#E5C384] text-[#0B0B0C] text-[11px] font-semibold uppercase tracking-[0.22em] transition-all flex items-center justify-center gap-2 rounded-xs shadow-lg shadow-[#C5A059]/20 cursor-pointer"
              >
                <span>Reserve Allocation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="hero-complication-btn"
                onClick={onExploreComplication}
                className="px-6 py-4 bg-[#141416] hover:bg-[#1B1B1E] border border-white/15 hover:border-[#C5A059]/40 text-[#EDE8E0] text-[11px] font-medium uppercase tracking-[0.22em] transition-all flex items-center justify-center gap-2 rounded-xs cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Explore 3D Calibre</span>
              </button>
            </div>

            {/* Security & Allocation status */}
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-[#8E8A82]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                Piece #{selectedEdition.availablePieces} of {selectedEdition.limitedPieces} available
              </span>
              <span>•</span>
              <span>Global White-Glove Courier</span>
            </div>
          </motion.div>

          {/* Right Column: Interactive 3D Watch Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="lg:col-span-7 relative"
          >
            {/* Framing border and luxury pedestal */}
            <div className="relative rounded-xs border border-white/10 bg-[#0E0E10] shadow-2xl overflow-hidden group">
              <WatchViewer3D
                edition={selectedEdition}
                heightClass="h-[480px] sm:h-[600px] lg:h-[680px]"
                enableHotspots={true}
                enableExplodedMode={true}
                showControlsBar={true}
                initialPreset="face"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
