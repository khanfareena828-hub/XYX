import React from 'react';
import { motion } from 'motion/react';
import { Award, Cpu, Shield, Sparkles, Hammer, CheckCircle2 } from 'lucide-react';

export const CalibreShowcase: React.FC = () => {
  const craftPoints = [
    {
      title: 'Hand-Polished Anglage & Beveling',
      subtitle: 'The Mirror of Perfection',
      description: 'Every interior angle and bridge contour is hand-beveled at an exact 45° rake using diamond paste and traditional elderberry pith wood, producing an optical mirror reflection found only in museum horology.',
      stat: '42 Hours',
      statLabel: 'Hand-finishing per movement',
    },
    {
      title: 'Côtes de Genève Waves & Perlage',
      subtitle: 'A Century of Traditional Texturing',
      description: 'The rhodium-plated German silver bridges are decorated with concentric circular graining (perlage) and straight Geneva stripes that disperse light dynamically beneath the exhibition sapphire caseback.',
      stat: '0.002mm',
      statLabel: 'Geometric stripe tolerance',
    },
    {
      title: 'Silicon Hairspring & Antimagnetism',
      subtitle: 'Immune to 15,000 Gauss Fields',
      description: 'Thermo-compensated monocrystalline silicon hairspring eliminates magnetization risks from modern smartphones and electronics, preserving chronometric accuracy of -2/+2 seconds per day.',
      stat: '15,000 Gauss',
      statLabel: 'Magnetic field immunity',
    },
    {
      title: 'Free-Sprung Gyromax Balance',
      subtitle: 'Poised with Gold Microstella Weights',
      description: 'Rather than a conventional index regulator that can shift with wrist impacts, the Calibre 9820-T regulates oscillations through four gold micro-screws threaded directly into the balance wheel rim.',
      stat: '28,800 vph',
      statLabel: '4Hz mechanical heartbeat',
    },
  ];

  return (
    <section id="calibre-section" aria-label="Calibre Engineering" className="py-20 sm:py-28 bg-[#0E0E10] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Haute Horlogerie Engineering
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#EDE8E0] font-light tracking-tight">
            Anatomy of the <span className="italic font-normal gold-gradient-text">Calibre 9820-T</span>
          </h2>
          <div className="h-[1px] w-16 bg-[#C5A059]/40 mx-auto" />
          <p className="text-xs sm:text-sm text-[#8E8A82] leading-relaxed font-sans">
            Born from over four years of research and development in our Swiss atelier. Each movement is individually numbered, hand-assembled by a master watchmaker, and subject to 16 days of observatory testing.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {craftPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 bg-[#141416] border border-white/10 hover:border-[#C5A059]/40 rounded-xs transition-all space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-medium">
                    Pillar 0{index + 1} • {point.subtitle}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#C5A059]/60" />
                </div>
                <h3 className="font-serif text-2xl text-[#EDE8E0] font-light">
                  {point.title}
                </h3>
                <p className="text-xs text-[#8E8A82] leading-relaxed font-sans">
                  {point.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8A82]">
                  {point.statLabel}
                </span>
                <span className="font-mono text-lg text-[#C5A059] font-medium">
                  {point.stat}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full-width Certification Banner */}
        <div className="mt-12 p-8 sm:p-10 bg-[#1B1B1E] border border-[#C5A059]/30 rounded-xs flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
              Observatoire de Besançon • Bulletin de Marche
            </span>
            <h4 className="font-serif text-2xl text-[#EDE8E0] font-light">
              Official Chronometer Certificate of Authenticity
            </h4>
            <p className="text-xs text-[#8E8A82] max-w-2xl leading-relaxed">
              Every AURA timepiece undergoes 384 hours of continuous chronometric testing across five different wrist positions and extreme thermal gradients (-4°C to +38°C) before being released from the manufacture.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center">
              <span className="font-serif text-3xl text-[#EDE8E0] font-light block">-2 / +2</span>
              <span className="text-[9px] uppercase tracking-wider text-[#8E8A82]">Seconds / Day</span>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="text-center">
              <span className="font-serif text-3xl text-[#C5A059] font-light block">5 Years</span>
              <span className="text-[9px] uppercase tracking-wider text-[#8E8A82]">Global Guarantee</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
