import { NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * API response helpers
 * Standardized response formatting
 */

interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Create a success response
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Create an error response
 */
export function apiError(
  error: string,
  status = 500,
  code?: string
): NextResponse<ApiErrorResponse> {
  logger.error('API Error', { error, status, code });
  return NextResponse.json({ success: false, error, code }, { status });
}

/**
 * Handle async API route errors
 */
export async function withErrorHandling<T>(
  handler: () => Promise<NextResponse<ApiResponse<T>>>,
  context?: string
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    return await handler();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unhandled API error', {
      context,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return apiError('Internal server error', 500);
  }
}
