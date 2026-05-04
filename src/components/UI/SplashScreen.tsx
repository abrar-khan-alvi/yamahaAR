'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Simulate asset loading progress
    const steps = [30, 60, 85, 100];
    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach((target, i) => {
      timers.push(
        setTimeout(() => {
          setProgress(target);
          if (target === 100) {
            setTimeout(() => {
              setVisible(false);
              onComplete();
            }, 600);
          }
        }, 400 + i * 500)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center select-none"
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'linear-gradient(#005BAC 1px, transparent 1px), linear-gradient(90deg, #005BAC 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Radial glow */}
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(0,91,172,0.15) 0%, transparent 70%)' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex flex-col items-center gap-6"
          >
            {/* Yamaha emblem */}
            <div className="relative w-24 h-24">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-[#005BAC]/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-3 rounded-full border border-[#005BAC]/20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 relative flex items-center justify-center">
                  {/* Simplified tuning-fork cross */}
                  <div className="absolute w-0.5 h-full bg-[#005BAC] rounded-full" />
                  <div className="absolute h-0.5 w-full bg-[#005BAC] rounded-full" />
                  <div className="absolute w-5 h-5 rounded-full border-2 border-[#005BAC]/60" />
                </div>
              </div>
            </div>

            {/* Brand text */}
            <div className="text-center">
              <h1 className="text-5xl font-black text-white tracking-[0.15em]">YAMAHA</h1>
              <p className="text-[#005BAC] text-xs font-bold tracking-[0.45em] uppercase mt-2">
                Eid Offer 2025
              </p>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-neutral-600 text-[10px] tracking-[0.3em] uppercase"
            >
              Augmented Reality Experience
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-16 flex flex-col items-center gap-3 w-48"
          >
            <div className="w-full h-px bg-white/10 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="h-full bg-[#005BAC] rounded-full"
                style={{ width: '0%' }}
              />
            </div>
            <p className="text-neutral-600 text-[10px] font-medium tracking-[0.25em] uppercase">
              {progress < 100 ? 'Loading AR Assets...' : 'Ready'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
