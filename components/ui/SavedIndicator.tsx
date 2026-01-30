import { cn } from '@/lib/utils';

interface SavedIndicatorProps {
  status: 'idle' | 'saving' | 'saved';
  className?: string;
}

/**
 * SavedIndicator component
 * Shows auto-save status in the header
 * 
 * States:
 * - idle: Hidden
 * - saving: "Saving..." with spinner
 * - saved: "✓ Saved" with green checkmark (fades after 3s)
 */
export function SavedIndicator({ status, className }: SavedIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm min-w-[100px] justify-end',
        className
      )}
    >
      {status === 'saving' && (
        <>
          <div className="w-4 h-4 border-2 border-foreground-muted border-t-accent-purple rounded-full animate-spin" />
          <span className="text-foreground-muted">Saving...</span>
        </>
      )}

      {status === 'saved' && (
        <>
          <svg
            className="w-4 h-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-green-500 font-medium">Saved</span>
        </>
      )}
    </div>
  );
}
