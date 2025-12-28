/**
 * Adaptive Card Component
 * 
 * Adapts spacing, animation, and density based on UX Genome.
 */

'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface AdaptiveCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AdaptiveCard({ children, className, onClick }: AdaptiveCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-200',
        'transition-all duration-genome-balanced',
        'p-genome-standard',
        onClick && 'cursor-pointer hover:shadow-md hover:border-genome-accent',
        className
      )}
    >
      {children}
    </div>
  );
}

