# Personal UX Genome 🧬✨

**The Interface That Learns You**

A frontend-only, privacy-first personalization engine that continuously learns how you interact and adapts UI behavior to match your unique interaction signature.

## 🎯 Vision

This is not customization. This is **personalized interaction infrastructure**.

Every app should feel like it was designed specifically for one person. That person is you.

## 🧠 Core Innovation

### What Makes This Different

1. **Behavior-Driven, Not Preference-Driven**
   - Learns from how you actually interact, not what you say you want
   - No settings to configure
   - Adapts invisibly in the background

2. **Privacy-First Architecture**
   - 100% client-side
   - No server communication
   - No tracking or fingerprinting
   - User owns all data

3. **Cross-App Portable**
   - Export/import your UX profile
   - JSON-based genome format
   - Works across any supported app

4. **Confidence-Weighted Learning**
   - Prevents overfitting
   - No sudden UI changes
   - Explainable adaptations

## 🧬 UX Genome Traits

The system learns and adapts:

- **Motion Sensitivity**: How you react to animations and transitions
- **Interaction Speed**: Your natural pace (fast, balanced, slow)
- **Layout Density Tolerance**: Comfort with compact vs spacious layouts
- **Guidance Need**: How much help you prefer (minimal, contextual, strong)
- **Cognitive Load Threshold**: When to simplify the UI automatically

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Signal Capture Layer            │
│  (Clicks, Cursor, Scroll, Hover, etc.)  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│       Trait Inference Engine            │
│  (Statistical Analysis + Confidence)   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         UX Genome Store                 │
│      (Zustand + Persistence)            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Adaptation Rules Engine            │
│  (CSS Variables + UI Behaviors)        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Adaptive UI Components             │
│  (Buttons, Cards, Tooltips, etc.)      │
└─────────────────────────────────────────┘
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### Build

```bash
npm run build
npm start
```

## 📦 Tech Stack

- **React 18** + **Next.js 14** - UI framework
- **TypeScript** - Type safety
- **Zustand** - State management with persistence
- **Tailwind CSS** - Styling with CSS variables
- **Browser APIs** - Signal capture (no external dependencies)

## 🧪 How It Works

### Signal Capture

The system passively captures:
- Click precision (misses, corrections)
- Cursor smoothness vs jitter
- Scroll speed & reversal frequency
- Time-to-action latency
- Hover dwell time
- Navigation depth tolerance

### Trait Inference

Uses statistical analysis to infer traits:
- Rolling window statistics
- Confidence-weighted averages
- Decay functions (recent behavior matters more)

### Adaptation

Converts traits into UI behaviors:
- Animation durations
- Spacing & density
- Button sizes
- Tooltip frequency
- Transition styles
- Information chunking

## 🔐 Privacy & Ethics

- ✅ No content analysis
- ✅ No identity inference
- ✅ No health/emotion detection
- ✅ No raw interaction logs stored
- ✅ No cross-site tracking
- ✅ No fingerprinting
- ✅ User-controlled export/import
- ✅ Full transparency on traits

## 🎨 Usage in Your App

### 1. Wrap Your App

```tsx
import { GenomeProvider } from '@/components/GenomeProvider';

export default function App() {
  return (
    <GenomeProvider>
      <YourApp />
    </GenomeProvider>
  );
}
```

### 2. Use Adaptive Components

```tsx
import { AdaptiveButton, AdaptiveCard } from '@/components';

<AdaptiveButton variant="primary" size="standard">
  Click Me
</AdaptiveButton>

<AdaptiveCard>
  Content that adapts automatically
</AdaptiveCard>
```

### 3. Access Genome Data

```tsx
import { useGenomeStore } from '@/store/genomeStore';

function MyComponent() {
  const { genome } = useGenomeStore();
  
  // Use genome traits to customize behavior
  const animationSpeed = genome.preferredInteractionSpeed === 'fast' ? 100 : 300;
  
  return <div style={{ transitionDuration: `${animationSpeed}ms` }}>...</div>;
}
```

## 📊 Genome Schema

```typescript
interface UXGenome {
  version: string;
  createdAt: number;
  lastUpdated: number;
  
  // Core Traits
  motionSensitivity: 'low' | 'medium' | 'high';
  preferredInteractionSpeed: 'fast' | 'balanced' | 'slow';
  layoutDensityTolerance: 'compact' | 'standard' | 'spacious';
  guidanceNeed: 'minimal' | 'contextual' | 'strong';
  cognitiveLoadThreshold: number; // 0-1
  
  // Derived Metrics
  clickPrecision: number;
  cursorSmoothness: number;
  scrollBehavior: 'continuous' | 'burst' | 'mixed';
  hoverDwellTime: number;
  
  // System State
  learningEnabled: boolean;
}
```

## 🎯 Interview Talking Points

### Why This Is Revolutionary

1. **Invisible Personalization**
   - No onboarding surveys
   - No settings pages
   - Just works

2. **Ethical AI Behavior**
   - Confidence-weighted learning prevents wrong assumptions
   - Explainable adaptations
   - User control at every level

3. **System-Level Thinking**
   - Not a feature, but infrastructure
   - Cross-app compatibility
   - Portable UX DNA

4. **Accessibility at Scale**
   - Automatically detects motion sensitivity
   - Adapts to cognitive load
   - No manual configuration needed

## 🔮 Future Enhancements

- [ ] Drift detection (behavior change over time)
- [ ] Temporal context awareness (morning vs night patterns)
- [ ] A/B testing on single user (micro-variants)
- [ ] Multi-device sync (user-controlled)
- [ ] Community genome sharing (opt-in)

## 📝 License

MIT

## 🙏 Acknowledgments

Built with the philosophy that UX should adapt to humans, not train humans.

---

**This is not customization. This is interaction DNA.** 🧬

