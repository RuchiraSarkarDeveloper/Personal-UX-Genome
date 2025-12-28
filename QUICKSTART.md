# Quick Start Guide 🚀

Get Personal UX Genome running in 5 minutes.

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What You'll See

1. **Demo Page**: Interactive examples of adaptive components
2. **Genome Visualization**: Bottom-right corner widget showing your UX profile
3. **Live Learning**: Interact with the page and watch the genome learn

## Try It Out

1. **Click around**: The system learns your click precision
2. **Scroll**: It detects your scroll patterns (continuous vs burst)
3. **Hover**: Tooltips adapt their delay based on your behavior
4. **Move your mouse**: Cursor smoothness is measured
5. **Check your profile**: Click the "+" in the bottom-right widget

## Key Features to Test

### Adaptive Animations
- Click buttons and watch animations
- Scroll the page
- Notice how animation speeds adapt to your motion sensitivity

### Adaptive Spacing
- Cards automatically adjust spacing based on your density tolerance
- Button sizes adapt to your click precision

### Adaptive Tooltips
- Hover over the "Hover for Tooltip" button
- Notice the delay changes based on your guidance need

### Learning Control
- Click "Pause" in the genome widget to stop learning
- Click "Reset" to start fresh
- Export your genome to see the JSON format

## Next Steps

1. **Read the README**: Understand the vision and architecture
2. **Check ARCHITECTURE.md**: Deep dive into system design
3. **Review USAGE_EXAMPLE.md**: Learn how to integrate into your app
4. **Read INTERVIEW_GUIDE.md**: Prepare for technical discussions

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx          # Root layout with GenomeProvider
│   ├── page.tsx            # Demo page
│   └── globals.css         # Global styles with CSS variables
│
├── components/             # React components
│   ├── GenomeProvider.tsx  # Main orchestrator
│   ├── AdaptiveButton.tsx  # Adaptive button component
│   ├── AdaptiveCard.tsx    # Adaptive card component
│   ├── AdaptiveTooltip.tsx # Adaptive tooltip component
│   └── GenomeVisualization.tsx # Profile visualization
│
├── lib/                    # Core libraries
│   ├── signals/           # Signal capture system
│   ├── inference/         # Trait inference engine
│   └── adaptation/        # Adaptation rules
│
├── store/                  # State management
│   └── genomeStore.ts     # Zustand store with persistence
│
└── types/                  # TypeScript definitions
    └── genome.ts          # Core type definitions
```

## Troubleshooting

### "Module not found" errors
```bash
npm install
```

### TypeScript errors
```bash
# Make sure all dependencies are installed
npm install

# Check tsconfig.json paths are correct
```

### CSS not applying
```bash
# Make sure Tailwind is configured
# Check tailwind.config.js and postcss.config.js exist
```

### Genome not learning
- Make sure you're interacting with the page (clicking, scrolling, hovering)
- Check browser console for errors
- Verify GenomeProvider is wrapping your app in layout.tsx

## Build for Production

```bash
npm run build
npm start
```

## Key Concepts

1. **Signals**: Raw interaction data (clicks, cursor movement, etc.)
2. **Traits**: Inferred UX characteristics (motion sensitivity, speed, etc.)
3. **Genome**: Your complete UX profile
4. **Adaptation**: How UI changes based on your genome

## Privacy Note

Everything runs client-side. No data leaves your browser. Check the genome widget to see exactly what's being learned.

---

**Ready to build?** Start with `USAGE_EXAMPLE.md` to integrate into your own app!

