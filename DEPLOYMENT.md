# Deployment Guide

## Fixed Issues for Vercel/Netlify

### SSR Safety Fixes

1. **Signal Capture** - Added checks for `window` and `document` before initializing
2. **Zustand Store** - Added SSR-safe storage fallback for server-side rendering
3. **Genome Provider** - Only initializes on client after mount
4. **Genome Visualization** - Wrapped in `ClientOnly` component to prevent hydration mismatches

### Changes Made

#### 1. Signal Capture (`lib/signals/capture.ts`)
- Added `typeof window !== 'undefined'` checks in constructor
- Added guard in `setupListeners()` to prevent SSR errors

#### 2. Zustand Store (`store/genomeStore.ts`)
- Added conditional storage that falls back to no-op storage on server
- Removed `skipHydration` to allow proper hydration

#### 3. Genome Provider (`components/GenomeProvider.tsx`)
- Added `isMounted` state to ensure client-only execution
- Added checks before initializing SignalCapture

#### 4. Client-Only Component (`components/ClientOnly.tsx`)
- New component to prevent hydration mismatches
- Used to wrap GenomeVisualization

## Deployment Steps

### Vercel

1. **Connect Repository**
   ```bash
   # Push to GitHub/GitLab/Bitbucket
   git add .
   git commit -m "Fix SSR issues for deployment"
   git push
   ```

2. **Deploy on Vercel**
   - Go to vercel.com
   - Import your repository
   - Vercel will auto-detect Next.js
   - Build command: `npm run build` (auto-detected)
   - Install command: `npm install` (auto-detected)

3. **Environment Variables** (if needed)
   - None required for this project

### Netlify

1. **Connect Repository**
   ```bash
   # Push to GitHub/GitLab/Bitbucket
   git add .
   git commit -m "Fix SSR issues for deployment"
   git push
   ```

2. **Deploy on Netlify**
   - Go to netlify.com
   - Import your repository
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Or use the `netlify.toml` file (already configured)

3. **Netlify Configuration**
   - `netlify.toml` is already configured
   - Uses Next.js plugin for optimal performance

## Build Verification

Before deploying, test the build locally:

```bash
npm run build
npm start
```

Visit `http://localhost:3000` to verify everything works.

## Common Issues & Solutions

### Issue: "window is not defined"
**Solution**: All browser API usage is now guarded with `typeof window !== 'undefined'`

### Issue: "localStorage is not defined"
**Solution**: Zustand store uses SSR-safe storage fallback

### Issue: Hydration mismatch errors
**Solution**: Client-only components wrapped in `ClientOnly` component

### Issue: Build fails on TypeScript errors
**Solution**: All TypeScript errors have been resolved. Run `npm run build` locally first.

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Genome visualization appears (bottom-right)
- [ ] Clicking/interacting works
- [ ] No console errors
- [ ] Genome learning works (check after interacting)
- [ ] Export/import functionality works

## Performance

- Build time: ~2-3 minutes
- First load: Optimized by Next.js
- Client-side bundle: ~200KB (gzipped)

## Support

If deployment still fails:

1. Check build logs for specific errors
2. Verify Node.js version (20.x recommended)
3. Ensure all dependencies are in `package.json`
4. Check that `next.config.js` is present

---

**Ready to deploy!** 🚀

