'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import PriceReveal from './PriceReveal';
import LeadForm from './LeadForm';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { Bike } from '@/lib/bikeData';

interface BikeDetailsProps {
  selectedBike: Bike | null;
  onClose: () => void;
  onEnterAR: () => void;
}

export default function BikeDetails({ selectedBike, onClose, onEnterAR }: BikeDetailsProps) {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const { track } = useAnalytics();

  if (!selectedBike) return null;

  const handleEnterAR = () => {
    track('ar_start', { model: selectedBike.name });
    onEnterAR();
  };

  const handleBookInterest = () => {
    track('form_open', { model: selectedBike.name });
    setIsLeadFormOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          key={selectedBike.id}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-full max-w-sm bg-neutral-950/95 backdrop-blur-2xl z-50 border-l border-white/10 flex flex-col pointer-events-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-5 left-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-10"
          >
            <X size={18} />
          </button>

          <div className="flex-1 overflow-y-auto pt-14 px-6 pb-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <span className="text-[#005BAC] text-[10px] font-black tracking-[0.35em] uppercase">
                Yamaha {selectedBike.category}
              </span>
              <h2 className="text-3xl font-black text-white mt-1 tracking-tight">{selectedBike.name}</h2>
            </motion.div>

            <div className="mt-6 space-y-5">
              {/* Specs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">Engine</p>
                  <p className="text-white font-semibold mt-1 text-sm">{selectedBike.specs.engine}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">Power</p>
                  <p className="text-white font-semibold mt-1 text-sm">{selectedBike.specs.power}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">Torque</p>
                  <p className="text-white font-semibold mt-1 text-sm">{selectedBike.specs.torque}</p>
                </div>
                {selectedBike.specs.abs && (
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold">ABS</p>
                    <p className="text-white font-semibold mt-1 text-sm">{selectedBike.specs.abs}</p>
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-3">Key Features</p>
                <ul className="space-y-2">
                  {selectedBike.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-neutral-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#005BAC] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Color options */}
              {selectedBike.colors.length > 0 && (
                <div>
                  <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-3">
                    Color Options
                  </p>
                  <div className="flex items-center gap-3">
                    {selectedBike.colors.map((c, i) => (
                      <button
                        key={c.hex}
                        onClick={() => setActiveColorIndex(i)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          activeColorIndex === i
                            ? 'border-white scale-110'
                            : 'border-white/20 hover:border-white/50'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  <p className="text-neutral-500 text-xs mt-2">
                    {selectedBike.colors[activeColorIndex]?.name}
                  </p>
                </div>
              )}

              {/* Price reveal */}
              <PriceReveal
                regularPrice={selectedBike.prices.regular}
                offerPrice={selectedBike.prices.offer}
                onBookInterest={handleBookInterest}
              />
            </div>
          </div>

          {/* AR button */}
          <div className="p-5 border-t border-white/10 flex-shrink-0">
            <button
              onClick={handleEnterAR}
              className="w-full bg-[#005BAC] text-white py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-[#0070d6] transition-all shadow-xl shadow-[#005BAC]/20 uppercase active:scale-[0.98]"
            >
              <Camera size={18} />
              Launch AR Experience
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <LeadForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        bikeName={selectedBike.name}
      />
    </>
  );
}
