import { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

/**
 * Tooltip component
 * Shows helpful information on hover
 */
export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center"
      >
        {children}
      </div>

      {isVisible && (
        <div className="absolute z-50 left-0 top-full mt-2 w-72 animate-in fade-in duration-200">
          <div className="bg-card border border-border-light rounded-lg shadow-lg p-3">
            <p className="text-sm text-foreground leading-relaxed">
              {content}
            </p>
          </div>
          {/* Arrow pointing up */}
          <div className="absolute -top-1 left-3 w-2 h-2 bg-card border-t border-l border-border-light rotate-45" />
        </div>
      )}
    </div>
  );
}
