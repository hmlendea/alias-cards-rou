# Concurrency and Scheduling

## Overview

The Alias Cards application is **single-threaded** with **no concurrency primitives** and **no scheduling**. All execution occurs on the main thread in a synchronous, run-to-completion manner.

## Execution Model

### JavaScript Event Loop

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Thread                              │
├─────────────────────────────────────────────────────────────┤
│  Call Stack                                                 │
│  ├── Global: cards.js evaluation                            │
│  ├── Global: script.js evaluation (function declaration)    │
│  ├── $(document).ready callback queued                      │
│  │   └── selectRandomCard() executes synchronously          │
│  │       ├── Object.keys(cards)                             │
│  │       ├── Math.random()                                  │
│  │       ├── Loop 8x: query format, encode, DOM update     │
│  │       └── return                                         │
│  ├── onclick handler queued (button click)                  │
│  │   └── selectRandomCard() executes synchronously          │
│  └── ...                                                    │
│                                                             │
│  Microtask Queue: (empty - no promises)                     │
│  Macrotask Queue: click events, timer callbacks (none)      │
└─────────────────────────────────────────────────────────────┘
```

### No Async Operations

| Async Pattern | Used? | Details |
|---------------|-------|---------|
| `setTimeout`/`setInterval` | ❌ No | No timers |
| `Promise`/`async`/`await` | ❌ No | No promises |
| `fetch`/`XMLHttpRequest` | ❌ No | No network requests |
| `addEventListener` (async) | ❌ No | Only `onclick` attribute |
| `requestAnimationFrame` | ❌ No | No animations |
| `Web Workers` | ❌ No | No workers |
| `Service Worker` | ❌ No | No SW |

## Concurrency Scenarios

### Rapid Button Clicks

```javascript
// User clicks ⟳ 5 times in 100ms
// Each click queues onclick handler
// Event loop processes sequentially:

// Click 1: selectRandomCard() runs to completion
// Click 2: selectRandomCard() runs to completion
// Click 3: selectRandomCard() runs to completion
// Click 4: selectRandomCard() runs to completion
// Click 5: selectRandomCard() runs to completion

// Result: Last card drawn wins visually
// No race conditions (single-threaded)
// No queuing issues (synchronous)
```

### Multiple Tabs

| Scenario | Behaviour |
|----------|-----------|
| User opens 3 tabs | Each tab independent, own `cards` copy, own DOM |
| Tab A draws card | Tab B unaffected |
| Tab A closes | Tab B unaffected |
| No shared state | No BroadcastChannel, no SharedWorker |

### Resource Loading

```
Network requests (parallel, browser-managed):
├── GET index.html
├── GET style.css
├── GET cards.js
├── GET script.js
├── GET jQuery (CDN)
├── GET jQuery Easing (CDN)
└── GET Font Awesome CSS (CDN)

JavaScript execution (sequential, specified order):
1. jQuery executes → defines $, jQuery
2. jQuery Easing executes → extends $.easing
3. cards.js executes → defines cards
4. script.js executes → declares selectRandomCard, binds ready
5. DOMContentLoaded fires
6. $(document).ready callback → selectRandomCard()
```

## Scheduling

### No Application-Level Scheduling

| Scheduler | Used? |
|-----------|-------|
| `setTimeout` | ❌ |
| `setInterval` | ❌ |
| `requestIdleCallback` | ❌ |
| `requestAnimationFrame` | ❌ |
| `queueMicrotask` | ❌ |
| Custom task queue | ❌ |

### Browser-Level Scheduling (Implicit)

| Task | Priority | When |
|------|----------|------|
| Parse HTML | High | Immediately |
| Fetch critical CSS | High | During parse |
| Fetch scripts | High | During parse |
| Execute scripts | High | In order, blocking |
| Layout/Style | High | After DOM ready |
| Paint | High | After layout |
| Fetch fonts (FA) | Low | After CSS parsed |
| Idle callbacks | Low | When idle |

## Thread Safety

### Not Applicable

- Single-threaded JavaScript
- No shared mutable state across threads
- No Web Workers
- No SharedArrayBuffer
- No Atomics

### DOM Mutation Safety

```javascript
// All DOM mutations in selectRandomCard() are:
// 1. Synchronous
// 2. Sequential (8 iterations)
// 3. On same elements (#word1 .word-text through #word8 .word-text)
// 4. No interleaving possible
// 5. Browser batches style/layout/paint after function returns
```

## Race Conditions

### None Possible

| Condition | Why Impossible |
|-----------|----------------|
| Data race | No shared mutable state |
| TOCTOU | No async gaps between check and use |
| Double-checked locking | No locking |
| Lost update | Single writer (main thread) |
| Dirty read | No concurrent readers/writers |

## Resource Contention

### None

| Resource | Contention | Resolution |
|----------|------------|------------|
| `cards` object | Read-only, single thread | N/A |
| DOM elements | Single thread, sequential | N/A |
| Network | Browser manages (6 connections/host) | N/A |
| Main thread | Only consumer | N/A |

## Performance Implications

### Positive

- **Zero context switching** — No async boundaries
- **Zero locking overhead** — No mutexes, no atomics
- **Predictable latency** — Synchronous, deterministic
- **Simple debugging** — Stack traces are linear

### Negative

- **Blocking main thread** — Large `cards.js` parse blocks
- **No background work** — Cannot preload next card
- **No prioritization** — All work same priority
- **Jank risk** — If `cards.js` grows, parse time increases

## If Concurrency Were Added

### Web Worker for Card Selection

```javascript
// worker.js
self.onmessage = (e) => {
  if (e.data.type === 'draw') {
    const keys = Object.keys(e.data.cards);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const card = e.data.cards[randomKey];
    self.postMessage({ type: 'drawn', card, cardId: randomKey });
  }
};

// main.js
const worker = new Worker('worker.js');
worker.onmessage = (e) => {
  if (e.data.type === 'drawn') {
    renderCard(e.data.card);
  }
};

function selectRandomCard() {
  worker.postMessage({ type: 'draw', cards });
}
```

**Trade-off**: Adds complexity, message passing overhead for < 1 ms operation.

### Preload Next Card

```javascript
// In selectRandomCard, after rendering:
if (!nextCardPreloaded) {
  requestIdleCallback(() => {
    const keys = Object.keys(cards);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    nextCardCache = cards[randomKey];
    nextCardPreloaded = true;
  });
}
```

**Trade-off**: Marginal UX improvement, adds state.

## Summary

| Aspect | Status |
|--------|--------|
| Threads | 1 (main) |
| Async operations | 0 |
| Timers | 0 |
| Workers | 0 |
| Promises | 0 |
| Event listeners | 1 (onclick attribute) |
| Race conditions | 0 (impossible) |
| Deadlocks | 0 (impossible) |
| Starvation | 0 (impossible) |
| Priority inversion | 0 (impossible) |

**Design decision**: Concurrency not needed for this workload. Synchronous execution is simpler, faster, and bug-free.