import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoIcon from '../../assets/medvision-icon.png';

interface IntroSequenceProps {
  onComplete: () => void;
}

const SESSION_KEY = 'medvision_intro_seen';

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenIntro = sessionStorage.getItem(SESSION_KEY);

    if (hasSeenIntro || prefersReducedMotion) {
      onComplete();
      return;
    }

    const timers = [
      window.setTimeout(() => setPhase(1), 150), // logo materializes
      window.setTimeout(() => setPhase(2), 950), // scan line + text
      window.setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, 'true');
        onComplete();
      }, 2500),
    ];

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.45 } }}
        className="fixed inset-0 z-50 bg-[#05070A] flex flex-col items-center justify-center overflow-hidden select-none"
      >
        {/* Subtle ambient texture */}
        <div className="absolute inset-0 grid-texture opacity-[0.12] pointer-events-none" />

        {/* Ambient glow pulse */}
        <motion.div
          animate={{ scale: [0.85, 1.05, 1], opacity: [0.12, 0.3, 0.18] }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
          className="absolute w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, filter: 'blur(8px)' }}
          animate={phase >= 1 ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative flex flex-col items-center"
        >
          <div className="relative">
            <img
              src={logoIcon}
              alt="MedVision AI"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain relative z-10"
            />
            {phase >= 2 && (
              <motion.div
                initial={{ top: '-8%' }}
                animate={{ top: '108%' }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_10px_#27D3F2] z-20 pointer-events-none"
              />
            )}
          </div>

          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-5 text-center"
              >
                <h1 className="font-display font-semibold text-xl sm:text-2xl text-white tracking-tight">
                  MedVision <span className="text-cyan-400">AI</span>
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 tracking-wide">
                  AI-powered chest X-ray screening
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
