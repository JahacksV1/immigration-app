import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';
import { Tooltip } from './Tooltip';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: string;
  label?: string;
  placeholder?: string;
  tooltip?: string;
}

/**
 * Select component
 * Styled dropdown select with options
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, error, label, tooltip, placeholder, id, ...props }, ref) => {
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
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 bg-background-elevated border rounded-lg text-foreground transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent appearance-none cursor-pointer',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border hover:border-accent-purple/30',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
