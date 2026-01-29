import { useEffect, useState } from 'react';
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
  const [shouldShow, setShouldShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (status === 'saving') {
      setShouldShow(true);
      setFadeOut(false);
    } else if (status === 'saved') {
      setShouldShow(true);
      setFadeOut(false);
      
      // After 3 seconds, start fade out
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 3000);

      // After 3.5 seconds, hide completely
      const hideTimer = setTimeout(() => {
        setShouldShow(false);
      }, 3500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setShouldShow(false);
      setFadeOut(false);
    }
  }, [status]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm transition-opacity duration-500',
        fadeOut ? 'opacity-0' : 'opacity-100',
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
