import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card component
 * Modern card with optional hover effect
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = 'md', children, ...props }, ref) => {
    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-card border border-border rounded-lg shadow-card',
          paddingStyles[padding],
          hover &&
            'hover:bg-card-hover hover:shadow-card-hover hover:scale-[1.01] transition-all duration-200 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

/**
 * Card header with title and optional description
 */
export function CardHeader({
  title,
  description,
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cn('space-y-1.5', className)} {...props}>
      {title && (
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-foreground-muted">{description}</p>
      )}
      {children}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Card content area
 */
export function CardContent({
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div className={cn('pt-4', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Card footer
 */
export function CardFooter({
  className,
  children,
  ...props
}: CardFooterProps) {
  return (
    <div className={cn('pt-4 flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  );
}
