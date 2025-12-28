/**
 * Genome Visualization Component
 * 
 * Shows the user their UX profile in a calm, non-technical way.
 */

'use client';

import { useGenomeStore } from '@/store/genomeStore';
import { AdaptiveCard } from './AdaptiveCard';
import { AdaptiveButton } from './AdaptiveButton';
import { useState } from 'react';

export function GenomeVisualization() {
  const { genome, resetGenome, pauseLearning, resumeLearning, exportGenome, importGenome, lockTrait, unlockTrait } = useGenomeStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = () => {
    const json = exportGenome();
    navigator.clipboard.writeText(json);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          if (importGenome(json)) {
            alert('Genome imported successfully!');
          } else {
            alert('Failed to import genome. Invalid format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getTraitLabel = (trait: string, value: any) => {
    const labels: Record<string, Record<string, string>> = {
      motionSensitivity: {
        low: 'Comfortable with motion',
        medium: 'Moderate motion preference',
        high: 'Prefers minimal motion',
      },
      preferredInteractionSpeed: {
        fast: 'Fast-paced interactions',
        balanced: 'Balanced pace',
        slow: 'Deliberate interactions',
      },
      layoutDensityTolerance: {
        compact: 'Comfortable with compact layouts',
        standard: 'Standard spacing preference',
        spacious: 'Prefers spacious layouts',
      },
      guidanceNeed: {
        minimal: 'Prefers minimal guidance',
        contextual: 'Contextual help preferred',
        strong: 'Prefers detailed guidance',
      },
    };
    
    return labels[trait]?.[value] || value;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.7) return 'text-green-600';
    if (confidence > 0.4) return 'text-yellow-600';
    return 'text-gray-400';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <AdaptiveCard className="shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Interface Profile
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>

          <p className="text-sm text-gray-600">
            This is how the interface adapts to you. It learns from your interactions.
          </p>

          {isExpanded && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Motion Sensitivity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Motion Preference
                  </span>
                  <span className={`text-xs ${getConfidenceColor(genome.motionSensitivityMeta.confidence)}`}>
                    {Math.round(genome.motionSensitivityMeta.confidence * 100)}% confident
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {getTraitLabel('motionSensitivity', genome.motionSensitivity)}
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-genome-balanced ${
                      genome.motionSensitivity === 'high' ? 'bg-red-400' :
                      genome.motionSensitivity === 'medium' ? 'bg-yellow-400' :
                      'bg-green-400'
                    }`}
                    style={{
                      width: `${genome.motionSensitivityMeta.confidence * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Interaction Speed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Interaction Pace
                  </span>
                  <span className={`text-xs ${getConfidenceColor(genome.preferredInteractionSpeedMeta.confidence)}`}>
                    {Math.round(genome.preferredInteractionSpeedMeta.confidence * 100)}% confident
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {getTraitLabel('preferredInteractionSpeed', genome.preferredInteractionSpeed)}
                </div>
              </div>

              {/* Layout Density */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Layout Spacing
                  </span>
                  <span className={`text-xs ${getConfidenceColor(genome.layoutDensityToleranceMeta.confidence)}`}>
                    {Math.round(genome.layoutDensityToleranceMeta.confidence * 100)}% confident
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {getTraitLabel('layoutDensityTolerance', genome.layoutDensityTolerance)}
                </div>
              </div>

              {/* Guidance Need */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Guidance Preference
                  </span>
                  <span className={`text-xs ${getConfidenceColor(genome.guidanceNeedMeta.confidence)}`}>
                    {Math.round(genome.guidanceNeedMeta.confidence * 100)}% confident
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {getTraitLabel('guidanceNeed', genome.guidanceNeed)}
                </div>
              </div>

              {/* Learning Status */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Learning
                  </span>
                  <span className={`text-xs ${genome.learningEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                    {genome.learningEnabled ? 'Active' : 'Paused'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <AdaptiveButton
                    size="small"
                    variant="secondary"
                    onClick={() => genome.learningEnabled ? pauseLearning() : resumeLearning()}
                  >
                    {genome.learningEnabled ? 'Pause' : 'Resume'}
                  </AdaptiveButton>
                  <AdaptiveButton
                    size="small"
                    variant="ghost"
                    onClick={resetGenome}
                  >
                    Reset
                  </AdaptiveButton>
                </div>
              </div>

              {/* Export/Import */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <AdaptiveButton
                    size="small"
                    variant="secondary"
                    onClick={handleExport}
                  >
                    {exportSuccess ? 'Copied!' : 'Export'}
                  </AdaptiveButton>
                  <AdaptiveButton
                    size="small"
                    variant="secondary"
                    onClick={handleImport}
                  >
                    Import
                  </AdaptiveButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdaptiveCard>
    </div>
  );
}

