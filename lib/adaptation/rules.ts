/**
 * Cross-App Adaptation Rules
 * 
 * Converts UX Genome traits into CSS variables and UI behaviors.
 * This is the "plug-and-play" layer that any app can use.
 */

import { UXGenome, MotionSensitivity, InteractionSpeed, LayoutDensity, GuidanceNeed } from '@/types/genome';

export interface AdaptationRules {
  // Animation durations (ms)
  animationFast: number;
  animationBalanced: number;
  animationSlow: number;
  
  // Spacing scale
  spacingCompact: string;
  spacingStandard: string;
  spacingSpacious: string;
  
  // Button sizes
  buttonSizeSmall: string;
  buttonSizeStandard: string;
  buttonSizeLarge: string;
  
  // Tooltip behavior
  tooltipDelay: number;
  tooltipDuration: number;
  
  // Transition styles
  transitionType: 'ease' | 'ease-in' | 'ease-out' | 'linear';
  
  // Information chunking
  maxItemsPerChunk: number;
  
  // Focus behavior
  autoFocusEnabled: boolean;
}

/**
 * Generate adaptation rules from genome
 */
export function generateAdaptationRules(genome: UXGenome): AdaptationRules {
  const rules: AdaptationRules = {
    // Animation speeds based on motion sensitivity and interaction speed
    animationFast: getAnimationDuration(genome, 'fast'),
    animationBalanced: getAnimationDuration(genome, 'balanced'),
    animationSlow: getAnimationDuration(genome, 'slow'),
    
    // Spacing based on density tolerance
    spacingCompact: getSpacing(genome.layoutDensityTolerance, 'compact'),
    spacingStandard: getSpacing(genome.layoutDensityTolerance, 'standard'),
    spacingSpacious: getSpacing(genome.layoutDensityTolerance, 'spacious'),
    
    // Button sizes based on click precision
    buttonSizeSmall: genome.clickPrecision > 0.8 ? '2rem' : '2.5rem',
    buttonSizeStandard: genome.clickPrecision > 0.8 ? '2.5rem' : '3rem',
    buttonSizeLarge: genome.clickPrecision > 0.8 ? '3rem' : '3.5rem',
    
    // Tooltip behavior based on guidance need
    tooltipDelay: getTooltipDelay(genome.guidanceNeed),
    tooltipDuration: getTooltipDuration(genome.guidanceNeed),
    
    // Transition style based on motion sensitivity
    transitionType: getTransitionType(genome.motionSensitivity),
    
    // Information chunking based on cognitive load
    maxItemsPerChunk: getMaxItemsPerChunk(genome.cognitiveLoadThreshold),
    
    // Auto-focus based on interaction speed
    autoFocusEnabled: genome.preferredInteractionSpeed === 'fast',
  };
  
  return rules;
}

/**
 * Apply adaptation rules to CSS variables
 */
export function applyAdaptationRules(rules: AdaptationRules): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Animation durations
  root.style.setProperty('--genome-animation-fast', `${rules.animationFast}ms`);
  root.style.setProperty('--genome-animation-balanced', `${rules.animationBalanced}ms`);
  root.style.setProperty('--genome-animation-slow', `${rules.animationSlow}ms`);
  
  // Spacing
  root.style.setProperty('--genome-spacing-compact', rules.spacingCompact);
  root.style.setProperty('--genome-spacing-standard', rules.spacingStandard);
  root.style.setProperty('--genome-spacing-spacious', rules.spacingSpacious);
  
  // Colors (can be extended)
  root.style.setProperty('--genome-primary', '#3b82f6');
  root.style.setProperty('--genome-secondary', '#64748b');
  root.style.setProperty('--genome-accent', '#8b5cf6');
}

function getAnimationDuration(genome: UXGenome, speed: 'fast' | 'balanced' | 'slow'): number {
  const baseDurations = {
    fast: 150,
    balanced: 250,
    slow: 400,
  };
  
  let multiplier = 1;
  
  // Motion sensitivity affects all animations
  if (genome.motionSensitivity === 'high') {
    multiplier *= 0.6; // Shorter animations
  } else if (genome.motionSensitivity === 'low') {
    multiplier *= 1.2; // Longer animations
  }
  
  // Interaction speed preference
  if (genome.preferredInteractionSpeed === 'fast') {
    multiplier *= 0.8;
  } else if (genome.preferredInteractionSpeed === 'slow') {
    multiplier *= 1.3;
  }
  
  return Math.round(baseDurations[speed] * multiplier);
}

function getSpacing(density: LayoutDensity, level: 'compact' | 'standard' | 'spacious'): string {
  const spacingMap: Record<LayoutDensity, Record<string, string>> = {
    compact: {
      compact: '0.25rem',
      standard: '0.5rem',
      spacious: '1rem',
    },
    standard: {
      compact: '0.5rem',
      standard: '1rem',
      spacious: '1.5rem',
    },
    spacious: {
      compact: '0.75rem',
      standard: '1.5rem',
      spacious: '2rem',
    },
  };
  
  return spacingMap[density][level];
}

function getTooltipDelay(guidance: GuidanceNeed): number {
  const delays = {
    minimal: 1000, // Show tooltips only after long hover
    contextual: 500,
    strong: 200, // Show tooltips quickly
  };
  
  return delays[guidance];
}

function getTooltipDuration(guidance: GuidanceNeed): number {
  const durations = {
    minimal: 2000, // Short tooltips
    contextual: 4000,
    strong: 6000, // Longer tooltips
  };
  
  return durations[guidance];
}

function getTransitionType(sensitivity: MotionSensitivity): 'ease' | 'ease-in' | 'ease-out' | 'linear' {
  // High sensitivity = linear (less motion)
  // Low sensitivity = ease (more motion)
  if (sensitivity === 'high') return 'linear';
  if (sensitivity === 'low') return 'ease';
  return 'ease-out';
}

function getMaxItemsPerChunk(loadThreshold: number): number {
  // Higher cognitive load = smaller chunks
  if (loadThreshold > 0.7) return 3;
  if (loadThreshold > 0.4) return 5;
  return 7;
}

