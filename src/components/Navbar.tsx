import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ShoppingBag,
  Volume2,
  VolumeX,
  Calendar,
  Compass,
  Award,
} from 'lucide-react';
import { horologyAudio } from '../utils/audio';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onBookSalon: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onBookSalon,
  onNavigateSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    horologyAudio.setMuted(next);
  };

  const navLinks = [
    { label: 'Timepieces', id: 'collection-section' },
    { label: '3D Atelier', id: '3d-atelier-section' },
    { label: 'Calibre 9820-T', id: 'calibre-section' },
    { label: 'Heritage', id: 'heritage-section' },
    { label: 'Salons', id: 'salons-section' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0B0C]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Monogram & Wordmark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full border border-[#C5A059]/40 flex items-center justify-center bg-[#C5A059]/5 group-hover:border-[#C5A059] transition-colors">
            <span className="font-serif text-sm font-semibold text-[#C5A059]">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl text-[#EDE8E0] font-light tracking-[0.25em] leading-none group-hover:text-[#C5A059] transition-colors">
              A U R A
            </span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-[#8E8A82] mt-1 font-medium">
              Haute Horlogerie • Genève
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className="text-[11px] uppercase tracking-[0.22em] text-[#8E8A82] hover:text-[#EDE8E0] hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-3">
          {/* Audio Escapement Button */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Listen to Mechanical Escapement' : 'Mute Escapement'}
            className="p-2 text-[#8E8A82] hover:text-[#C5A059] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C5A059]" />}
          </button>

          {/* Salon VIP Booking button */}
          <button
            onClick={onBookSalon}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] text-[#EDE8E0] border border-white/15 hover:border-[#C5A059] rounded-xs transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Private Salon</span>
          </button>

          {/* Allocation Bag Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-[#8E8A82] hover:text-[#EDE8E0] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            title="Portfolio Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C5A059] text-[#0B0B0C] text-[9px] font-bold flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#8E8A82] hover:text-[#EDE8E0] lg:hidden transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#141416] border-b border-white/10 px-6 py-6 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className="text-left text-xs uppercase tracking-[0.2em] text-[#8E8A82] hover:text-[#C5A059] py-2 border-b border-white/5"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onBookSalon();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#C5A059] text-[#0B0B0C] text-[10px] uppercase tracking-[0.2em] font-semibold text-center rounded-xs"
            >
              Book Private Salon Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
