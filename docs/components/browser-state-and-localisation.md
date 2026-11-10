# Browser State and Localisation Component

## Overview

This component describes the client-side state management, browser interactions, and localisation characteristics of the application.

## Browser State Management

### Application State Model

The application is **stateless** by design:

| State Category | Present? | Details |
|----------------|----------|---------|
| Session state | No | No session, no cookies, no localStorage, no sessionStorage |
| User preferences | No | No settings, no theme toggle, no language selector |
| Card history | No | No tracking of previously drawn cards |
| Draw counter | No | No persistent or session counter |
| UI state | Minimal | Only current card displayed in DOM |

### DOM State (Transient)

The only mutable state exists in the DOM during a session:

```javascript
// After selectRandomCard() executes:
#word1 .word-text → <a href="...">word1</a>
#word2 .word-text → <a href="...">word2</a>
...
#word8 .word-text → <a href="...">word8</a>
```

- **Lifecycle**: Created on page load, replaced on each button click
- **Persistence**: Lost on page reload/navigation
- **Scope**: Confined to 8 `.word-text` elements

### Global JavaScript State

| Variable | Mutability | Lifetime |
|----------|------------|----------|
| `cards` | Immutable (const-like) | Page lifetime |
| `selectRandomCard` | Immutable (function) | Page lifetime |
| `$`, `jQuery` | Immutable (library) | Page lifetime |
| `jQuery.easing` | Immutable (plugin) | Page lifetime |

**No mutable global variables** in application code.

## Browser Interactions

### User-Initiated Actions

| Action | Trigger | Handler | Effect |
|--------|---------|---------|--------|
| Page load | Browser navigation | `$(document).ready(selectRandomCard)` | Initial card draw |
| Draw new card | Click ⟳ button | `onclick="selectRandomCard()"` | Replace all 8 word links |
| Look up word | Click word link | Browser default (anchor) | Open NuciSearch in new tab |
| View source | Click "Cod sursă" | Browser default (anchor) | Open GitHub repo in new tab |
| Donate | Click "Donează" | Browser default (anchor) | Open sponsor page in new tab |

### Event Flow

```
Page Load
    │
    ▼
DOMContentLoaded
    │
    ▼
$(document).ready(selectRandomCard)
    │
    ▼
selectRandomCard() executes
    │
    ├── Object.keys(cards) → array of 200 keys
    ├── Math.random() → random index
    ├── cards[randomKey] → selected card object
    ├── For each word1..word8:
    │   ├── Determine query format
    │   ├── encodeURIComponent()
    │   ├── Build NuciSearch URL
    │   ├── Escape word text (XSS prevention)
    │   ├── Create anchor HTML
    │   └── $('#wordN .word-text').html(anchor)
    │
    ▼
DOM updated → Browser renders

User clicks ⟳
    │
    ▼
onclick="selectRandomCard()"
    │
    ▼
selectRandomCard() executes (same flow)
    │
    ▼
DOM updated → Browser renders

User clicks word link
    │
    ▼
Browser navigates to href in new tab (target="_blank")
    │
    ▼
NuciSearch page loads with query
```

### Keyboard Navigation

- **Tab order**: GitHub link → Donate link → ⟳ button → Word links (1–8)
- **Enter/Space on ⟳**: Triggers `onclick` → new card
- **Enter on word link**: Opens NuciSearch in new tab
- **No custom key handlers** — relies on browser defaults

### Touch/Mobile Interactions

- **Tap ⟳**: Triggers click → new card
- **Tap word link**: Opens in new tab
- **Tap external links**: Opens in new tab
- **No touch-specific handlers** — standard click events work

## Localisation

### Current Locale: Romanian (ro-RO)

| Aspect | Implementation |
|--------|----------------|
| Card content | All 1,600 words/phrases in Romanian |
| UI text | "Cod sursă" (GitHub), "Donează" (Donate) |
| Query prefixes | "DEX" (dictionary), "Definiție:" (definition) |
| Search service | NuciSearch (Romanian-focused) |
| Date/time | Not used |
| Numbers | Not formatted (word numbers 1–8 are static) |
| Currency | Not used |
| RTL support | Not applicable (LTR only) |

### Hardcoded Strings

**In `index.html`:**
- "Cod sursă" — GitHub link text
- "Donează" — Donate link text
- `aria-label="View on GitHub"`
- `aria-label="Donate"`

**In `script.js`:**
- `" DEX"` — Suffix for dictionary queries
- `"Definiție: "` — Prefix for definition queries
- `"https://search.nucilandia.ro?q="` — NuciSearch base URL

**In `style.css`:**
- None (purely visual)

### Localisation Architecture

**No i18n framework** — all strings embedded in source files.

To add a new language:

1. **Create new card catalogue**: `cards-[lang].js` with translated words
2. **Create localised HTML**: `index-[lang].html` with translated UI text
3. **Update query logic**: Modify `script.js` or create `script-[lang].js` with localised prefixes
4. **Deploy separately**: Each language as separate GitHub Pages site or subdirectory

### NuciSearch Integration Localisation

The query formatting assumes Romanian linguistic patterns:

```javascript
const useShortQuery = parts.length === 1 || (parts.length === 2 && parts[0].toLowerCase() === 'a');
```

- **`parts.length === 1`**: Single word → dictionary lookup
- **`parts[0] === 'a'`**: Infinitive verb ("a cânta", "a merge") → dictionary lookup
- **Otherwise**: Multi-word phrase → definition search

**Language-specific assumptions:**
- Romanian infinitives start with "a " (equivalent to English "to ")
- "DEX" is the standard Romanian dictionary abbreviation
- "Definiție:" means "Definition:" in Romanian

For other languages, this logic would need adaptation.

## Browser APIs Used

| API | Purpose | Location |
|-----|---------|----------|
| `document.ready` / `DOMContentLoaded` | Initialisation | `script.js` |
| `Object.keys()` | Enumerate card keys | `script.js` |
| `Math.random()`, `Math.floor()` | Random selection | `script.js` |
| `String.prototype.trim()`, `split()` | Parse word text | `script.js` |
| `encodeURIComponent()` | URL-encode query | `script.js` |
| `jQuery.fn.html()`, `jQuery.fn.text()` | DOM manipulation, escaping | `script.js` |
| `Anchor.target="_blank"` | New tab navigation | `script.js` (generated), `index.html` |
| `rel="noopener noreferrer"` | Security on external links | `script.js` (generated), `index.html` |

## State Persistence (Absence Of)

The application deliberately **does not persist** any state:

- **No localStorage** — Cards not saved, preferences not stored
- **No sessionStorage** — No session-scoped data
- **No cookies** — No tracking, no authentication
- **No IndexedDB** — No client-side database
- **No service worker** — No offline support, no background sync
- **No URL state** — Card not encoded in hash/query params

**Rationale**: Simplicity, privacy, statelessness. Each page load = fresh random card.

## Extension Points for State/Localisation

1. **Add card history**: Store recent card keys in `sessionStorage`, avoid repeats
2. **Add draw counter**: Increment counter in `localStorage`, display in UI
3. **Add language selector**: Multiple `cards-[lang].js`, switch via UI
4. **Add shareable URLs**: Encode card key in `location.hash`, read on load
5. **Add preferences**: Theme, font size, animation toggle in `localStorage`
6. **Add offline support**: Service worker caching all static assets
7. **Add analytics**: Privacy-respecting page view counting (opt-in)