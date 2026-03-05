import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    tooltip?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-11 h-11 text-lg',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, tooltip, size = 'md', children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                title={tooltip}
                aria-label={tooltip}
                className={clsx(
                    'inline-flex items-center justify-center rounded-lg',
                    'text-text-secondary hover:text-text-primary',
                    'bg-transparent hover:bg-bg-elevated',
                    'transition-all duration-150 cursor-pointer',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';
