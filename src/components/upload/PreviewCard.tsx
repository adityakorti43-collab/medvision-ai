import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface PreviewCardProps {
  previewUrl: string;
  fileName: string;
  fileSizeLabel: string;
  onAnalyze: () => void;
  onChangeFile: () => void;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  previewUrl,
  fileName,
  fileSizeLabel,
  onAnalyze,
  onChangeFile,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row gap-6 items-center">
        <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
          <img src={previewUrl} alt="Selected X-ray preview" className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 w-full text-center sm:text-left">
          <p className="text-white font-medium truncate">{fileName}</p>
          <p className="text-slate-500 text-sm mt-0.5">{fileSizeLabel}</p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-5">
            <button
              onClick={onAnalyze}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-semibold text-sm hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-[0_0_20px_rgba(39,211,242,0.25)] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Analyze X-ray
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              onClick={onChangeFile}
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-slate-400 hover:text-white text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Choose a different file
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
