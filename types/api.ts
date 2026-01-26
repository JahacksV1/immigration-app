/**
 * API types
 */

// Standard API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Error response
export interface ApiError {
  error: string;
  code: string;
  details?: unknown;
}

// Stripe types
export interface CreateCheckoutSessionRequest {
  documentId: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}
