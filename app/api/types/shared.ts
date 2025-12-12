export type ModelConfig = {
  API_KEY: string;
  MODEL_ID?: string; // Actual model ID for Heroku API (e.g., 'claude-4-5-sonnet')
} & (
  | { INFERENCE_URL: string; DIFFUSION_URL?: never }
  | { DIFFUSION_URL: string; INFERENCE_URL?: never }
);

export interface ErrorResponse {
  code: number;
  error: string;
  expiresIn?: number;
  message: string;
  details?: string;
}
