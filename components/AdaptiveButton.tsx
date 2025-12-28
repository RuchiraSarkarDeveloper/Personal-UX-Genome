/**
 * Adaptive Button Component
 * 
 * Automatically adapts size, spacing, and animation based on UX Genome.
 */

'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface AdaptiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'standard' | 'large';
  className?: string;
}

export function AdaptiveButton({
  children,
  onClick,
  variant = 'primary',
  size = 'standard',
  className,
}: AdaptiveButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'transition-all duration-genome-balanced',
        'rounded-lg font-medium',
        'focus:outline-none focus:ring-2 focus:ring-genome-accent focus:ring-offset-2',
        {
          // Variants
          'bg-genome-primary text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'bg-transparent text-genome-primary hover:bg-gray-100': variant === 'ghost',
          
          // Sizes (uses genome spacing)
          'px-genome-compact py-genome-compact text-sm': size === 'small',
          'px-genome-standard py-genome-standard text-base': size === 'standard',
          'px-genome-spacious py-genome-spacious text-lg': size === 'large',
        },
        className
      )}
      style={{
        minHeight: `var(--genome-button-${size}-height, auto)`,
      }}
    >
      {children}
    </button>
  );
}

