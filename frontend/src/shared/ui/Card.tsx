import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    elevated?: boolean;
    noPadding?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, elevated = false, noPadding = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    'rounded-xl border border-border-subtle transition-all duration-200',
                    elevated
                        ? 'bg-bg-elevated shadow-elevated'
                        : 'bg-bg-secondary shadow-card',
                    !noPadding && 'p-4',
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
