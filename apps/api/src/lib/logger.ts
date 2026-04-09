type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logData = { timestamp, level, message, ...context };

    if (this.isDevelopment) {
      const prefix = `[${level.toUpperCase()}]`;
      const contextStr = context ? JSON.stringify(context, null, 2) : '';
      switch (level) {
        case 'error': console.error(prefix, message, contextStr); break;
        case 'warn':  console.warn(prefix, message, contextStr);  break;
        case 'info':  console.info(prefix, message, contextStr);  break;
        case 'debug': console.debug(prefix, message, contextStr); break;
      }
    } else {
      console.log(JSON.stringify(logData));
    }
  }

  info(message: string, context?: LogContext): void  { this.log('info',  message, context); }
  warn(message: string, context?: LogContext): void  { this.log('warn',  message, context); }
  error(message: string, context?: LogContext): void { this.log('error', message, context); }
  debug(message: string, context?: LogContext): void { this.log('debug', message, context); }
}

export const logger = new Logger();
