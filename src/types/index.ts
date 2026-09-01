export type Prediction =
  | 'NORMAL'
  | 'PNEUMONIA'
  | 'UNSURE';

/** Shape of a successful response from POST /predict */
export interface AnalysisResult {
  prediction: Prediction;
  confidence: number; // 0-100
  filename: string;
  message: string;
}

export type FlowStage = 'idle' | 'preview' | 'analyzing' | 'result' | 'error';
