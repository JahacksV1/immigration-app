/**
 * Structured logging utility
 * Production-ready logger with context and levels
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In development, use console for readability
    if (this.isDevelopment) {
      const prefix = `[${level.toUpperCase()}]`;
      const contextStr = context ? JSON.stringify(context, null, 2) : '';
      
      switch (level) {
        case 'error':
          // eslint-disable-next-line no-console
          console.error(prefix, message, contextStr);
          break;
        case 'warn':
          // eslint-disable-next-line no-console
          console.warn(prefix, message, contextStr);
          break;
        case 'info':
          // eslint-disable-next-line no-console
          console.info(prefix, message, contextStr);
          break;
        case 'debug':
          // eslint-disable-next-line no-console
          console.debug(prefix, message, contextStr);
          break;
      }
    } else {
      // In production, log structured JSON (Vercel automatically captures)
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(logData));
    }
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }
}

export const logger = new Logger();
