/**
 * UX Genome Store (Zustand)
 * 
 * Manages the living UX profile with persistence and learning state.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UXGenome, TraitMetadata, LearningState } from '@/types/genome';

const DEFAULT_GENOME: UXGenome = {
  version: '1.0.0',
  createdAt: Date.now(),
  lastUpdated: Date.now(),
  
  motionSensitivity: 'medium',
  motionSensitivityMeta: createDefaultMeta(),
  
  preferredInteractionSpeed: 'balanced',
  preferredInteractionSpeedMeta: createDefaultMeta(),
  
  layoutDensityTolerance: 'standard',
  layoutDensityToleranceMeta: createDefaultMeta(),
  
  guidanceNeed: 'contextual',
  guidanceNeedMeta: createDefaultMeta(),
  
  cognitiveLoadThreshold: 0.5,
  cognitiveLoadThresholdMeta: createDefaultMeta(),
  
  clickPrecision: 0.5,
  cursorSmoothness: 0.5,
  scrollBehavior: 'mixed',
  hoverDwellTime: 300,
  navigationDepthTolerance: 3,
  
  learningEnabled: true,
};

function createDefaultMeta(): TraitMetadata {
  return {
    confidence: 0,
    lastUpdated: Date.now(),
    sampleCount: 0,
    state: 'observing',
  };
}

interface GenomeStore {
  genome: UXGenome;
  updateGenome: (updates: Partial<UXGenome>) => void;
  resetGenome: () => void;
  pauseLearning: (durationMs?: number) => void;
  resumeLearning: () => void;
  lockTrait: (trait: keyof UXGenome) => void;
  unlockTrait: (trait: keyof UXGenome) => void;
  exportGenome: () => string;
  importGenome: (json: string) => boolean;
}

export const useGenomeStore = create<GenomeStore>()(
  persist(
    (set, get) => ({
      genome: DEFAULT_GENOME,
      
      updateGenome: (updates) => {
        set((state) => {
          const updatedGenome = {
            ...state.genome,
            ...updates,
            lastUpdated: Date.now(),
          };
          
          // Don't update locked traits
          Object.keys(updates).forEach((key) => {
            const traitKey = key as keyof UXGenome;
            const metaKey = `${traitKey}Meta` as keyof UXGenome;
            const meta = updatedGenome[metaKey] as TraitMetadata | undefined;
            
            if (meta && meta.state === 'locked') {
              // Revert to previous value
              (updatedGenome as any)[traitKey] = (state.genome as any)[traitKey];
            }
          });
          
          return { genome: updatedGenome };
        });
      },
      
      resetGenome: () => {
        set({ genome: { ...DEFAULT_GENOME, createdAt: Date.now() } });
      },
      
      pauseLearning: (durationMs?: number) => {
        set((state) => ({
          genome: {
            ...state.genome,
            learningEnabled: false,
            pausedUntil: durationMs ? Date.now() + durationMs : undefined,
          },
        }));
        
        if (durationMs) {
          setTimeout(() => {
            get().resumeLearning();
          }, durationMs);
        }
      },
      
      resumeLearning: () => {
        set((state) => ({
          genome: {
            ...state.genome,
            learningEnabled: true,
            pausedUntil: undefined,
          },
        }));
      },
      
      lockTrait: (trait) => {
        set((state) => {
          const metaKey = `${trait}Meta` as keyof UXGenome;
          const meta = state.genome[metaKey] as TraitMetadata | undefined;
          
          if (meta) {
            return {
              genome: {
                ...state.genome,
                [metaKey]: {
                  ...meta,
                  state: 'locked',
                },
              },
            };
          }
          
          return state;
        });
      },
      
      unlockTrait: (trait) => {
        set((state) => {
          const metaKey = `${trait}Meta` as keyof UXGenome;
          const meta = state.genome[metaKey] as TraitMetadata | undefined;
          
          if (meta && meta.state === 'locked') {
            return {
              genome: {
                ...state.genome,
                [metaKey]: {
                  ...meta,
                  state: meta.sampleCount > 10 ? 'confident' : 'tentative',
                },
              },
            };
          }
          
          return state;
        });
      },
      
      exportGenome: () => {
        const genome = get().genome;
        return JSON.stringify(genome, null, 2);
      },
      
      importGenome: (json) => {
        try {
          const imported = JSON.parse(json) as UXGenome;
          
          // Validate structure
          if (!imported.version || !imported.createdAt) {
            return false;
          }
          
          set({ genome: imported });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'ux-genome-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

