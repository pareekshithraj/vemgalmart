import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outline' | 'success' | 'warning' | 'destructive';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                {
                    'bg-primary text-white hover:bg-primary/80': variant === 'default',
                    'text-gray-900 border border-gray-200': variant === 'outline',
                    'bg-green-100 text-green-800': variant === 'success',
                    'bg-amber-100 text-amber-800': variant === 'warning',
                    'bg-red-100 text-red-800': variant === 'destructive',
                },
                className
            )}
            {...props}
        />
    );
}
