import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

/**
 * Textarea component
 * Styled textarea with optional label and error state
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            {label}
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
