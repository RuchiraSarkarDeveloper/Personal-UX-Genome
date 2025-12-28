/**
 * Trait Inference Engine
 * 
 * Converts raw interaction signals into UX traits using statistical analysis.
 * Uses confidence-weighted learning to prevent overfitting.
 */

import { 
  UXGenome, 
  SignalCollection, 
  ClickSignal, 
  CursorSignal, 
  ScrollSignal, 
  HoverSignal,
  MotionSensitivity,
  InteractionSpeed,
  LayoutDensity,
  GuidanceNeed,
  TraitMetadata,
  LearningState
} from '@/types/genome';

export class TraitInferenceEngine {
  private readonly CONFIDENCE_THRESHOLD = 0.6; // Minimum confidence to update trait
  private readonly MIN_SAMPLES = 10; // Minimum samples before making inferences
  private readonly DECAY_FACTOR = 0.95; // How much recent behavior matters vs old

  /**
   * Infer all traits from recent signals
   */
  inferTraits(genome: UXGenome, signals: SignalCollection[]): Partial<UXGenome> {
    const updates: Partial<UXGenome> = {};

    // Group signals by type
    const clicks = signals.filter(s => s.type === 'click') as ClickSignal[];
    const cursors = signals.filter(s => s.type === 'cursor') as CursorSignal[];
    const scrolls = signals.filter(s => s.type === 'scroll') as ScrollSignal[];
    const hovers = signals.filter(s => s.type === 'hover') as HoverSignal[];

    // Infer motion sensitivity
    const motionSensitivity = this.inferMotionSensitivity(genome, scrolls, cursors, clicks);
    if (motionSensitivity) {
      updates.motionSensitivity = motionSensitivity.value;
      updates.motionSensitivityMeta = motionSensitivity.meta;
    }

    // Infer interaction speed
    const interactionSpeed = this.inferInteractionSpeed(genome, clicks, cursors, hovers);
    if (interactionSpeed) {
      updates.preferredInteractionSpeed = interactionSpeed.value;
      updates.preferredInteractionSpeedMeta = interactionSpeed.meta;
    }

    // Infer layout density tolerance
    const densityTolerance = this.inferDensityTolerance(genome, clicks, cursors);
    if (densityTolerance) {
      updates.layoutDensityTolerance = densityTolerance.value;
      updates.layoutDensityToleranceMeta = densityTolerance.meta;
    }

    // Infer guidance need
    const guidanceNeed = this.inferGuidanceNeed(genome, hovers, clicks);
    if (guidanceNeed) {
      updates.guidanceNeed = guidanceNeed.value;
      updates.guidanceNeedMeta = guidanceNeed.meta;
    }

    // Infer cognitive load threshold
    const cognitiveLoad = this.inferCognitiveLoad(genome, signals);
    if (cognitiveLoad !== null) {
      updates.cognitiveLoadThreshold = cognitiveLoad.value;
      updates.cognitiveLoadThresholdMeta = cognitiveLoad.meta;
    }

    // Update derived metrics
    updates.clickPrecision = this.calculateClickPrecision(clicks);
    updates.cursorSmoothness = this.calculateCursorSmoothness(cursors);
    updates.scrollBehavior = this.inferScrollBehavior(scrolls);
    updates.hoverDwellTime = this.calculateAverageHoverDwell(hovers);

    return updates;
  }

  /**
   * Motion Sensitivity: Based on animation interruptions, scroll reversals, cursor freezes
   */
  private inferMotionSensitivity(
    genome: UXGenome,
    scrolls: ScrollSignal[],
    cursors: CursorSignal[],
    clicks: ClickSignal[]
  ): { value: MotionSensitivity; meta: TraitMetadata } | null {
    if (scrolls.length < this.MIN_SAMPLES) return null;

    // High reversal rate suggests motion sensitivity
    const reversalRate = scrolls.filter(s => s.data.reversalCount > 2).length / scrolls.length;
    
    // Cursor freezes during movement (low velocity variance)
    const cursorVariances = cursors.map(c => {
      // Simplified: use jitter as proxy for freeze detection
      return c.data.jitter;
    });
    const avgJitter = cursorVariances.length > 0
      ? cursorVariances.reduce((a, b) => a + b, 0) / cursorVariances.length
      : 0;
    
    // Click corrections during animations (simplified: use correction count)
    const avgCorrections = clicks.length > 0
      ? clicks.reduce((sum, c) => sum + c.data.correctionCount, 0) / clicks.length
      : 0;

    // Combine signals
    const sensitivityScore = (reversalRate * 0.4) + (avgJitter > 10 ? 0.3 : 0) + (avgCorrections > 1 ? 0.3 : 0);
    
    let value: MotionSensitivity;
    if (sensitivityScore > 0.6) value = 'high';
    else if (sensitivityScore > 0.3) value = 'medium';
    else value = 'low';

    const confidence = Math.min(1, scrolls.length / 50); // More samples = higher confidence
    
    return {
      value,
      meta: this.updateTraitMetadata(genome.motionSensitivityMeta, confidence, value === genome.motionSensitivity),
    };
  }

  /**
   * Interaction Speed: Based on click latency, cursor velocity, hover dwell time
   */
  private inferInteractionSpeed(
    genome: UXGenome,
    clicks: ClickSignal[],
    cursors: CursorSignal[],
    hovers: HoverSignal[]
  ): { value: InteractionSpeed; meta: TraitMetadata } | null {
    if (clicks.length < this.MIN_SAMPLES) return null;

    // Fast clickers have low time-to-click
    const avgTimeToClick = clicks.length > 0
      ? clicks.reduce((sum, c) => sum + c.data.timeToClick, 0) / clicks.length
      : 500;
    
    // Fast movers have high cursor velocity
    const avgCursorVelocity = cursors.length > 0
      ? cursors.reduce((sum, c) => sum + c.data.velocity, 0) / cursors.length
      : 0.5;
    
    // Fast users have short hover dwell
    const avgHoverDwell = hovers.length > 0
      ? hovers.reduce((sum, h) => sum + h.data.dwellTime, 0) / hovers.length
      : 300;

    // Normalize and combine
    const speedScore = (
      (avgTimeToClick < 200 ? 1 : avgTimeToClick < 400 ? 0.5 : 0) * 0.4 +
      (avgCursorVelocity > 1 ? 1 : avgCursorVelocity > 0.5 ? 0.5 : 0) * 0.3 +
      (avgHoverDwell < 200 ? 1 : avgHoverDwell < 400 ? 0.5 : 0) * 0.3
    );

    let value: InteractionSpeed;
    if (speedScore > 0.7) value = 'fast';
    else if (speedScore > 0.3) value = 'balanced';
    else value = 'slow';

    const confidence = Math.min(1, clicks.length / 30);
    
    return {
      value,
      meta: this.updateTraitMetadata(genome.preferredInteractionSpeedMeta, confidence, value === genome.preferredInteractionSpeed),
    };
  }

  /**
   * Layout Density Tolerance: Based on click precision, target size preferences
   */
  private inferDensityTolerance(
    genome: UXGenome,
    clicks: ClickSignal[],
    cursors: CursorSignal[]
  ): { value: LayoutDensity; meta: TraitMetadata } | null {
    if (clicks.length < this.MIN_SAMPLES) return null;

    // Users who miss small targets prefer spacious layouts
    const missRate = clicks.filter(c => c.data.missDistance && c.data.missDistance > 5).length / clicks.length;
    
    // Users who click large targets comfortably prefer compact
    const avgTargetSize = clicks.length > 0
      ? clicks.reduce((sum, c) => sum + c.data.targetSize, 0) / clicks.length
      : 1000;
    
    // High precision = comfortable with compact
    const precision = this.calculateClickPrecision(clicks);

    const densityScore = (
      (missRate > 0.3 ? 0 : missRate > 0.15 ? 0.5 : 1) * 0.4 +
      (avgTargetSize < 500 ? 0 : avgTargetSize < 1000 ? 0.5 : 1) * 0.3 +
      (precision > 0.8 ? 1 : precision > 0.6 ? 0.5 : 0) * 0.3
    );

    let value: LayoutDensity;
    if (densityScore > 0.7) value = 'compact';
    else if (densityScore > 0.3) value = 'standard';
    else value = 'spacious';

    const confidence = Math.min(1, clicks.length / 40);
    
    return {
      value,
      meta: this.updateTraitMetadata(genome.layoutDensityToleranceMeta, confidence, value === genome.layoutDensityTolerance),
    };
  }

  /**
   * Guidance Need: Based on hover dwell, exploration patterns
   */
  private inferGuidanceNeed(
    genome: UXGenome,
    hovers: HoverSignal[],
    clicks: ClickSignal[]
  ): { value: GuidanceNeed; meta: TraitMetadata } | null {
    if (hovers.length < this.MIN_SAMPLES) return null;

    // Long hovers suggest need for guidance/tooltips
    const avgDwell = hovers.length > 0
      ? hovers.reduce((sum, h) => sum + h.data.dwellTime, 0) / hovers.length
      : 300;
    
    // High correction rate suggests need for clearer guidance
    const correctionRate = clicks.length > 0
      ? clicks.reduce((sum, c) => sum + c.data.correctionCount, 0) / clicks.length
      : 0;

    const guidanceScore = (
      (avgDwell > 500 ? 1 : avgDwell > 300 ? 0.5 : 0) * 0.6 +
      (correctionRate > 1 ? 1 : correctionRate > 0.5 ? 0.5 : 0) * 0.4
    );

    let value: GuidanceNeed;
    if (guidanceScore > 0.6) value = 'strong';
    else if (guidanceScore > 0.3) value = 'contextual';
    else value = 'minimal';

    const confidence = Math.min(1, hovers.length / 30);
    
    return {
      value,
      meta: this.updateTraitMetadata(genome.guidanceNeedMeta, confidence, value === genome.guidanceNeed),
    };
  }

  /**
   * Cognitive Load: Detects overload from rapid switching, jitter, abandonment
   */
  private inferCognitiveLoad(
    genome: UXGenome,
    signals: SignalCollection[]
  ): { value: number; meta: TraitMetadata } | null {
    if (signals.length < this.MIN_SAMPLES) return null;

    // Rapid tab switching (focus changes)
    const focusSignals = signals.filter(s => s.type === 'focus') as any[];
    const rapidFocusChanges = focusSignals.filter((s, i) => {
      if (i === 0) return false;
      return s.timestamp - focusSignals[i - 1].timestamp < 500;
    }).length;
    
    // High jitter (stress indicator)
    const cursorSignals = signals.filter(s => s.type === 'cursor') as CursorSignal[];
    const avgJitter = cursorSignals.length > 0
      ? cursorSignals.reduce((sum, c) => sum + c.data.jitter, 0) / cursorSignals.length
      : 0;
    
    // Scroll oscillation (indecision)
    const scrollSignals = signals.filter(s => s.type === 'scroll') as ScrollSignal[];
    const oscillationRate = scrollSignals.filter(s => s.data.reversalCount > 1).length / Math.max(1, scrollSignals.length);

    // Combine into load score (0-1)
    const loadScore = Math.min(1, (
      (rapidFocusChanges / Math.max(1, focusSignals.length)) * 0.4 +
      (Math.min(1, avgJitter / 20)) * 0.3 +
      oscillationRate * 0.3
    ));

    const confidence = Math.min(1, signals.length / 100);
    
    return {
      value: loadScore,
      meta: this.updateTraitMetadata(genome.cognitiveLoadThresholdMeta, confidence, Math.abs(loadScore - genome.cognitiveLoadThreshold) < 0.2),
    };
  }

  /**
   * Calculate click precision (0-1)
   */
  private calculateClickPrecision(clicks: ClickSignal[]): number {
    if (clicks.length === 0) return 0.5;
    
    const misses = clicks.filter(c => c.data.missDistance && c.data.missDistance > 0).length;
    const precision = 1 - (misses / clicks.length);
    return Math.max(0, Math.min(1, precision));
  }

  /**
   * Calculate cursor smoothness (0-1)
   */
  private calculateCursorSmoothness(cursors: CursorSignal[]): number {
    if (cursors.length === 0) return 0.5;
    
    const avgJitter = cursors.reduce((sum, c) => sum + c.data.jitter, 0) / cursors.length;
    // Lower jitter = higher smoothness
    const smoothness = 1 - Math.min(1, avgJitter / 15);
    return Math.max(0, Math.min(1, smoothness));
  }

  /**
   * Infer scroll behavior pattern
   */
  private inferScrollBehavior(scrolls: ScrollSignal[]): 'continuous' | 'burst' | 'mixed' {
    if (scrolls.length < 5) return 'mixed';
    
    const timeBetweenScrolls = scrolls.slice(1).map((s, i) => 
      s.timestamp - scrolls[i].timestamp
    );
    const avgTimeBetween = timeBetweenScrolls.reduce((a, b) => a + b, 0) / timeBetweenScrolls.length;
    
    if (avgTimeBetween < 100) return 'continuous';
    if (avgTimeBetween > 1000) return 'burst';
    return 'mixed';
  }

  /**
   * Calculate average hover dwell time
   */
  private calculateAverageHoverDwell(hovers: HoverSignal[]): number {
    if (hovers.length === 0) return 300;
    return hovers.reduce((sum, h) => sum + h.data.dwellTime, 0) / hovers.length;
  }

  /**
   * Update trait metadata with confidence-weighted learning
   */
  private updateTraitMetadata(
    currentMeta: TraitMetadata,
    newConfidence: number,
    isStable: boolean
  ): TraitMetadata {
    // Only update if confidence is high enough
    if (newConfidence < this.CONFIDENCE_THRESHOLD && currentMeta.sampleCount > 0) {
      return {
        ...currentMeta,
        // Slight decay in confidence if no strong signal
        confidence: currentMeta.confidence * this.DECAY_FACTOR,
      };
    }

    // Confidence-weighted update
    const updatedConfidence = isStable
      ? Math.min(1, currentMeta.confidence + (newConfidence * 0.1))
      : Math.max(0, currentMeta.confidence - (newConfidence * 0.1));

    // Determine state
    let state: LearningState = currentMeta.state;
    if (updatedConfidence > 0.8) state = 'confident';
    else if (updatedConfidence > 0.5) state = 'tentative';
    else if (currentMeta.sampleCount < this.MIN_SAMPLES) state = 'observing';
    else state = currentMeta.state;

    return {
      confidence: updatedConfidence,
      lastUpdated: Date.now(),
      sampleCount: currentMeta.sampleCount + 1,
      state,
    };
  }
}

