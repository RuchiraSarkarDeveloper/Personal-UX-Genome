/**
 * Genome Provider
 * 
 * Initializes signal capture and trait inference, applies adaptations.
 * This is the "brain" that runs in the background.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { SignalCapture } from '@/lib/signals/capture';
import { TraitInferenceEngine } from '@/lib/inference/engine';
import { useGenomeStore } from '@/store/genomeStore';
import { generateAdaptationRules, applyAdaptationRules } from '@/lib/adaptation/rules';

export function GenomeProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const captureRef = useRef<SignalCapture | null>(null);
  const inferenceRef = useRef<TraitInferenceEngine | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { genome, updateGenome, learningEnabled } = useGenomeStore();

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client after mount
    if (typeof window === 'undefined' || !isMounted) return;
    
    // Initialize signal capture
    if (!captureRef.current) {
      captureRef.current = new SignalCapture();
      inferenceRef.current = new TraitInferenceEngine();
    }

    const capture = captureRef.current;
    const inference = inferenceRef.current;

    // Subscribe to signals and infer traits periodically
    const unsubscribe = capture.subscribe(() => {
      // Debounced inference (runs every 5 seconds)
      if (updateIntervalRef.current) return;
      
      updateIntervalRef.current = setTimeout(() => {
        if (learningEnabled && genome.learningEnabled) {
          const recentSignals = capture.getRecentSignals(30000); // Last 30 seconds
          
          if (recentSignals.length > 0) {
            const updates = inference.inferTraits(genome, recentSignals);
            if (Object.keys(updates).length > 0) {
              updateGenome(updates);
            }
          }
        }
        
        updateIntervalRef.current = null;
      }, 5000);
    });

    // Apply adaptation rules whenever genome changes
    const rules = generateAdaptationRules(genome);
    applyAdaptationRules(rules);

    return () => {
      unsubscribe();
      if (updateIntervalRef.current) {
        clearTimeout(updateIntervalRef.current);
      }
    };
  }, [genome, updateGenome, learningEnabled, isMounted]);

  // Re-apply rules when genome updates
  useEffect(() => {
    const rules = generateAdaptationRules(genome);
    applyAdaptationRules(rules);
  }, [genome]);

  return <>{children}</>;
}

