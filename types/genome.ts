/**
 * Personal UX Genome - Core Type Definitions
 * 
 * This defines the living UX profile that adapts to user behavior.
 * All traits are confidence-weighted and continuously evolving.
 */

export type MotionSensitivity = 'low' | 'medium' | 'high';
export type InteractionSpeed = 'fast' | 'balanced' | 'slow';
export type LayoutDensity = 'compact' | 'standard' | 'spacious';
export type GuidanceNeed = 'minimal' | 'contextual' | 'strong';
export type LearningState = 'observing' | 'tentative' | 'confident' | 'locked' | 'paused';

export interface TraitMetadata {
  confidence: number; // 0-1, how confident we are in this trait
  lastUpdated: number; // timestamp
  sampleCount: number; // number of observations
  state: LearningState;
}

export interface UXGenome {
  version: string;
  createdAt: number;
  lastUpdated: number;
  
  // Core Traits
  motionSensitivity: MotionSensitivity;
  motionSensitivityMeta: TraitMetadata;
  
  preferredInteractionSpeed: InteractionSpeed;
  preferredInteractionSpeedMeta: TraitMetadata;
  
  layoutDensityTolerance: LayoutDensity;
  layoutDensityToleranceMeta: TraitMetadata;
  
  guidanceNeed: GuidanceNeed;
  guidanceNeedMeta: TraitMetadata;
  
  cognitiveLoadThreshold: number; // 0-1, when to simplify UI
  cognitiveLoadThresholdMeta: TraitMetadata;
  
  // Derived Metrics
  clickPrecision: number; // 0-1, higher = more precise
  cursorSmoothness: number; // 0-1, higher = smoother
  scrollBehavior: 'continuous' | 'burst' | 'mixed';
  hoverDwellTime: number; // milliseconds
  navigationDepthTolerance: number; // how many levels deep user navigates
  
  // System State
  learningEnabled: boolean;
  pausedUntil?: number; // timestamp when to resume learning
}

export interface InteractionSignal {
  type: 'click' | 'cursor' | 'scroll' | 'hover' | 'focus' | 'keyboard' | 'resize';
  timestamp: number;
  data: Record<string, any>;
}

export interface ClickSignal extends InteractionSignal {
  type: 'click';
  data: {
    targetSize: number; // area of clickable target
    missDistance?: number; // pixels from target if miss
    correctionCount: number; // number of corrections before click
    timeToClick: number; // ms from hover/visible to click
  };
}

export interface CursorSignal extends InteractionSignal {
  type: 'cursor';
  data: {
    velocity: number; // pixels per ms
    acceleration: number;
    jitter: number; // variance in movement
    pathLength: number; // total distance traveled
  };
}

export interface ScrollSignal extends InteractionSignal {
  type: 'scroll';
  data: {
    delta: number;
    velocity: number;
    direction: 'up' | 'down';
    reversalCount: number; // direction changes
    timeSinceLastScroll: number;
  };
}

export interface HoverSignal extends InteractionSignal {
  type: 'hover';
  data: {
    element: string; // element type
    dwellTime: number; // ms
    triggered: boolean; // did it trigger an action
  };
}

export interface FocusSignal extends InteractionSignal {
  type: 'focus';
  data: {
    element: string;
    timeToFocus: number; // ms from page load or last focus
    tabCount: number; // number of tabs to reach this
  };
}

export interface KeyboardSignal extends InteractionSignal {
  type: 'keyboard';
  data: {
    key: string;
    timeSinceLastKey: number;
    isCorrection: boolean; // backspace/delete
  };
}

export interface ResizeSignal extends InteractionSignal {
  type: 'resize';
  data: {
    width: number;
    height: number;
    deviceType: 'mobile' | 'tablet' | 'desktop';
  };
}

export type SignalCollection = 
  | ClickSignal 
  | CursorSignal 
  | ScrollSignal 
  | HoverSignal 
  | FocusSignal 
  | KeyboardSignal 
  | ResizeSignal;

export interface SignalBuffer {
  signals: SignalCollection[];
  windowStart: number;
  windowEnd: number;
  maxAge: number; // ms
}

export interface TraitInference {
  trait: keyof UXGenome;
  value: any;
  confidence: number;
  reasoning: string[];
}

