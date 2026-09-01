import type { AnalysisResult, Prediction } from '../types';

const PREDICT_URL =
  "https://medvision-ai-backend-771q.onrender.com/predict";

/** Friendly, user-facing error. */
export class AnalysisError extends Error {}

function isPrediction(value: unknown): value is Prediction {
  return value === 'NORMAL' || value === 'PNEUMONIA';
}

/**
 * Sends the given chest X-ray file to the MedVision AI backend.
 */
export async function analyzeXray(
  file: File
): Promise<AnalysisResult> {

  const formData = new FormData();

  formData.append('file', file);

  let response: Response;

  // ==========================================
  // SEND REQUEST
  // ==========================================

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


  // ==========================================
  // HANDLE BACKEND ERRORS
  // ==========================================

  if (!response.ok) {

    let errorMessage =
      'Something went wrong while analyzing the X-ray. Please try again.';

    try {

      const errorData = await response.json();

      if (
        errorData &&
        typeof errorData === 'object' &&
        'detail' in errorData &&
        typeof (
          errorData as Record<string, unknown>
        ).detail === 'string'
      ) {

        errorMessage =
          (errorData as Record<string, unknown>)
            .detail as string;

      }

    } catch {
      // Keep the default error message
    }

    throw new AnalysisError(errorMessage);
  }


  // ==========================================
  // READ SUCCESS RESPONSE
  // ==========================================

  let data: unknown;

  try {

    data = await response.json();

  } catch {

    throw new AnalysisError(
      'Received an unexpected response from the AI. Please try again.'
    );

  }


  // ==========================================
  // VALIDATE RESPONSE
  // ==========================================

  if (
    !data ||
    typeof data !== 'object' ||
    !('prediction' in data) ||
    !('confidence' in data) ||
    !isPrediction(
      (data as Record<string, unknown>).prediction
    ) ||
    typeof (
      data as Record<string, unknown>
    ).confidence !== 'number'
  ) {

    throw new AnalysisError(
      'Received an unexpected response from the AI. Please try again.'
    );

  }


  // ==========================================
  // PARSED RESULT
  // ==========================================

  const parsed = data as {
    prediction: Prediction;
    confidence: number;
    filename?: string;
    message?: string;
  };


  // ==========================================
  // RETURN RESULT
  // ==========================================

  return {

    prediction: parsed.prediction,

    confidence: Math.max(
      0,
      Math.min(100, parsed.confidence)
    ),

    filename: parsed.filename ?? file.name,

    message: parsed.message ?? '',

  };
}