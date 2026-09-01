import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadCard } from './upload/UploadCard';
import { PreviewCard } from './upload/PreviewCard';
import { AnalyzingState } from './upload/AnalyzingState';
import { ResultCard } from './upload/ResultCard';
import { ErrorState } from './upload/ErrorState';
import { analyzeXray, AnalysisError } from '../services/api';
import type { AnalysisResult, FlowStage } from '../types';

function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);

  if (mb >= 0.1) {
    return `${mb.toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const GENERIC_UNREACHABLE_MESSAGE =
  "Couldn't reach the AI right now. Please make sure the backend is running and try again.";

export const AnalyzerFlow: React.FC = () => {
  const [stage, setStage] = useState<FlowStage>('idle');
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelected = useCallback((file: File) => {
    setRawFile(file);

    const reader = new FileReader();

    reader.onload = (event) => {
      setPreviewUrl(
        (event.target?.result as string) ?? null
      );

      setStage('preview');
    };

    reader.readAsDataURL(file);
  }, []);

  const handleReset = useCallback(() => {
    setRawFile(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorMessage(null);
    setStage('idle');
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!rawFile) {
      return;
    }

    setStage('analyzing');

    try {
      const analysis = await analyzeXray(rawFile);

      setResult(analysis);
      setStage('result');

    } catch (err) {

      const message =
        err instanceof AnalysisError
          ? err.message
          : GENERIC_UNREACHABLE_MESSAGE;

      setErrorMessage(message);
      setStage('error');
    }

  }, [rawFile]);

  /*
   * Retry should NOT analyze the previous image again.
   *
   * Instead, completely clear the previous upload and
   * return the user to the Browse / Upload screen.
   */
  const handleRetry = useCallback(() => {
    handleReset();
  }, [handleReset]);

  return (
    <div className="w-full max-w-xl mx-auto">

      <AnimatePresence mode="wait">

        {stage === 'idle' && (
          <motion.div
            key="idle"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UploadCard
              onFileSelected={handleFileSelected}
            />
          </motion.div>
        )}

        {stage === 'preview' &&
          previewUrl &&
          rawFile && (

            <motion.div
              key="preview"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PreviewCard
                previewUrl={previewUrl}
                fileName={rawFile.name}
                fileSizeLabel={formatFileSize(rawFile.size)}
                onAnalyze={handleAnalyze}
                onChangeFile={handleReset}
              />
            </motion.div>

          )}

        {stage === 'analyzing' &&
          previewUrl && (

            <motion.div
              key="analyzing"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AnalyzingState
                previewUrl={previewUrl}
              />
            </motion.div>

          )}

        {stage === 'result' &&
          result &&
          previewUrl && (

            <motion.div
              key="result"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ResultCard
                result={result}
                previewUrl={previewUrl}
                onReset={handleReset}
              />
            </motion.div>

          )}

        {stage === 'error' && (

          <motion.div
            key="error"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ErrorState
              message={
                errorMessage ??
                GENERIC_UNREACHABLE_MESSAGE
              }
              onRetry={handleRetry}
            />
          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};