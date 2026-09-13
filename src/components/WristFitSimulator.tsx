import React, { useState } from 'react';
import { Ruler, CheckCircle2, Sliders, Shield } from 'lucide-react';
import { WatchEdition } from '../types';

interface WristFitSimulatorProps {
  edition: WatchEdition;
}

export const WristFitSimulator: React.FC<WristFitSimulatorProps> = ({ edition }) => {
  const [wristSize, setWristSize] = useState<number>(175); // mm

  // Calculations for 41.0mm case with 48.5mm lug-to-lug
  const wristWidthApprox = (wristSize / Math.PI) * 1.15; // approximate top wrist width in mm
  const lugToLug = 48.5; // mm
  const caseDiameter = 41.0; // mm
  const overhang = lugToLug > wristWidthApprox;
  const bufferMm = Math.max(0, Math.round((wristWidthApprox - lugToLug) / 2));

  // Recommended strap sizing
  const getSizingAdvice = (size: number) => {
    if (size < 160) {
      return {
        fit: 'Snug / Petite Fit',
        links: 'Remove 3 bracelet links',
        hole: '1st or 2nd notch (Small Strap Available)',
      };
    } else if (size <= 180) {
      return {
        fit: 'Ideal Golden Ratio Proportion',
        links: 'Standard factory sizing or remove 1 link',
        hole: '3rd or 4th central notch (Standard Strap)',
      };
    } else {
      return {
        fit: 'Substantial / Masculine Fit',
        links: 'Add 1 complimentary extension link',
        hole: '5th or 6th notch (XL Strap Available)',
      };
    }
  };

  const advice = getSizingAdvice(wristSize);

  return (
    <section aria-label="Wrist Proportion Simulator" className="py-20 bg-[#0B0B0C] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Ergonomic Architectural Ratio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#EDE8E0] font-light">
            Wrist Proportion & <span className="italic font-normal gold-gradient-text">Fit Simulator</span>
          </h2>
          <p className="text-xs text-[#8E8A82] leading-relaxed">
            Preview how the 41.0mm case architecture and sculpted 48.5mm lug-to-lug silhouette contour around your exact wrist anatomy.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#141416] border border-white/10 p-6 sm:p-10 rounded-xs space-y-8">
          
          {/* Slider Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#EDE8E0] font-medium">
                  Your Wrist Circumference
                </span>
              </div>
              <div className="font-mono text-xl text-[#C5A059] font-medium">
                {wristSize} mm <span className="text-xs text-[#8E8A82]">({(wristSize / 25.4).toFixed(1)}")</span>
              </div>
            </div>

            <input
              type="range"
              min="150"
              max="210"
              step="2"
              value={wristSize}
              onChange={(e) => setWristSize(parseInt(e.target.value))}
              className="w-full accent-[#C5A059] bg-[#252528] h-2 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] uppercase tracking-wider text-[#8E8A82]">
              <span>150mm (5.9")</span>
              <span>175mm Standard (6.9")</span>
              <span>210mm (8.3")</span>
            </div>
          </div>

          {/* Visual Silhouette Canvas Representation */}
          <div className="p-6 bg-[#0B0B0C] border border-white/5 rounded-xs flex flex-col items-center justify-center space-y-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#8E8A82]">
              Cross-Sectional Proportion Map
            </div>

            {/* Scale visualization bar */}
            <div className="w-full max-w-md h-24 relative flex items-center justify-center border-b border-white/10">
              {/* Wrist Width Base */}
              <div
                className="h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-between px-3 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(55, (wristWidthApprox / 75) * 100))}%` }}
              >
                <span className="text-[9px] text-[#8E8A82] font-mono">Wrist Margin</span>
                <span className="text-[9px] text-[#8E8A82] font-mono">Wrist Margin</span>
              </div>

              {/* Watch Case overlay */}
              <div
                className="absolute h-14 w-28 bg-[#C5A059]/20 border-2 border-[#C5A059] rounded-md flex flex-col items-center justify-center shadow-lg shadow-[#C5A059]/10"
              >
                <span className="text-[10px] font-semibold text-[#EDE8E0] font-mono">41.0 mm</span>
                <span className="text-[8px] text-[#C5A059] uppercase tracking-wider">AURA Case</span>
              </div>
            </div>

            {/* Proportional verdict */}
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[#EDE8E0]">
                {overhang
                  ? 'Prominent presence. Downward-angled lugs ensure comfortable drape.'
                  : `Ideal ergonomic balance: ${bufferMm}mm margin on both sides of the wrist.`}
              </span>
            </div>
          </div>

          {/* Sizing Recommendations Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-[#1B1B1E] border border-white/5 rounded-xs space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#8E8A82] block">Proportion Category</span>
              <span className="text-xs text-[#C5A059] font-medium block">{advice.fit}</span>
            </div>
            <div className="p-4 bg-[#1B1B1E] border border-white/5 rounded-xs space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#8E8A82] block">Strap Notch Setting</span>
              <span className="text-xs text-[#EDE8E0] font-medium block">{advice.hole}</span>
            </div>
            <div className="p-4 bg-[#1B1B1E] border border-white/5 rounded-xs space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#8E8A82] block">Metal Bracelet Links</span>
              <span className="text-xs text-[#EDE8E0] font-medium block">{advice.links}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
