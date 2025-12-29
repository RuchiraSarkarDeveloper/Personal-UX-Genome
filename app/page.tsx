'use client';

import { AdaptiveButton } from '@/components/AdaptiveButton';
import { AdaptiveCard } from '@/components/AdaptiveCard';
import { AdaptiveTooltip } from '@/components/AdaptiveTooltip';
import { GenomeVisualization } from '@/components/GenomeVisualization';
import { ClientOnly } from '@/components/ClientOnly';
import { useState } from 'react';

export default function Home() {
  const [items, setItems] = useState([
    { id: 1, title: 'Adaptive Card 1', description: 'This card adapts to your interaction style' },
    { id: 2, title: 'Adaptive Card 2', description: 'Spacing and animations adjust automatically' },
    { id: 3, title: 'Adaptive Card 3', description: 'No settings needed - it just works' },
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-genome-spacious">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-genome-spacious">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Personal UX Genome
          </h1>
          <p className="text-lg text-gray-600">
            The interface that learns you. Interact naturally, and watch it adapt.
          </p>
        </header>

        {/* Demo Section */}
        <section className="mb-genome-spacious">
          <h2 className="text-2xl font-semibold text-gray-800 mb-genome-standard">
            Adaptive Components
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-genome-standard">
            {items.map((item) => (
              <AdaptiveCard key={item.id} onClick={() => alert(`Clicked ${item.title}`)}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {item.description}
                </p>
                <AdaptiveButton variant="primary" size="standard">
                  Learn More
                </AdaptiveButton>
              </AdaptiveCard>
            ))}
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="mb-genome-spacious">
          <h2 className="text-2xl font-semibold text-gray-800 mb-genome-standard">
            Try It Out
          </h2>
          
          <div className="flex flex-wrap gap-genome-standard">
            <AdaptiveTooltip content="This button adapts its size based on your click precision">
              <AdaptiveButton variant="primary">
                Hover for Tooltip
              </AdaptiveButton>
            </AdaptiveTooltip>
            
            <AdaptiveButton variant="secondary" size="small">
              Small Button
            </AdaptiveButton>
            
            <AdaptiveButton variant="ghost" size="large">
              Large Button
            </AdaptiveButton>
          </div>
        </section>

        {/* Instructions */}
        <section className="mb-genome-spacious">
          <AdaptiveCard>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              How It Works
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">✨</span>
                <span>Interact naturally with the interface - click, scroll, hover, type</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🧬</span>
                <span>The system learns your interaction patterns in the background</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🎨</span>
                <span>UI adapts automatically: animations, spacing, button sizes, tooltips</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔒</span>
                <span>Everything stays on your device - no tracking, no servers</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📊</span>
                <span>Check your profile in the bottom-right corner</span>
              </li>
            </ul>
          </AdaptiveCard>
        </section>

        {/* Genome Visualization */}
        <ClientOnly>
          <GenomeVisualization />
        </ClientOnly>
      </div>
    </main>
  );
}

