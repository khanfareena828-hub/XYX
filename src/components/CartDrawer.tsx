import React from 'react';
import { X, Trash2, ShieldCheck, ArrowRight, Lock, Award } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.edition.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#141416] border-l border-white/10 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#18181B]">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
                Private Portfolio
              </span>
              <h3 className="font-serif text-xl text-[#EDE8E0] font-light">
                Reserved Timepieces ({items.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8E8A82] hover:text-[#EDE8E0] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="w-12 h-12 rounded-full border border-white/10 mx-auto flex items-center justify-center text-[#8E8A82]">
                  <Award className="w-6 h-6" />
                </div>
                <p className="text-sm text-[#8E8A82] font-serif">
                  Your portfolio allocation bag is empty.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#1B1B1E] text-[#C5A059] border border-white/10 text-[10px] uppercase tracking-[0.2em] hover:bg-[#C5A059] hover:text-[#0B0B0C] transition-all rounded-xs cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#1B1B1E] border border-white/5 rounded-xs space-y-3"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.edition.image}
                      alt={item.edition.name}
                      className="w-16 h-16 object-cover rounded-xs border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-base text-[#EDE8E0] font-light truncate">
                          {item.edition.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-[#8E8A82] hover:text-red-400 p-0.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-[#8E8A82] font-mono mt-0.5">
                        {item.edition.reference}
                      </p>
                      <div className="font-serif text-base text-[#C5A059] font-light mt-1">
                        ${item.edition.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Customization Details */}
                  <div className="pt-2 border-t border-white/5 text-[10px] text-[#8E8A82] space-y-1">
                    {item.customEngraving && (
                      <div className="flex justify-between">
                        <span>Caseback Inscription:</span>
                        <span className="text-[#EDE8E0] font-mono">"{item.customEngraving}"</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Wrist Fit Setting:</span>
                      <span className="text-[#EDE8E0]">{item.wristSizeMm} mm</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#18181B] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#8E8A82]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#EDE8E0]">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#8E8A82]">
                  <span>Armored Courier Transit</span>
                  <span className="text-[#C5A059] uppercase tracking-wider text-[10px]">Complimentary</span>
                </div>
                <div className="flex justify-between text-[#8E8A82]">
                  <span>Besançon Certification</span>
                  <span className="text-[#C5A059] uppercase tracking-wider text-[10px]">Included</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-serif text-xl text-[#EDE8E0]">
                  <span>Total Acquisition</span>
                  <span className="text-[#C5A059] font-light">${total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-4 bg-[#C5A059] hover:bg-[#E5C384] text-[#0B0B0C] text-[11px] uppercase tracking-[0.22em] font-semibold transition-all rounded-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Private Settlement</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8E8A82]">
                <Lock className="w-3 h-3 text-[#C5A059]" />
                <span>Encrypted Swiss Wire / Private Salon Escrow</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
