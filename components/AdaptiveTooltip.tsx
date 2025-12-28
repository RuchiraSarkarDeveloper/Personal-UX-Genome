/**
 * Adaptive Tooltip Component
 * 
 * Adapts delay and duration based on guidance need trait.
 */

'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useGenomeStore } from '@/store/genomeStore';
import clsx from 'clsx';

interface AdaptiveTooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function AdaptiveTooltip({
  content,
  children,
  position = 'top',
}: AdaptiveTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverStart, setHoverStart] = useState<number | null>(null);
  const { genome } = useGenomeStore();

  // Get tooltip delay from genome
  const getTooltipDelay = () => {
    const delays = {
      minimal: 1000,
      contextual: 500,
      strong: 200,
    };
    return delays[genome.guidanceNeed];
  };

  useEffect(() => {
    if (hoverStart === null) return;

    const delay = getTooltipDelay();
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [hoverStart, genome.guidanceNeed]);

  const handleMouseEnter = () => {
    setHoverStart(Date.now());
  };

  const handleMouseLeave = () => {
    setHoverStart(null);
    setIsVisible(false);
  };

  // Don't show tooltip if guidance need is minimal and user hovers briefly
  if (genome.guidanceNeed === 'minimal' && !isVisible) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={clsx(
            'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg',
            'transition-opacity duration-genome-fast',
            {
              'bottom-full left-1/2 -translate-x-1/2 mb-2': position === 'top',
              'top-full left-1/2 -translate-x-1/2 mt-2': position === 'bottom',
              'right-full top-1/2 -translate-y-1/2 mr-2': position === 'left',
              'left-full top-1/2 -translate-y-1/2 ml-2': position === 'right',
            }
          )}
        >
          {content}
          <div
            className={clsx('absolute w-2 h-2 bg-gray-900 transform rotate-45', {
              'top-full left-1/2 -translate-x-1/2 -mt-1': position === 'top',
              'bottom-full left-1/2 -translate-x-1/2 -mb-1': position === 'bottom',
              'left-full top-1/2 -translate-y-1/2 -ml-1': position === 'left',
              'right-full top-1/2 -translate-y-1/2 -mr-1': position === 'right',
            })}
          />
        </div>
      )}
    </div>
  );
}

