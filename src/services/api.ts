import type { AnalysisResult, Prediction } from '../types';

const PREDICT_URL = "https://medvision-ai-backend-771q.onrender.com/predict";

/** Friendly, user-facing error. The message is always safe to show as-is. */
export class AnalysisError extends Error {}

function isPrediction(value: unknown): value is Prediction {
  return value === 'NORMAL' || value === 'PNEUMONIA';
}

/**
 * Sends the given chest X-ray file to the MedVision AI backend for screening.
 * The backend expects multipart/form-data with a single field named "file"
 * and responds with { message, filename, prediction, confidence }.
 */
export async function analyzeXray(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);

  let response: Response;
  try {
    response = await fetch(PREDICT_URL, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new AnalysisError(
      "Couldn't reach the AI right now. Please make sure the backend is running and try again."
    );
  }

  if (!response.ok) {
    if (response.status === 400 || response.status === 415 || response.status === 422) {
      throw new AnalysisError("That file couldn't be analyzed. Please upload a JPG, JPEG or PNG chest X-ray.");
    }
    throw new AnalysisError('Something went wrong while analyzing the X-ray. Please try again.');
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new AnalysisError('Received an unexpected response from the AI. Please try again.');
  }

  if (
    !data ||
    typeof data !== 'object' ||
    !('prediction' in data) ||
    !('confidence' in data) ||
    !isPrediction((data as Record<string, unknown>).prediction) ||
    typeof (data as Record<string, unknown>).confidence !== 'number'
  ) {
    throw new AnalysisError('Received an unexpected response from the AI. Please try again.');
  }

  const parsed = data as {
    prediction: Prediction;
    confidence: number;
    filename?: string;
    message?: string;
  };

  return {
    prediction: parsed.prediction,
    confidence: Math.max(0, Math.min(100, parsed.confidence)),
    filename: parsed.filename ?? file.name,
    message: parsed.message ?? '',
  };
}
