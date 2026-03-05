import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const buttonVariants = cva(
    // Base styles
    [
        'inline-flex items-center justify-center gap-2',
        'font-semibold transition-all cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
    ].join(' '),
    {
        variants: {
            variant: {
                primary: [
                    'bg-accent text-white',
                    'hover:bg-accent-hover hover:scale-[1.02]',
                    'active:scale-[0.98]',
                    'shadow-[0_0_20px_rgba(129,140,248,0.15)]',
                    'hover:shadow-[0_0_28px_rgba(129,140,248,0.25)]',
                ].join(' '),
                secondary: [
                    'bg-bg-elevated text-text-primary',
                    'border border-border-subtle',
                    'hover:bg-bg-elevated/80 hover:border-border-strong',
                    'hover:scale-[1.02]',
                    'active:scale-[0.98]',
                ].join(' '),
                ghost: [
                    'bg-transparent text-text-secondary',
                    'hover:bg-bg-elevated hover:text-text-primary',
                ].join(' '),
            },
            size: {
                sm: 'px-3 py-1.5 text-sm rounded-lg',
                md: 'px-5 py-2.5 text-sm rounded-xl',
                lg: 'px-7 py-3 text-base rounded-full',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(buttonVariants({ variant, size }), className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
