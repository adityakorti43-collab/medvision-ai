import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
}) => {
  const isNotXray = message.toLowerCase().includes('chest x-ray');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.035] p-6 sm:p-8 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="w-14 h-14 mx-auto rounded-full bg-rose-400/10 border border-rose-400/20 flex items-center justify-center"
      >
        <AlertCircle
          className="w-7 h-7 text-rose-400"
          strokeWidth={1.75}
        />
      </motion.div>

      {/* Heading */}
      <p className="text-white font-semibold text-base mt-4">
        {isNotXray ? 'Invalid Image' : 'Unable to analyze image'}
      </p>

      {/* Message */}
      <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
        {message}
      </p>

      {/* Extra guidance for non-X-ray */}
      {isNotXray && (
        <p className="text-slate-500 text-xs mt-3 max-w-sm mx-auto">
          MedVision AI can only screen chest X-ray images.
        </p>
      )}

      {/* Retry */}
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-all duration-200 hover:border-white/20"
      >
        <RotateCcw className="w-4 h-4" />
        Try another image
      </button>
    </motion.div>
  );
};