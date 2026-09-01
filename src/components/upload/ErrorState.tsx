import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.03] p-6 sm:p-8 text-center"
    >
      <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" strokeWidth={1.75} />
      <p className="text-white font-medium mt-3">Something went wrong</p>
      <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto leading-relaxed">{message}</p>

      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Try again
      </button>
    </motion.div>
  );
};
