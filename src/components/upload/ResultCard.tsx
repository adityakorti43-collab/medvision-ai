import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import type { AnalysisResult } from '../../types';

interface ResultCardProps {
  result: AnalysisResult;
  previewUrl: string;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, previewUrl, onReset }) => {
  const isNormal = result.prediction === 'NORMAL';
  const confidenceLabel = `${result.confidence.toFixed(2)}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
          <img src={previewUrl} alt="Analyzed X-ray" className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 w-full text-center sm:text-left">
          <p className="text-[11px] font-medium tracking-[0.18em] text-slate-500 uppercase">
            AI screening result
          </p>

          <div
            className={`mt-2 inline-flex items-center gap-2 ${
              isNormal ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isNormal ? (
              <CheckCircle2 className="w-6 h-6" strokeWidth={1.75} />
            ) : (
              <AlertTriangle className="w-6 h-6" strokeWidth={1.75} />
            )}
            <span className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              {result.prediction}
            </span>
          </div>

          <p className="text-slate-400 text-sm mt-1">{confidenceLabel} confidence</p>

          <p className="text-slate-300 text-sm mt-4 max-w-md leading-relaxed">
            {isNormal
              ? `The model classified this X-ray as NORMAL with ${confidenceLabel} confidence.`
              : `The model detected patterns associated with PNEUMONIA with ${confidenceLabel} confidence.`}
          </p>

          <button
            onClick={onReset}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Analyze another X-ray
          </button>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/[0.06]">
        <p className="text-xs text-slate-500 leading-relaxed">
          MedVision AI is an AI-based screening tool and is not a medical diagnosis. Results should be
          reviewed by a qualified healthcare professional.
        </p>
      </div>
    </motion.div>
  );
};
