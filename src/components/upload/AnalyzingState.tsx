import React from 'react';
import { motion } from 'framer-motion';

interface AnalyzingStateProps {
  previewUrl: string;
}

export const AnalyzingState: React.FC<AnalyzingStateProps> = ({ previewUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-cyan-400/15 bg-white/[0.02] p-6 sm:p-8 flex flex-col items-center text-center"
    >
      <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-xl overflow-hidden bg-black/40 border border-white/10">
        <img src={previewUrl} alt="X-ray being analyzed" className="w-full h-full object-contain opacity-80" />
        <motion.div
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_10px_#27D3F2]"
        />
      </div>

      <p className="mt-5 text-white font-medium">Analyzing the X-ray…</p>
      <p className="text-slate-500 text-sm mt-1">This usually takes just a few seconds.</p>
    </motion.div>
  );
};
