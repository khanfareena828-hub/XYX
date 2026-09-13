import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Layers,
  Compass,
  Cpu,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  Shield,
  Gauge,
  Sliders,
} from 'lucide-react';
import { WatchEdition } from '../types';
import { WatchViewer3D } from './WatchViewer3D';
import { HOTSPOTS, EXPLODED_LAYERS, WATCH_EDITIONS } from '../data/watches';

interface ComplicationStudioProps {
  edition: WatchEdition;
  onSelectEdition: (edition: WatchEdition) => void;
  onReserve: (edition: WatchEdition) => void;
}

export const ComplicationStudio: React.FC<ComplicationStudioProps> = ({
  edition,
  onSelectEdition,
  onReserve,
}) => {
  const [activeTab, setActiveTab] = useState<'exploded' | 'hotspots' | 'specs' | 'movement'>('exploded');

  return (
    <section
      id="3d-atelier-section"
      aria-label="3D Horological Laboratory"
      className="py-20 sm:py-28 bg-[#0E0E10] border-b border-white/10 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-18">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xs">
            Haute Horlogerie Laboratory
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#EDE8E0] font-light tracking-tight">
            Interactive 3D <span className="italic font-normal gold-gradient-text">Complication Studio</span>
          </h2>
          <div className="h-[1px] w-16 bg-[#C5A059]/40 mx-auto" />
          <p className="text-xs sm:text-sm text-[#8E8A82] leading-relaxed font-sans">
            Dissect the internal mechanical heart of the AURA Calibre 9820-T. Rotate, explode, and inspect each layer engineered to microscopic tolerances of 1/1000th of a millimeter.
          </p>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-[#141416] border border-white/10 rounded-xs gap-1 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('exploded')}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-all cursor-pointer rounded-xs flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'exploded'
                  ? 'bg-[#C5A059] text-[#0B0B0C] font-semibold'
                  : 'text-[#8E8A82] hover:text-[#EDE8E0]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Exploded Calibre</span>
            </button>

            <button
              onClick={() => setActiveTab('hotspots')}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-all cursor-pointer rounded-xs flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'hotspots'
                  ? 'bg-[#C5A059] text-[#0B0B0C] font-semibold'
                  : 'text-[#8E8A82] hover:text-[#EDE8E0]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Complication Tour</span>
            </button>

            <button
              onClick={() => setActiveTab('movement')}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-all cursor-pointer rounded-xs flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'movement'
                  ? 'bg-[#C5A059] text-[#0B0B0C] font-semibold'
                  : 'text-[#8E8A82] hover:text-[#EDE8E0]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Calibre 9820-T</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-medium transition-all cursor-pointer rounded-xs flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'bg-[#C5A059] text-[#0B0B0C] font-semibold'
                  : 'text-[#8E8A82] hover:text-[#EDE8E0]'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Technical Data</span>
            </button>
          </div>
        </div>

        {/* 3D Studio Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main 3D Viewport (8 Cols) */}
          <div className="lg:col-span-8 rounded-xs border border-white/10 bg-[#0B0B0C] overflow-hidden shadow-2xl relative">
            <WatchViewer3D
              edition={edition}
              heightClass="h-[520px] sm:h-[620px] lg:h-[720px]"
              enableHotspots={activeTab === 'hotspots'}
              enableExplodedMode={true}
              showControlsBar={true}
              initialPreset={activeTab === 'movement' ? 'back' : activeTab === 'hotspots' ? 'tourbillon' : 'face'}
            />
          </div>

          {/* Contextual Side Panel (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 bg-[#141416] border border-white/10 p-6 sm:p-8 rounded-xs">
            
            {/* Tab 1: Exploded Calibre Layers */}
            {activeTab === 'exploded' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
                    Architecture Dissection
                  </span>
                  <h3 className="font-serif text-2xl text-[#EDE8E0] font-light mt-1">
                    7 Horological Strata
                  </h3>
                  <p className="text-xs text-[#8E8A82] mt-2 leading-relaxed">
                    Click "Exploded Calibre" on the bottom control bar to separate the assembly along the Z-axis in real-time.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  {EXPLODED_LAYERS.map((layer, idx) => (
                    <div
                      key={layer.id}
                      className="p-3 bg-[#1B1B1E] border border-white/5 hover:border-[#C5A059]/30 rounded-xs transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-[#EDE8E0]">
                          <span className="text-[#C5A059] mr-2">0{idx + 1}</span>
                          {layer.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#8E8A82]">
                          {layer.thickness}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8E8A82] mt-1 pl-5">
                        {layer.material}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Hotspot Guide */}
            {activeTab === 'hotspots' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
                    Complication Guided Tour
                  </span>
                  <h3 className="font-serif text-2xl text-[#EDE8E0] font-light mt-1">
                    5 Master Inventions
                  </h3>
                  <p className="text-xs text-[#8E8A82] mt-2 leading-relaxed">
                    Select any complication below or click the numbered markers in the 3D viewer to smoothly reposition the lens.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  {HOTSPOTS.map((hs) => (
                    <div
                      key={hs.id}
                      className="p-3 bg-[#1B1B1E] border border-white/5 hover:border-[#C5A059]/40 rounded-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-[#EDE8E0]">
                          <span className="text-[#C5A059] mr-2">{hs.number}</span>
                          {hs.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8E8A82] mt-1 pl-5 line-clamp-2">
                        {hs.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Calibre 9820-T Heart */}
            {activeTab === 'movement' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
                    Internal Mechanical Engine
                  </span>
                  <h3 className="font-serif text-2xl text-[#EDE8E0] font-light mt-1">
                    Calibre 9820-T
                  </h3>
                  <p className="text-xs text-[#8E8A82] mt-2 leading-relaxed">
                    Completely developed and assembled by our master watchmakers in Le Brassus, Switzerland.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-3.5 bg-[#1B1B1E] border border-white/5 rounded-xs space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block">
                      22K Solid Gold Rotor
                    </span>
                    <p className="text-[11px] text-[#8E8A82]">
                      Bi-directional ball-bearing mounted oscillating mass engraved with celestial constellations.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#1B1B1E] border border-white/5 rounded-xs space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block">
                      Free-Sprung Gyromax Balance
                    </span>
                    <p className="text-[11px] text-[#8E8A82]">
                      Variable inertia balance wheel with gold regulation micro-weights for superior isochronism.
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#1B1B1E] border border-white/5 rounded-xs space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A059] block">
                      Twin Series Barrels
                    </span>
                    <p className="text-[11px] text-[#8E8A82]">
                      Dual mainspring barrels delivering a linear 72-hour torque curve to avoid amplitude loss.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Technical Specs Data */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
                    Horological Certified Ledger
                  </span>
                  <h3 className="font-serif text-2xl text-[#EDE8E0] font-light mt-1">
                    Technical Specifications
                  </h3>
                </div>

                <div className="divide-y divide-white/5 text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#8E8A82]">Calibre Reference</span>
                    <span className="font-mono text-[#EDE8E0]">{edition.specs.calibre}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#8E8A82]">Power Reserve</span>
                    <span className="font-mono text-[#EDE8E0]">{edition.specs.powerReserve}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#8E8A82]">Frequency</span>
                    <span className="font-mono text-[#EDE8E0]">{edition.specs.frequency}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#8E8A82]">Case Diameter</span>
                    <span className="font-mono text-[#EDE8E0]">{edition.specs.diameter}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#8E8A82]">Case Thickness</span>
                    <span className="font-mono text-[#EDE8E0]">{edition.specs.thickness}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#8E8A82]">Jewel Count</span>
                    <span className="font-mono text-[#EDE8E0]">{edition.specs.jewels} Synthetic Rubies</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#8E8A82]">Component Count</span>
                    <span className="font-mono text-[#EDE8E0]">{edition.specs.components} Pieces</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-[#8E8A82]">Water Resistance</span>
                    <span className="font-mono text-[#EDE8E0]">{edition.specs.waterResistance}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Action Footer */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#8E8A82]">Edition Price</span>
                  <div className="font-serif text-2xl text-[#C5A059] font-light">
                    ${edition.price.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => onReserve(edition)}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-[#E5C384] text-[#0B0B0C] text-[10px] uppercase tracking-[0.2em] font-semibold transition-all rounded-xs cursor-pointer shadow-md"
                >
                  Acquire Piece
                </button>
              </div>
              <p className="text-[10px] text-center text-[#8E8A82] tracking-wider">
                Complimentary bespoke engraving & 5-year manufacture warranty included
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
