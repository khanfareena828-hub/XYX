import React, { useState } from 'react';
import { WatchEdition, CartItem } from './types';
import { WATCH_EDITIONS } from './data/watches';
import { Navbar } from './components/Navbar';
import { WatchHero } from './components/WatchHero';
import { ComplicationStudio } from './components/ComplicationStudio';
import { TimepieceCollection } from './components/TimepieceCollection';
import { CalibreShowcase } from './components/CalibreShowcase';
import { WristFitSimulator } from './components/WristFitSimulator';
import { HeritageSection } from './components/HeritageSection';
import { ReservationModal } from './components/ReservationModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

export function App() {
  // Active watch edition displayed in 3D hero and studio
  const [selectedEdition, setSelectedEdition] = useState<WatchEdition>(WATCH_EDITIONS[0]);

  // Reservation Modal state
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservationEdition, setReservationEdition] = useState<WatchEdition | null>(null);
  const [preselectedCity, setPreselectedCity] = useState('Geneva');

  // Cart / Portfolio Bag state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Smooth navigation to sections
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open reservation modal for an edition
  const handleOpenReservation = (edition: WatchEdition, city = 'Geneva') => {
    setReservationEdition(edition);
    setPreselectedCity(city);
    setIsReservationOpen(true);
  };

  // Add to Cart
  const handleAddToCart = (edition: WatchEdition, customEngraving: string, wristSizeMm: number) => {
    setCartItems((prev) => [
      ...prev,
      {
        edition,
        customEngraving,
        wristSizeMm,
        quantity: 1,
      },
    ]);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    // Open reservation for the primary item in cart
    if (cartItems.length > 0) {
      setIsCartOpen(false);
      handleOpenReservation(cartItems[0].edition);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#EDE8E0] selection:bg-[#C5A059] selection:text-[#0B0B0C]">
      {/* Fixed Luxury Header */}
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onBookSalon={() => handleOpenReservation(selectedEdition, 'Geneva')}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Sections */}
      <main>
        {/* Cinematic 3D Watch Hero Section */}
        <WatchHero
          selectedEdition={selectedEdition}
          onSelectEdition={setSelectedEdition}
          onOpenReservation={(ed) => handleOpenReservation(ed)}
          onExploreComplication={() => handleNavigateSection('3d-atelier-section')}
        />

        {/* Interactive 3D Complication & Exploded Calibre Studio */}
        <ComplicationStudio
          edition={selectedEdition}
          onSelectEdition={setSelectedEdition}
          onReserve={(ed) => handleOpenReservation(ed)}
        />

        {/* Curated Timepiece Collection */}
        <TimepieceCollection
          onSelectEdition={(ed) => {
            setSelectedEdition(ed);
          }}
          onReserve={(ed) => handleOpenReservation(ed)}
        />

        {/* Horological Engineering & Calibre 9820-T Anatomy */}
        <CalibreShowcase />

        {/* Ergonomic Wrist Proportion & Fit Simulator */}
        <WristFitSimulator edition={selectedEdition} />

        {/* Atelier Heritage & International Salons */}
        <HeritageSection
          onBookSalon={(city) => handleOpenReservation(selectedEdition, city)}
        />
      </main>

      {/* Luxury Brand Footer */}
      <Footer />

      {/* VIP Reservation & Bespoke Inscription Modal */}
      <ReservationModal
        edition={reservationEdition}
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        onAddToCart={handleAddToCart}
        preselectedCity={preselectedCity}
      />

      {/* Private Portfolio Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default App;
