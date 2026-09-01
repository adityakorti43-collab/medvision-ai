import React from 'react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <div className="text-center max-w-xl mx-auto mb-9 sm:mb-11">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight"
      >
        Got an X-ray? Let's take a look. 🩻
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed"
      >
        Upload a chest X-ray and let MedVision AI screen it for signs associated with pneumonia.
      </motion.p>
    </div>
  );
};
