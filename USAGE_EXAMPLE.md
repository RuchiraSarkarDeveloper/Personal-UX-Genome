# Usage Examples

## Basic Integration

### 1. Wrap Your App with GenomeProvider

```tsx
// app/layout.tsx or _app.tsx
import { GenomeProvider } from '@/components/GenomeProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GenomeProvider>
          {children}
        </GenomeProvider>
      </body>
    </html>
  );
}
```

### 2. Use Adaptive Components

```tsx
import { AdaptiveButton, AdaptiveCard, AdaptiveTooltip } from '@/components';

function MyPage() {
  return (
    <div>
      <AdaptiveButton variant="primary" size="standard">
        Click Me
      </AdaptiveButton>
      
      <AdaptiveCard>
        <h2>Adaptive Content</h2>
        <p>This card adapts spacing and animations automatically.</p>
      </AdaptiveCard>
      
      <AdaptiveTooltip content="This tooltip adapts its delay based on your guidance preference">
        <button>Hover me</button>
      </AdaptiveTooltip>
    </div>
  );
}
```

## Custom Components Using Genome

### Access Genome Data

```tsx
import { useGenomeStore } from '@/store/genomeStore';

function CustomComponent() {
  const { genome } = useGenomeStore();
  
  // Use genome traits to customize behavior
  const animationDuration = 
    genome.preferredInteractionSpeed === 'fast' ? 100 : 
    genome.preferredInteractionSpeed === 'slow' ? 400 : 
    250;
  
  return (
    <div 
      style={{ 
        transitionDuration: `${animationDuration}ms`,
        padding: genome.layoutDensityTolerance === 'spacious' ? '2rem' : '1rem'
      }}
    >
      Content that adapts
    </div>
  );
}
```

### Use CSS Variables

```tsx
function CustomStyledComponent() {
  return (
    <div 
      className="transition-all"
      style={{
        transitionDuration: 'var(--genome-animation-balanced)',
        padding: 'var(--genome-spacing-standard)',
        gap: 'var(--genome-spacing-compact)',
      }}
    >
      Uses genome CSS variables
    </div>
  );
}
```

## Advanced: Custom Adaptation Rules

```tsx
import { generateAdaptationRules, applyAdaptationRules } from '@/lib/adaptation/rules';
import { useGenomeStore } from '@/store/genomeStore';

function CustomAdaptiveComponent() {
  const { genome } = useGenomeStore();
  const rules = generateAdaptationRules(genome);
  
  // Use rules directly
  return (
    <div
      style={{
        animationDuration: `${rules.animationFast}ms`,
        maxWidth: rules.maxItemsPerChunk === 3 ? '300px' : '600px',
      }}
    >
      Custom adaptation logic
    </div>
  );
}
```

## Control Learning

```tsx
import { useGenomeStore } from '@/store/genomeStore';

function LearningControls() {
  const { 
    genome, 
    pauseLearning, 
    resumeLearning, 
    resetGenome,
    lockTrait,
    unlockTrait 
  } = useGenomeStore();
  
  return (
    <div>
      <button onClick={() => pauseLearning()}>
        Pause Learning
      </button>
      
      <button onClick={() => resumeLearning()}>
        Resume Learning
      </button>
      
      <button onClick={() => resetGenome()}>
        Reset Genome
      </button>
      
      <button onClick={() => lockTrait('motionSensitivity')}>
        Lock Motion Sensitivity
      </button>
      
      <button onClick={() => unlockTrait('motionSensitivity')}>
        Unlock Motion Sensitivity
      </button>
    </div>
  );
}
```

## Export/Import Genome

```tsx
import { useGenomeStore } from '@/store/genomeStore';

function GenomeManager() {
  const { exportGenome, importGenome } = useGenomeStore();
  
  const handleExport = () => {
    const json = exportGenome();
    // Copy to clipboard
    navigator.clipboard.writeText(json);
    // Or download as file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ux-genome.json';
    a.click();
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
            alert('Failed to import genome.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  
  return (
    <div>
      <button onClick={handleExport}>Export Genome</button>
      <button onClick={handleImport}>Import Genome</button>
    </div>
  );
}
```

## Conditional Rendering Based on Genome

```tsx
import { useGenomeStore } from '@/store/genomeStore';

function AdaptiveUI() {
  const { genome } = useGenomeStore();
  
  // Show more guidance if needed
  if (genome.guidanceNeed === 'strong') {
    return (
      <div>
        <h2>Step-by-step Guide</h2>
        <DetailedInstructions />
      </div>
    );
  }
  
  // Minimal UI for experienced users
  if (genome.guidanceNeed === 'minimal') {
    return <CompactUI />;
  }
  
  // Default contextual UI
  return <StandardUI />;
}
```

## Chunking Based on Cognitive Load

```tsx
import { useGenomeStore } from '@/store/genomeStore';
import { generateAdaptationRules } from '@/lib/adaptation/rules';

function AdaptiveList({ items }: { items: any[] }) {
  const { genome } = useGenomeStore();
  const rules = generateAdaptationRules(genome);
  
  // Chunk items based on cognitive load
  const chunkSize = rules.maxItemsPerChunk;
  const chunks = [];
  
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  
  return (
    <div>
      {chunks.map((chunk, index) => (
        <div key={index} className="mb-genome-standard">
          {chunk.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## Animation Adaptation

```tsx
import { useGenomeStore } from '@/store/genomeStore';

function AnimatedComponent() {
  const { genome } = useGenomeStore();
  
  // Adapt animation based on motion sensitivity
  const getAnimationStyle = () => {
    if (genome.motionSensitivity === 'high') {
      return {
        transition: 'opacity 150ms linear', // Shorter, linear
      };
    }
    
    if (genome.motionSensitivity === 'low') {
      return {
        transition: 'all 400ms ease', // Longer, eased
      };
    }
    
    return {
      transition: 'all 250ms ease-out', // Default
    };
  };
  
  return (
    <div style={getAnimationStyle()}>
      Animated content
    </div>
  );
}
```

## Button Size Adaptation

```tsx
import { useGenomeStore } from '@/store/genomeStore';

function AdaptiveButtonSize() {
  const { genome } = useGenomeStore();
  
  // Larger buttons for lower precision
  const buttonSize = genome.clickPrecision > 0.8 
    ? '2rem' 
    : genome.clickPrecision > 0.6 
    ? '2.5rem' 
    : '3rem';
  
  return (
    <button
      style={{
        minHeight: buttonSize,
        minWidth: buttonSize,
        padding: genome.layoutDensityTolerance === 'spacious' 
          ? '1rem 2rem' 
          : '0.75rem 1.5rem',
      }}
    >
      Click Me
    </button>
  );
}
```

## Real-World Example: Dashboard

```tsx
import { GenomeProvider } from '@/components/GenomeProvider';
import { AdaptiveCard, AdaptiveButton } from '@/components';
import { useGenomeStore } from '@/store/genomeStore';
import { generateAdaptationRules } from '@/lib/adaptation/rules';

function Dashboard() {
  const { genome } = useGenomeStore();
  const rules = generateAdaptationRules(genome);
  
  return (
    <GenomeProvider>
      <div 
        className="dashboard"
        style={{
          gap: `var(--genome-spacing-${genome.layoutDensityTolerance})`,
        }}
      >
        <AdaptiveCard>
          <h2>Metrics</h2>
          {/* Content adapts spacing automatically */}
        </AdaptiveCard>
        
        <AdaptiveCard>
          <h2>Charts</h2>
          {/* Charts adapt animation speed */}
        </AdaptiveCard>
        
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${rules.maxItemsPerChunk}, 1fr)` }}>
          {/* Grid adapts to cognitive load */}
        </div>
      </div>
    </GenomeProvider>
  );
}
```

---

These examples show how to integrate Personal UX Genome into any React/Next.js application. The system works invisibly in the background, but you can also access genome data for custom adaptations.

