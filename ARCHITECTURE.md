# Personal UX Genome - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  (React Components, UI, User Interactions)                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Genome Provider                            │
│  (Orchestrates signal capture, inference, adaptation)      │
└───────────┬───────────────────────────────┬─────────────────┘
            │                               │
            ▼                               ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│   Signal Capture Layer   │   │   Trait Inference Engine     │
│                          │   │                              │
│  • Click tracking        │   │  • Statistical analysis      │
│  • Cursor movement       │   │  • Confidence weighting      │
│  • Scroll behavior       │   │  • Decay functions           │
│  • Hover detection       │   │  • Trait inference           │
│  • Focus tracking        │   │                              │
│  • Keyboard events       │   │                              │
└───────────┬──────────────┘   └──────────────┬───────────────┘
            │                                 │
            └───────────┬─────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Genome Store (Zustand)                     │
│                                                             │
│  • State management                                         │
│  • LocalStorage persistence                                 │
│  • Learning state control                                   │
│  • Trait locking/unlocking                                  │
│  • Export/import functionality                              │
└───────────┬─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│              Adaptation Rules Engine                        │
│                                                             │
│  • Trait → CSS variable mapping                             │
│  • Animation duration calculation                           │
│  • Spacing scale generation                                 │
│  • Button size adaptation                                   │
│  • Tooltip behavior rules                                   │
└───────────┬─────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│              Adaptive UI Components                         │
│                                                             │
│  • AdaptiveButton                                           │
│  • AdaptiveCard                                             │
│  • AdaptiveTooltip                                          │
│  • GenomeVisualization                                      │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Signal Capture Flow

```
User Interaction
    │
    ▼
Browser Event (click, mousemove, scroll, etc.)
    │
    ▼
SignalCapture Class
    │
    ├─→ Normalize signal data
    ├─→ Calculate derived metrics (velocity, jitter, etc.)
    └─→ Emit SignalCollection
        │
        ▼
    Signal Buffer (last 1000 signals)
```

### 2. Trait Inference Flow

```
Signal Buffer (last 30 seconds)
    │
    ▼
TraitInferenceEngine
    │
    ├─→ Group signals by type
    ├─→ Calculate statistics (averages, rates, etc.)
    ├─→ Infer trait values
    ├─→ Calculate confidence scores
    └─→ Apply confidence-weighted updates
        │
        ▼
    Partial UXGenome updates
```

### 3. Adaptation Flow

```
UXGenome (current state)
    │
    ▼
AdaptationRulesEngine
    │
    ├─→ Map traits to CSS variables
    ├─→ Calculate animation durations
    ├─→ Generate spacing scales
    └─→ Determine UI behaviors
        │
        ▼
    AdaptationRules object
        │
        ▼
    CSS Variables (applied to :root)
        │
        ▼
    Adaptive Components (consume CSS variables)
```

## 🧬 Signal → Trait Mapping

### Motion Sensitivity

**Signals:**
- Scroll reversal frequency
- Cursor jitter during movement
- Click corrections during animations

**Inference:**
```typescript
sensitivityScore = (
  reversalRate * 0.4 +
  (avgJitter > 10 ? 0.3 : 0) +
  (avgCorrections > 1 ? 0.3 : 0)
)
```

**Adaptation:**
- Animation duration multiplier: 0.6x (high) to 1.2x (low)
- Transition type: linear (high) to ease (low)

### Interaction Speed

**Signals:**
- Time-to-click latency
- Cursor velocity
- Hover dwell time

**Inference:**
```typescript
speedScore = (
  (timeToClick < 200 ? 1 : 0.5 : 0) * 0.4 +
  (cursorVelocity > 1 ? 1 : 0.5 : 0) * 0.3 +
  (hoverDwell < 200 ? 1 : 0.5 : 0) * 0.3
)
```

**Adaptation:**
- Animation duration multiplier: 0.8x (fast) to 1.3x (slow)
- Auto-focus enabled for fast users

### Layout Density Tolerance

**Signals:**
- Click miss rate
- Average target size clicked
- Click precision

**Inference:**
```typescript
densityScore = (
  (missRate > 0.3 ? 0 : 0.5 : 1) * 0.4 +
  (targetSize < 500 ? 0 : 0.5 : 1) * 0.3 +
  (precision > 0.8 ? 1 : 0.5 : 0) * 0.3
)
```

**Adaptation:**
- Spacing scale: compact (0.25-1rem) to spacious (0.75-2rem)
- Button sizes: smaller for high precision, larger for low precision

### Guidance Need

**Signals:**
- Hover dwell time
- Click correction rate

**Inference:**
```typescript
guidanceScore = (
  (avgDwell > 500 ? 1 : 0.5 : 0) * 0.6 +
  (correctionRate > 1 ? 1 : 0.5 : 0) * 0.4
)
```

**Adaptation:**
- Tooltip delay: 200ms (strong) to 1000ms (minimal)
- Tooltip duration: 6000ms (strong) to 2000ms (minimal)

### Cognitive Load Threshold

**Signals:**
- Rapid focus changes
- High cursor jitter
- Scroll oscillation

**Inference:**
```typescript
loadScore = min(1, (
  (rapidFocusChanges / totalFocus) * 0.4 +
  (avgJitter / 20) * 0.3 +
  oscillationRate * 0.3
))
```

**Adaptation:**
- Information chunking: 3 items (high load) to 7 items (low load)
- UI simplification triggers

## 🔐 Privacy Architecture

### Data Storage

```
┌─────────────────────────────────────┐
│      LocalStorage (Browser)         │
│                                     │
│  • UXGenome JSON                    │
│  • No raw signals stored            │
│  • No content analysis              │
│  • No identifiers                   │
└─────────────────────────────────────┘
```

### Signal Processing

- **No Content Analysis**: Only interaction patterns, never page content
- **No Identity Inference**: No fingerprinting or user identification
- **No Health/Emotion Detection**: Only UX behavior patterns
- **No Network Calls**: 100% client-side processing
- **User Control**: Export/import, pause/resume, reset at any time

## 🎯 State Machine: Learning Lifecycle

```
┌──────────┐
│ Observing│ ← Initial state, collecting samples
└────┬─────┘
     │ (10+ samples, confidence > 0.4)
     ▼
┌──────────┐
│ Tentative│ ← Low confidence, still learning
└────┬─────┘
     │ (confidence > 0.7)
     ▼
┌──────────┐
│ Confident│ ← High confidence, stable trait
└────┬─────┘
     │ (user locks)
     ▼
┌──────────┐
│  Locked  │ ← User manually locked, won't update
└──────────┘

     ┌──────────┐
     │  Paused  │ ← Learning disabled (can be temporary)
     └──────────┘
```

## 🚀 Performance Considerations

### Signal Capture
- **Sampling Rate**: ~60fps (16ms intervals)
- **Buffer Size**: Last 1000 signals (auto-pruned)
- **Event Delegation**: Single listeners on document/window

### Trait Inference
- **Update Frequency**: Every 5 seconds (debounced)
- **Window Size**: Last 30 seconds of signals
- **Minimum Samples**: 10 signals before inference

### CSS Variable Updates
- **Update Frequency**: Only on genome changes
- **Batch Updates**: Single DOM write per update
- **No Re-renders**: CSS variables don't trigger React re-renders

## 🔄 Cross-App Compatibility

### Genome Format

```json
{
  "version": "1.0.0",
  "createdAt": 1234567890,
  "lastUpdated": 1234567890,
  "motionSensitivity": "medium",
  "motionSensitivityMeta": { ... },
  ...
}
```

### Import/Export Flow

```
App A                    User                    App B
  │                       │                        │
  ├─→ Export Genome ──────┼───────────────────────→│
  │   (JSON string)       │                        │
  │                       │                        │
  │                       │◄─── Import Genome ─────┤
  │                       │     (JSON string)      │
  │                       │                        │
  └───────────────────────┴────────────────────────┘
```

## 🧪 Testing Strategy

### Unit Tests
- Signal normalization
- Trait inference logic
- Confidence calculations
- Adaptation rule generation

### Integration Tests
- Signal capture → inference → adaptation flow
- Genome persistence
- Export/import functionality

### E2E Tests
- User interaction → UI adaptation
- Learning state transitions
- Privacy compliance

## 📊 Monitoring & Observability

### Metrics to Track (Client-Side Only)
- Signal capture rate
- Inference confidence scores
- Trait stability over time
- Adaptation rule application success

### Debug Mode
- Visualize signal stream
- Show trait inference reasoning
- Display confidence scores
- Log adaptation changes

---

This architecture enables **invisible personalization** while maintaining **absolute privacy** and **user control**.

