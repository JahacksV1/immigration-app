import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';
import { Tooltip } from './Tooltip';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  tooltip?: string;
}

/**
 * Textarea component
 * Styled textarea with optional label and error state
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, tooltip, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2"
          >
            <span>{label}</span>
            {tooltip && (
              <Tooltip content={tooltip}>
                <svg
                  className="w-4 h-4 text-foreground-muted hover:text-accent-purple transition-colors cursor-help"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Tooltip>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 bg-background-elevated border rounded-lg text-foreground placeholder:text-foreground-muted transition-colors duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border hover:border-accent-purple/30',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
