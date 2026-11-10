# Startup and Rendering Flow

## Overview

This flow describes the complete sequence from browser navigation to interactive card display.

## Flow Diagram

```mermaid
flowchart TD
    A[User navigates to URL] --> B[Browser requests index.html]
    B --> C[Server returns HTML]
    C --> D[Browser parses HTML]
    D --> E[Blocking resources discovered]
    E --> F1[GET style.css]
    E --> F2[GET Font Awesome CSS]
    E --> F3[GET jQuery JS]
    E --> F4[GET jQuery Easing JS]
    E --> F5[GET cards.js]
    E --> F6[GET script.js]
    F1 --> G[All resources loaded]
    F2 --> G
    F3 --> G
    F4 --> G
    F5 --> G
    F6 --> G
    G --> H[JS execution: jQuery defines $]
    H --> I[JS execution: jQuery Easing extends $.easing]
    I --> J[JS execution: cards.js defines cards object]
    J --> K[JS execution: script.js binds ready handler]
    K --> L[Browser constructs DOM]
    L --> M[DOMContentLoaded fires]
    M --> N[$(document).ready callback queued]
    N --> O[selectRandomCard executes]
    O --> P[keys = Object.keys(cards)]
    P --> Q[randomKey = keys[Math.floor(Math.random() * keys.length)]]
    Q --> R[selectedCard = cards[randomKey]]
    R --> S[For each word1..word8]
    S --> T[wordText = selectedCard[word]]
    T --> U[parts = wordText.trim().split(/\s+/)]
    U --> V{parts.length === 1 OR<br/>(parts.length === 2 AND parts[0] === 'a')?}
    V -->|Yes| W[query = wordText + ' DEX']
    V -->|No| X[query = 'Definiție: ' + wordText]
    W --> Y[encodedQuery = encodeURIComponent(query)]
    X --> Y
    Y --> Z[url = 'https://search.nucilandia.ro?q=' + encodedQuery]
    Z --> AA[escapedText = $('<span>').text(wordText).html()]
    AA --> BB[anchorHTML = '<a href=\"' + url + '\" target=\"_blank\" rel=\"noopener noreferrer\">' + escapedText + '</a>']
    BB --> CC[$('#' + word + ' .word-text').html(anchorHTML)]
    CC --> DD[All 8 words populated]
    DD --> EE[Browser renders card]
    EE --> FF[Interactive: button + 8 links ready]
```

## Detailed Steps

### Phase 1: Network & Resource Loading (100–400 ms)

| Step | Resource | Size | Blocking | Notes |
|------|----------|------|----------|-------|
| 1 | `index.html` | ~2 KB | Yes | Entry point |
| 2 | `style.css` | ~3 KB | Yes | Local, fast |
| 3 | Font Awesome CSS | ~50 KB | Yes | CDN, 1 request |
| 4 | jQuery 3.6.3 | ~30 KB | Yes | CDN, 1 request |
| 5 | jQuery Easing | ~5 KB | Yes | CDN, 1 request |
| 6 | `cards.js` | ~80 KB | Yes | Local, largest |
| 7 | `script.js` | ~1 KB | Yes | Local, tiny |

**Parallel downloads**: Browser downloads 2–6 concurrently (up to 6 connections/host).

**Critical path**: `cards.js` (80 KB) + `jQuery` (30 KB) = ~110 KB on cdnjs.cloudflare.com.

### Phase 2: JavaScript Execution (5–15 ms)

| Order | Script | Action | Globals Created |
|-------|--------|--------|-----------------|
| 1 | jQuery | IIFE executes, defines `$`, `jQuery` | `$`, `jQuery` |
| 2 | jQuery Easing | Extends `$.easing` | `$.easing` |
| 3 | `cards.js` | Object literal evaluated | `cards` (200 keys) |
| 4 | `script.js` | Function declaration + ready binding | `selectRandomCard` |

### Phase 3: DOM Construction & Initial Render (5–10 ms)

1. Browser parses `<body>` content
2. Creates 8 `.word` divs, button, 2 links
3. Applies CSS from `style.css` and Font Awesome
4. Fires `DOMContentLoaded`

### Phase 4: First Card Draw (< 5 ms)

`selectRandomCard()` executes synchronously:

1. `Object.keys(cards)` → array of 200 strings `["1", "2", ..., "200"]`
2. `Math.random() * 200` → random float, `Math.floor()` → integer 0–199
3. `keys[index]` → random card key (e.g., `"42"`)
4. `cards["42"]` → card object with 8 words
5. Loop 8 times (word1–word8):
   - Extract word text
   - Split on whitespace
   - Determine query format
   - URL-encode
   - Build NuciSearch URL
   - Escape HTML
   - Inject anchor into `#wordN .word-text`
6. Function returns, browser paints

### Phase 5: Interactive Ready

- Button `onclick` handler attached (via HTML attribute)
- 8 word links clickable (open in new tab)
- GitHub/Donate links clickable
- Page fully interactive

## Timing Summary

| Phase | Typical Duration | Variance |
|-------|------------------|----------|
| DNS/TCP/TLS (CDN) | 50–200 ms | High (geography, cache) |
| Resource download | 50–150 ms | Medium (bandwidth) |
| JS parse/execute | 5–15 ms | Low |
| DOM construction | 5–10 ms | Low |
| First card render | < 5 ms | Negligible |
| **Total to interactive** | **110–380 ms** | **High (CDN-dependent)** |

## Failure Points

| Phase | Failure | Symptom | Recovery |
|-------|---------|---------|----------|
| Network | CDN timeout | Blank page, spinner | Refresh, check connectivity |
| JS | jQuery fails to load | `ReferenceError: $ is not defined` | Refresh, CDN recovery |
| JS | `cards.js` fails | `ReferenceError: cards is not defined` | Refresh, server recovery |
| JS | `script.js` fails | Button does nothing | Refresh, server recovery |
| Runtime | `cards` empty | No card drawn, blank word slots | Data integrity issue |

## Idempotency

- **Page reload**: Full restart, new random card
- **Button click**: Re-runs `selectRandomCard()`, replaces DOM content
- **No side effects** beyond DOM mutation
- **Safe to repeat** indefinitely

## Performance Optimisation Opportunities

1. **Remove unused jQuery Easing** — saves 5 KB + 1 request
2. **Add `defer` to scripts** — allows parallel HTML parsing (but `cards.js` must load before `script.js`)
3. **Inline critical CSS** — eliminate `style.css` request
4. **Local CDN copies** — eliminate 3 CDN requests, add SRI
5. **Minify `cards.js`** — remove whitespace, ~20% size reduction
6. **Service worker** — cache all resources for instant repeat loads