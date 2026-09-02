import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  ScanLine,
} from 'lucide-react';
import type { AnalysisResult } from '../../types';

interface ResultCardProps {
  result: AnalysisResult;
  previewUrl: string;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  previewUrl,
  onReset,
}) => {
  const isNormal = result.prediction === 'NORMAL';
  const confidence = Math.max(0, Math.min(100, result.confidence));
  const confidenceLabel = `${confidence.toFixed(2)}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full rounded-3xl border border-white/10 bg-white/[0.025] overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 sm:px-7 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2 h-2 rounded-full ${
              isNormal ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />

          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
            AI screening complete
          </span>
        </div>

        <ScanLine className="w-4 h-4 text-slate-600" strokeWidth={1.5} />
      </div>

      <div className="p-5 sm:p-7">
        {/* Main result area */}
        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6 sm:gap-7 items-center">
          
          {/* X-ray */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative w-44 h-44 sm:w-[180px] sm:h-[180px] mx-auto rounded-2xl overflow-hidden bg-black/50 border border-white/10"
          >
            <img
              src={previewUrl}
              alt="Analyzed chest X-ray"
              className="w-full h-full object-contain"
            />

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            <div className="absolute bottom-2.5 left-2.5 right-2.5">
              <span className="inline-flex px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[9px] tracking-wider uppercase text-slate-400">
                Analyzed X-ray
              </span>
            </div>
          </motion.div>

          {/* Result */}
          <div className="text-center sm:text-left">
            <p className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-medium">
              AI screening result
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
              className="mt-2 flex items-center justify-center sm:justify-start gap-3"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center ${
                  isNormal
                    ? 'bg-emerald-400/10 border border-emerald-400/20'
                    : 'bg-amber-400/10 border border-amber-400/20'
                }`}
              >
                {isNormal ? (
                  <CheckCircle2
                    className="w-6 h-6 text-emerald-400"
                    strokeWidth={1.7}
                  />
                ) : (
                  <AlertTriangle
                    className="w-6 h-6 text-amber-400"
                    strokeWidth={1.7}
                  />
                )}
              </div>

              <span
                className={`text-4xl sm:text-5xl font-display font-bold tracking-tight ${
                  isNormal ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {result.prediction}
              </span>
            </motion.div>

            {/* Confidence */}
            <div className="mt-5 max-w-md mx-auto sm:mx-0">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Model confidence
                  </p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`text-2xl font-semibold mt-0.5 ${
                      isNormal ? 'text-emerald-300' : 'text-amber-300'
                    }`}
                  >
                    {confidenceLabel}
                  </motion.p>
                </div>

                <span className="text-[10px] text-slate-600 pb-1">
                  AI score
                </span>
              </div>

              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{
                    delay: 0.35,
                    duration: 1,
                    ease: 'easeOut',
                  }}
                  className={`h-full rounded-full ${
                    isNormal ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className={`mt-7 rounded-2xl border p-5 ${
            isNormal
              ? 'border-emerald-400/10 bg-emerald-400/[0.035]'
              : 'border-amber-400/10 bg-amber-400/[0.035]'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isNormal ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}

            <span className="text-xs font-semibold text-white">
              What the AI found
            </span>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            {isNormal
              ? `The model classified this chest X-ray as NORMAL with ${confidenceLabel} confidence.`
              : `The model detected patterns associated with PNEUMONIA with ${confidenceLabel} confidence.`}
          </p>
        </motion.div>

        {/* Disclaimer */}
        <div className="mt-5 flex gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-4">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />

          <div>
            <p className="text-xs font-medium text-slate-400">
              Important
            </p>

            <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
              MedVision AI is an AI-based screening tool and is not a medical
              diagnosis. Results should be reviewed by a qualified healthcare
              professional.
            </p>
          </div>
        </div>

        {/* Action */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-medium border border-white/10 hover:border-white/20 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Analyze another X-ray
        </motion.button>
      </div>
    </motion.div>
  );
};