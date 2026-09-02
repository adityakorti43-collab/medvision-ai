import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

interface AnalyzingStateProps {
  previewUrl: string;
}

export const AnalyzingState: React.FC<AnalyzingStateProps> = ({
  previewUrl,
}) => {
  const [isWakingUp, setIsWakingUp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWakingUp(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-cyan-400/15 bg-white/[0.02] p-6 sm:p-8 flex flex-col items-center text-center"
    >
      {/* X-RAY PREVIEW */}
      <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-xl overflow-hidden bg-black/40 border border-white/10">
        <img
          src={previewUrl}
          alt="X-ray being analyzed"
          className="w-full h-full object-contain opacity-80"
        />

        <motion.div
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_10px_#27D3F2]"
        />
      </div>

      {/* ICON */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-5 w-10 h-10 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center"
      >
        {isWakingUp ? (
          <Sparkles className="w-5 h-5 text-cyan-300" />
        ) : (
          <Brain className="w-5 h-5 text-cyan-300" />
        )}
      </motion.div>

      {/* MAIN MESSAGE */}
      <motion.p
        key={isWakingUp ? 'waking' : 'analyzing'}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-white font-medium"
      >
        {isWakingUp
          ? 'Waking up MedVision AI…'
          : 'Analyzing the X-ray…'}
      </motion.p>

      {/* DESCRIPTION */}
      <motion.p
        key={isWakingUp ? 'waking-description' : 'analyzing-description'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-slate-500 text-sm mt-1 max-w-sm"
      >
        {isWakingUp
          ? 'The AI may take a little longer on the first analysis.'
          : 'Checking the image for patterns associated with pneumonia.'}
      </motion.p>

      {/* SUBTLE STATUS */}
      <div className="flex items-center gap-1.5 mt-4">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
          }}
          className="w-1.5 h-1.5 rounded-full bg-cyan-300"
        />

        <span className="text-slate-600 text-xs">
          {isWakingUp ? 'Starting AI services' : 'Processing image'}
        </span>
      </div>
    </motion.div>
  );
};