import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Award,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Printer,
  Lock,
} from 'lucide-react';
import { WatchEdition } from '../types';

interface ReservationModalProps {
  edition: WatchEdition | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (edition: WatchEdition, engraving: string, wristSize: number) => void;
  preselectedCity?: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  edition,
  isOpen,
  onClose,
  onAddToCart,
  preselectedCity = 'Geneva',
}) => {
  if (!isOpen || !edition) return null;

  const [step, setStep] = useState<'configure' | 'confirmed'>('configure');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [salonCity, setSalonCity] = useState(preselectedCity);
  const [preferredDate, setPreferredDate] = useState('2026-09-20');
  const [customEngraving, setCustomEngraving] = useState('TEMPORA MUTANTUR');
  const [wristSize, setWristSize] = useState(175);
  const [selectedSerial, setSelectedSerial] = useState(`0${edition.availablePieces} / ${edition.limitedPieces}`);
  const [reservationCode, setReservationCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `AURA-${edition.reference.replace('Ref. ', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReservationCode(code);
    setStep('confirmed');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A059', '#E5C384', '#FFFFFF', '#141416'],
      });
    } catch {
      // Ignore if unavailable
    }
  };

  const handleAddToBag = () => {
    onAddToCart(edition, customEngraving, wristSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141416] border border-[#C5A059]/40 rounded-xs shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#18181B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
              Manufacture Private Registry
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8E8A82] hover:text-[#EDE8E0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'configure' ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Timepiece Summary */}
            <div className="flex gap-4 p-4 bg-[#0B0B0C] border border-white/5 rounded-xs">
              <img
                src={edition.image}
                alt={edition.name}
                className="w-20 h-20 object-cover rounded-xs border border-white/10 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-wider text-[#C5A059] font-mono">
                    {edition.reference}
                  </span>
                  <span className="font-serif text-lg text-[#C5A059] font-light">
                    ${edition.price.toLocaleString()}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-[#EDE8E0] font-light truncate">
                  {edition.name}
                </h3>
                <p className="text-[11px] text-[#8E8A82] mt-0.5 truncate">
                  {edition.subTitle}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-[#C5A059]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Allocation: Piece #{selectedSerial}</span>
                </div>
              </div>
            </div>

            {/* Bespoke Caseback Engraving Simulator */}
            <div className="space-y-3 p-4 bg-[#1B1B1E] border border-white/5 rounded-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-[0.18em] text-[#EDE8E0] font-medium">
                  Bespoke Caseback Engraving (Complimentary)
                </label>
                <span className="text-[10px] text-[#8E8A82]">Max 26 chars</span>
              </div>
              
              <input
                type="text"
                maxLength={26}
                value={customEngraving}
                onChange={(e) => setCustomEngraving(e.target.value.toUpperCase())}
                placeholder="E.G. AD ASTRA • 2026"
                className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-white/10 focus:border-[#C5A059] text-xs font-mono uppercase tracking-widest text-[#EDE8E0] outline-none"
              />

              {/* Live Engraving Preview */}
              <div className="p-3 bg-[#0B0B0C] border border-white/5 rounded-xs text-center">
                <span className="text-[8px] uppercase tracking-widest text-[#8E8A82] block mb-1">
                  Exhibition Caseback Perimeter Inscription
                </span>
                <div className="font-serif text-xs tracking-[0.25em] text-[#C5A059] italic">
                  * {customEngraving || 'YOUR PERSONAL MOTTO'} * NO. {selectedSerial} *
                </div>
              </div>
            </div>

            {/* Wrist Size & Delivery / Viewing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8A82] block mb-1.5">
                  Wrist Circumference
                </label>
                <select
                  value={wristSize}
                  onChange={(e) => setWristSize(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-white/10 text-xs text-[#EDE8E0] outline-none"
                >
                  <option value={160}>160mm (6.3") - Small</option>
                  <option value={175}>175mm (6.9") - Standard Medium</option>
                  <option value={190}>190mm (7.5") - Large</option>
                  <option value={205}>205mm (8.1") - Extra Large</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8E8A82] block mb-1.5">
                  Preferred Private Salon
                </label>
                <select
                  value={salonCity}
                  onChange={(e) => setSalonCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-white/10 text-xs text-[#EDE8E0] outline-none"
                >
                  <option value="Geneva">Geneva Flagship (Rue du Rhône)</option>
                  <option value="London">London Mayfair (New Bond St)</option>
                  <option value="New York">New York (Fifth Avenue)</option>
                  <option value="Tokyo">Tokyo Ginza Atelier</option>
                  <option value="Paris">Paris (Place Vendôme)</option>
                  <option value="Dubai">Dubai DIFC Gate Precinct</option>
                </select>
              </div>
            </div>

            {/* Client Credentials */}
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8E8A82] font-medium block">
                Custodian Credentials
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Full Legal Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#0B0B0C] border border-white/10 focus:border-[#C5A059] text-xs text-[#EDE8E0] outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Private Email Address"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#0B0B0C] border border-white/10 focus:border-[#C5A059] text-xs text-[#EDE8E0] outline-none"
                />
              </div>
              <input
                type="tel"
                required
                placeholder="Direct Contact Phone (with Country Code)"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0B0B0C] border border-white/10 focus:border-[#C5A059] text-xs text-[#EDE8E0] outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-4 bg-[#C5A059] hover:bg-[#E5C384] text-[#0B0B0C] text-[11px] uppercase tracking-[0.22em] font-semibold transition-all rounded-xs cursor-pointer text-center"
              >
                Confirm Allocation & Schedule Viewing
              </button>

              <button
                type="button"
                onClick={handleAddToBag}
                className="px-6 py-4 bg-[#1B1B1E] hover:bg-[#252528] text-[#EDE8E0] border border-white/15 text-[11px] uppercase tracking-[0.22em] transition-all rounded-xs cursor-pointer text-center"
              >
                Add to Portfolio Bag
              </button>
            </div>

            <p className="text-[10px] text-center text-[#8E8A82] flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-[#C5A059]" />
              Confidentiality guaranteed. All allocations strictly honored in chronological receipt.
            </p>
          </form>
        ) : (
          /* Confirmation & Certificate View */
          <div className="p-8 sm:p-10 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#C5A059]/20 border border-[#C5A059] mx-auto flex items-center justify-center text-[#C5A059]">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
                Allocation Confirmed • Registry Updated
              </span>
              <h3 className="font-serif text-3xl text-[#EDE8E0] font-light">
                Welcome to the AURA Custodians
              </h3>
              <p className="text-xs text-[#8E8A82] max-w-md mx-auto leading-relaxed">
                Your reservation for <strong className="text-[#EDE8E0]">{edition.name}</strong> has been secured under registry reference <span className="text-[#C5A059] font-mono">{reservationCode}</span>.
              </p>
            </div>

            {/* Certificate Box */}
            <div className="p-6 bg-[#0B0B0C] border border-[#C5A059]/30 rounded-xs text-left space-y-4 max-w-lg mx-auto">
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <span className="font-serif text-lg text-[#EDE8E0] font-light">
                    Certificate of Registry
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider text-[#8E8A82]">
                    Manufacture Horlogère AURA • Le Brassus
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#C5A059]">
                  {reservationCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[9px] uppercase text-[#8E8A82] block">Client Name</span>
                  <span className="text-[#EDE8E0] font-medium">{clientName || 'Valued Custodian'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-[#8E8A82] block">Serial Allocation</span>
                  <span className="text-[#C5A059] font-mono">Piece #{selectedSerial}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-[#8E8A82] block">Private Salon</span>
                  <span className="text-[#EDE8E0]">{salonCity} Salon</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-[#8E8A82] block">Engraved Inscription</span>
                  <span className="text-[#EDE8E0] italic font-serif truncate block">
                    "{customEngraving}"
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-[#1B1B1E] hover:bg-[#252528] text-[#EDE8E0] border border-white/10 text-[10px] uppercase tracking-[0.2em] transition-all rounded-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>

              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#C5A059] hover:bg-[#E5C384] text-[#0B0B0C] text-[10px] uppercase tracking-[0.2em] font-semibold transition-all rounded-xs cursor-pointer"
              >
                Return to Atelier
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
