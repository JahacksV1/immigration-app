import { cn } from '@/lib/utils';
import { useRef } from 'react';

/**
 * Tab item interface
 */
export interface TabItem {
  /** Unique value identifier */
  value: string;

  /** Display label */
  label: string;

  /** Optional description text */
  description?: string;

  /** Optional icon element */
  icon?: React.ReactNode;
}

/**
 * Tabs component props
 */
interface TabsProps {
  /** Array of tab items */
  items: TabItem[];

  /** Currently selected tab value */
  value: string;

  /** Callback when tab selection changes */
  onValueChange: (value: string) => void;

  /** ARIA label for the tablist */
  ariaLabel?: string;

  /** Optional className for custom styling */
  className?: string;
}

/**
 * Generic Tabs Component
 *
 * Reusable tabbed interface with full accessibility support.
 *
 * Features:
 * - ARIA attributes for screen readers
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Focus management
 * - Mobile responsive
 *
 * @example
 * ```tsx
 * <Tabs
 *   items={[
 *     { value: 'tab1', label: 'Tab 1' },
 *     { value: 'tab2', label: 'Tab 2' },
 *   ]}
 *   value={selectedTab}
 *   onValueChange={setSelectedTab}
 *   ariaLabel="Example tabs"
 * />
 * ```
 */
export function Tabs({
  items,
  value,
  onValueChange,
  ariaLabel,
  className,
}: TabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = items.findIndex((item) => item.value === value);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      onValueChange(items[newIndex].value);

      // Focus the new tab
      setTimeout(() => {
        const newTab = tabsRef.current?.querySelector(
          `[data-value="${items[newIndex].value}"]`
        ) as HTMLButtonElement;
        newTab?.focus();
      }, 0);
    }
  };

  return (
    <div
      ref={tabsRef}
      className={cn('w-full', className)}
      role="tablist"
      aria-label={ariaLabel}
    >
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {items.map((item) => {
          const isSelected = item.value === value;

          return (
            <button
              key={item.value}
              data-value={item.value}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`tabpanel-${item.value}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onValueChange(item.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                'group relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-background',
                'min-h-[44px] min-w-[44px]', // Touch target size
                isSelected
                  ? 'bg-accent-purple text-white shadow-md hover:bg-accent-purple-hover'
                  : 'bg-card text-foreground-muted border border-border hover:bg-card-hover hover:text-foreground hover:border-accent-purple/30'
              )}
            >
              <span className="flex items-center gap-2">
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </span>

              {/* Optional description tooltip on hover */}
              {item.description && (
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                  {item.description}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
