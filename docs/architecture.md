# Architecture Documentation

This document elaborates on the root [ARCHITECTURE.md](../ARCHITECTURE.md) with implementation-level detail for contributors and maintainers.

## Architectural Style: Client-Side MVC

The application implements a lightweight **Model-View-Controller** pattern entirely within the browser:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Runtime                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│   │    Model     │     │    View      │     │  Controller  │   │
│   │  (cards.js)  │────►│ (index.html) │◄───►│ (script.js)  │   │
│   └──────────────┘     └──────────────┘     └──────────────┘   │
│         │                    ▲                    │             │
│         │                    │                    │             │
│         ▼                    │                    ▼             │
│   ┌──────────────────────────────────────────────────────┐     │
│   │                    DOM State                          │     │
│   │  (Rendered card with 8 interactive word links)       │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Model — `cards.js`

- **Type**: Immutable JavaScript object literal
- **Structure**: `cards = { "1": { word1: "...", ..., word8: "..." }, ..., "200": {...} }`
- **Card count**: 200 cards (keys `"1"` through `"200"`)
- **Words per card**: Exactly 8 (`word1`–`word8`)
- **Total entries**: 1,600 words/phrases
- **Language**: Romanian
- **Mutability**: Never modified at runtime; read-only data source

### View — `index.html` + `style.css`

- **Template**: Static HTML defining card container and 8 word slots
- **Word elements**: `<div id="word1" class="word">` through `<div id="word8" class="word">`
- **Each word slot**: Contains `.word-number` (1–8) and `.word-text` (populated dynamically)
- **Control button**: `<button id="next-button" onclick="selectRandomCard()">⟳</button>`
- **External links**: GitHub source and donation links (fixed position)
- **Styling**: Card layout, typography, responsive positioning, hover effects

### Controller — `script.js`

- **Entry point**: `$(document).ready(selectRandomCard)` — auto-draw on load
- **Primary function**: `selectRandomCard()` — orchestrates card draw and DOM update
- **Algorithm**:
  1. Get all card keys: `Object.keys(cards)`
  2. Select random key: `keys[Math.floor(Math.random() * keys.length)]`
  3. Retrieve card: `cards[randomKey]`
  4. For each word (1–8):
     - Determine query format (single word / "a + infinitive" → DEX; else → definition)
     - URL-encode query
     - Build NuciSearch URL: `https://search.nucilandia.ro?q=[encoded]`
     - Create anchor with HTML-escaped word text
     - Inject into `#wordN .word-text`
- **Dependencies**: jQuery (DOM manipulation), `cards` global object

## Data Architecture

### Card Catalogue Schema

```javascript
{
  "1": {
    "word1": "kilometru",
    "word2": "tur",
    "word3": "piscină",
    "word4": "ghips",
    "word5": "Wi-Fi",
    "word6": "supapă",
    "word7": "polul Nord",
    "word8": "Elvis Presley"
  },
  // ... 199 more cards
}
```

### Query Formatting Rules

| Input Pattern | Query Format | Example |
|---------------|--------------|---------|
| Single word | `[word] DEX` | `kilometru DEX` |
| "a " + infinitive (2 words, first is "a") | `[phrase] DEX` | `a urca DEX` |
| Multi-word phrase (other) | `Definiție: [phrase]` | `Definiție: polul Nord` |

**Implementation** (`script.js` lines 7–11):
```javascript
const parts = wordText.trim().split(/\s+/);
const useShortQuery = parts.length === 1 || (parts.length === 2 && parts[0].toLowerCase() === 'a');
const query = useShortQuery ? wordText + ' DEX' : 'Definiție: ' + wordText;
```

### HTML Escaping

Word text is escaped via jQuery: `$('<span>').text(wordText).html()` — prevents XSS from card data.

## Interfaces and Integrations

### Inbound Dependencies

| Dependency | Version | Source | Purpose | Failure Impact |
|------------|---------|--------|---------|----------------|
| jQuery | 3.6.3 | cdnjs.cloudflare.com | DOM manipulation, event handling, HTML escaping | Application non-functional |
| jQuery Easing | 1.12.1 | cdnjs.cloudflare.com | Animation easing (unused in current code) | No visible impact |
| Font Awesome | 6.5.1 | cdnjs.cloudflare.com | GitHub/heart icons | Icons missing, functional |

### Outbound Integration

| Service | Endpoint | Protocol | Trigger | Data Sent |
|---------|----------|----------|---------|-----------|
| NuciSearch | `https://search.nucilandia.ro` | HTTPS GET (new tab) | User clicks word link | Search query only (word/phrase) |

**No API keys, authentication, or cookies involved.**

## Cross-Cutting Concerns

### Security

- **Content Security Policy**: None declared (relies on browser defaults)
- **XSS Prevention**: jQuery `.text()` escaping on card data before HTML injection
- **HTTPS Enforcement**: All external resources use HTTPS
- **No User Input**: Card data is static; no user-provided content processed
- **Referrer Policy**: `rel="noopener noreferrer"` on all external links

### Performance

- **Initial Load**: ~86 KB total (cards.js ~80 KB, others ~6 KB)
- **CDN Dependencies**: 3 external requests (jQuery, jQuery Easing, Font Awesome)
- **Runtime**: Single random selection + 8 DOM updates per card draw
- **Memory**: `cards` object retained in memory (~80 KB)
- **No Caching Headers**: GitHub Pages serves with default caching

### Accessibility

- **Semantic HTML**: Button, links, heading structure
- **ARIA Labels**: `aria-label` on GitHub and donation links
- **Colour Contrast**: White text on dark blue background; black text on white card
- **Focus Indicators**: Browser default on interactive elements
- **Keyboard Navigation**: Button and links reachable via Tab

### Internationalisation

- **Hardcoded Romanian**: All card content, UI text ("Cod sursă", "Donează")
- **No i18n Framework**: Single-language application
- **Extension**: Replace `cards.js` content and `index.html` text for new languages

## Component Boundaries

| Boundary | Owner | Crosses Via |
|----------|-------|-------------|
| Data → Logic | `cards.js` → `script.js` | Global `cards` object |
| Logic → View | `script.js` → DOM | jQuery selectors (`#wordN .word-text`) |
| View → Style | `index.html` → `style.css` | CSS class/ID selectors |
| App → NuciSearch | `script.js` → External | Anchor `href` with encoded query |

## Extension Points

1. **Add Cards**: Append to `cards.js` with next numeric key
2. **Change Lookup Provider**: Modify URL template in `script.js`
3. **Add Animations**: Use jQuery Easing in `selectRandomCard()`
4. **Responsive Breakpoints**: Extend `style.css` media queries
5. **Card Metadata**: Add properties to card objects (category, difficulty) and extend logic