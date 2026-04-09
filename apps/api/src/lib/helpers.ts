import { Response } from 'express';
import { logger } from './logger';

export function apiSuccess<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ success: true, data });
}

export function apiError(res: Response, error: string, status = 500, code?: string): void {
  logger.error('API Error', { error, status, code });
  res.status(status).json({ success: false, error, ...(code && { code }) });
}
