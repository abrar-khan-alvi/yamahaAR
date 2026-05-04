'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Sparkles } from 'lucide-react';

interface PriceRevealProps {
  regularPrice: string;
  offerPrice: string;
  onBookInterest: () => void;
}

export default function PriceReveal({ regularPrice, offerPrice, onBookInterest }: PriceRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative">
      {!isRevealed ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsRevealed(true)}
          className="w-full py-4 bg-gradient-to-r from-[#005BAC] to-[#0070d6] rounded-xl font-bold text-white flex items-center justify-center gap-3 shadow-lg shadow-[#005BAC]/20 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
          <Tag size={18} />
          REVEAL EID OFFER PRICE
        </motion.button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Regular MRP</p>
              <p className="text-neutral-400 line-through text-lg font-medium">{regularPrice}</p>
            </div>
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-right"
            >
              <div className="flex items-center justify-end gap-1 text-[#005BAC]">
                <Sparkles size={12} className="animate-pulse" />
                <p className="text-[10px] uppercase tracking-widest font-black">EID OFFER PRICE</p>
              </div>
              <p className="text-3xl font-black text-white tracking-tighter">{offerPrice}</p>
            </motion.div>
          </div>

          <button 
            onClick={onBookInterest}
            className="w-full py-4 bg-white text-black rounded-xl font-black text-sm tracking-widest hover:bg-neutral-200 transition-all uppercase"
          >
            Book an Interest
          </button>
        </motion.div>
      )}
    </div>
  );
}
