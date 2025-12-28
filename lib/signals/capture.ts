/**
 * Signal Capture System
 * 
 * Passively captures interaction telemetry using browser APIs.
 * Never analyzes content, only interaction patterns.
 */

import { SignalCollection, ClickSignal, CursorSignal, ScrollSignal, HoverSignal, FocusSignal, KeyboardSignal, ResizeSignal } from '@/types/genome';

export class SignalCapture {
  private buffer: SignalCollection[] = [];
  private cursorPosition = { x: 0, y: 0, lastX: 0, lastY: 0, lastTime: 0 };
  private scrollState = { lastScroll: 0, lastDirection: 'down' as 'up' | 'down', reversals: 0 };
  private clickState = { corrections: 0, hoverStart: 0, targetElement: null as HTMLElement | null };
  private hoverState = new Map<string, number>(); // element -> hover start time
  private keyboardState = { lastKeyTime: 0, lastKey: '' };
  private sampleRate = 16; // ~60fps
  private lastSample = 0;
  
  private listeners: ((signal: SignalCollection) => void)[] = [];

  constructor() {
    this.setupListeners();
  }

  subscribe(callback: (signal: SignalCollection) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private emit(signal: SignalCollection) {
    this.buffer.push(signal);
    this.listeners.forEach(cb => cb(signal));
    
    // Keep buffer size manageable (last 1000 signals)
    if (this.buffer.length > 1000) {
      this.buffer.shift();
    }
  }

  private setupListeners() {
    // Click tracking
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      
      const rect = target.getBoundingClientRect();
      const targetSize = rect.width * rect.height;
      
      // Calculate miss distance (if click was outside target)
      let missDistance: number | undefined;
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      // Check if click is within bounds (rect.contains doesn't exist on DOMRect)
      const isWithinBounds = 
        clickX >= rect.left && 
        clickX <= rect.right && 
        clickY >= rect.top && 
        clickY <= rect.bottom;
      
      if (!isWithinBounds) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        missDistance = Math.sqrt(
          Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
        );
      }

      const timeToClick = this.clickState.hoverStart 
        ? Date.now() - this.clickState.hoverStart 
        : 0;

      const signal: ClickSignal = {
        type: 'click',
        timestamp: Date.now(),
        data: {
          targetSize,
          missDistance,
          correctionCount: this.clickState.corrections,
          timeToClick,
        },
      };

      this.emit(signal);
      this.clickState = { corrections: 0, hoverStart: 0, targetElement: null };
    });

    // Mouse movement tracking (cursor smoothness)
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - this.lastSample < this.sampleRate) return;
      this.lastSample = now;

      const { x, y } = { x: e.clientX, y: e.clientY };
      const timeDelta = now - this.cursorPosition.lastTime || 16;
      const dx = x - this.cursorPosition.lastX;
      const dy = y - this.cursorPosition.lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = distance / timeDelta;
      const acceleration = timeDelta > 0 
        ? Math.abs(velocity - (this.cursorPosition.lastX ? 
            Math.sqrt(
              Math.pow(this.cursorPosition.lastX - (this.cursorPosition.lastX - dx), 2) +
              Math.pow(this.cursorPosition.lastY - (this.cursorPosition.lastY - dy), 2)
            ) / (timeDelta || 16) : 0)) 
        : 0;

      // Calculate jitter (variance in movement)
      const expectedX = this.cursorPosition.lastX + (dx * 0.5);
      const expectedY = this.cursorPosition.lastY + (dy * 0.5);
      const jitter = Math.sqrt(
        Math.pow(x - expectedX, 2) + Math.pow(y - expectedY, 2)
      );

      const signal: CursorSignal = {
        type: 'cursor',
        timestamp: now,
        data: {
          velocity,
          acceleration,
          jitter,
          pathLength: distance,
        },
      };

      this.emit(signal);

      this.cursorPosition = {
        x,
        y,
        lastX: x,
        lastY: y,
        lastTime: now,
      };
    });

    // Scroll tracking
    let scrollTimeout: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      const now = Date.now();
      const direction = window.scrollY > (this.scrollState.lastScroll || 0) ? 'down' : 'up';
      
      // Detect reversals
      if (direction !== this.scrollState.lastDirection && this.scrollState.lastScroll > 0) {
        this.scrollState.reversals++;
      } else {
        this.scrollState.reversals = 0;
      }

      const delta = Math.abs(window.scrollY - (this.scrollState.lastScroll || 0));
      const timeSinceLastScroll = now - (this.scrollState.lastScroll || now);
      const velocity = delta / (timeSinceLastScroll || 1);

      const signal: ScrollSignal = {
        type: 'scroll',
        timestamp: now,
        data: {
          delta,
          velocity,
          direction,
          reversalCount: this.scrollState.reversals,
          timeSinceLastScroll,
        },
      };

      this.emit(signal);

      this.scrollState.lastScroll = window.scrollY;
      this.scrollState.lastDirection = direction;

      // Reset reversals after scroll stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.scrollState.reversals = 0;
      }, 500);
    });

    // Hover tracking
    document.addEventListener('mouseenter', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      
      const key = target.tagName + (target.className || '');
      this.hoverState.set(key, Date.now());
    }, true);

    document.addEventListener('mouseleave', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      
      const key = target.tagName + (target.className || '');
      const startTime = this.hoverState.get(key);
      
      if (startTime) {
        const dwellTime = Date.now() - startTime;
        const signal: HoverSignal = {
          type: 'hover',
          timestamp: Date.now(),
          data: {
            element: target.tagName.toLowerCase(),
            dwellTime,
            triggered: false, // Would need to track if action was triggered
          },
        };
        this.emit(signal);
        this.hoverState.delete(key);
      }
    }, true);

    // Focus tracking
    document.addEventListener('focusin', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      
      const timeToFocus = Date.now(); // Simplified - would track from page load
      
      // Count tab depth (simplified)
      let tabCount = 0;
      let element: HTMLElement | null = target;
      while (element && element !== document.body) {
        if (element.tabIndex >= 0) tabCount++;
        element = element.parentElement;
      }

      const signal: FocusSignal = {
        type: 'focus',
        timestamp: Date.now(),
        data: {
          element: target.tagName.toLowerCase(),
          timeToFocus,
          tabCount,
        },
      };

      this.emit(signal);
    }, true);

    // Keyboard tracking
    document.addEventListener('keydown', (e) => {
      const now = Date.now();
      const isCorrection = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key);
      
      if (isCorrection) {
        this.clickState.corrections++;
      }

      const signal: KeyboardSignal = {
        type: 'keyboard',
        timestamp: now,
        data: {
          key: e.key,
          timeSinceLastKey: now - this.keyboardState.lastKeyTime,
          isCorrection,
        },
      };

      this.emit(signal);

      this.keyboardState.lastKeyTime = now;
      this.keyboardState.lastKey = e.key;
    });

    // Resize tracking
    let resizeTimeout: NodeJS.Timeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
        
        if (width < 768) deviceType = 'mobile';
        else if (width < 1024) deviceType = 'tablet';

        const signal: ResizeSignal = {
          type: 'resize',
          timestamp: Date.now(),
          data: {
            width,
            height,
            deviceType,
          },
        };

        this.emit(signal);
      }, 250);
    });

    // Track hover start for click timing
    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      
      if (target.onclick || target.getAttribute('role') === 'button' || target.tagName === 'BUTTON') {
        this.clickState.hoverStart = Date.now();
        this.clickState.targetElement = target;
      }
    });
  }

  getRecentSignals(windowMs: number = 60000): SignalCollection[] {
    const cutoff = Date.now() - windowMs;
    return this.buffer.filter(s => s.timestamp >= cutoff);
  }

  clearBuffer() {
    this.buffer = [];
  }

  destroy() {
    // Cleanup would go here if needed
    this.clearBuffer();
  }
}

