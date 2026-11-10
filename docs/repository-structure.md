# Repository Structure

## Source Tree Layout

```
alias-cards-rou/
├── index.html          # Main HTML entry point
├── style.css           # Visual styling
├── script.js           # Application logic (controller)
├── cards.js            # Card catalogue data (model)
├── README.md           # Project overview and documentation index
├── ARCHITECTURE.md     # Root architecture documentation
├── SECURITY.md         # Security policy
├── PRIVACY.md          # Privacy statement
├── CONTRIBUTING.md     # Contribution guidelines
├── CODE_OF_CONDUCT.md  # Community standards
├── LICENSE             # GPL v3 license text
├── docs/               # Generated documentation (this directory)
│   ├── api-reference/
│   ├── behaviour/
│   ├── components/
│   ├── flows/
│   ├── INDEX.md
│   └── ... (other docs)
└── .github/
    └── workflows/      # CI/CD workflows (if present)
```

## Module Organisation

### Presentation Layer

| File | Responsibility | Exports |
|------|----------------|---------|
| `index.html` | DOM structure, card template, word slots, control button, external links | HTML structure with 8 word elements (`#word1`–`#word8`), button (`#next-button`) |
| `style.css` | Visual styling for card, words, buttons, links, responsive layout | CSS rules for `.card`, `.word`, `.word-number`, `.word-text`, `.control-button`, `.github-link`, `.donate-link` |

### Logic Layer

| File | Responsibility | Exports |
|------|----------------|---------|
| `script.js` | Card selection, query formatting, DOM population, event binding | `selectRandomCard()` function (global) |

### Data Layer

| File | Responsibility | Exports |
|------|----------------|---------|
| `cards.js` | Card catalogue — 200 cards × 8 words each | `cards` object (global) keyed by card number (1–200), each with `word1`–`word8` properties |

## Dependency Direction

```
index.html
    ├── style.css (stylesheet)
    ├── cards.js (data) ──► script.js (logic)
    ├── script.js (logic)
    ├── jQuery (CDN) ──► script.js
    ├── jQuery Easing (CDN) ──► script.js
    └── Font Awesome (CDN) ──► index.html (icons)
```

- **No circular dependencies** — Data flows one way: `cards.js` → `script.js` → DOM
- **External dependencies only inbound** — CDN libraries loaded by HTML, consumed by script
- **No outbound API calls from script** — NuciSearch integration is via anchor links, not fetch/XHR

## File Sizes (Approximate)

| File | Lines | Size | Purpose |
|------|-------|------|---------|
| `cards.js` | ~2,000 | ~80 KB | Card catalogue (200 cards × 8 words) |
| `script.js` | ~25 | ~1 KB | Selection and link logic |
| `style.css` | ~80 | ~3 KB | Visual styling |
| `index.html` | ~35 | ~2 KB | Page structure |

## Naming Conventions

- **Files**: kebab-case (`index.html`, `style.css`, `script.js`, `cards.js`)
- **CSS classes**: kebab-case (`.card`, `.word-number`, `.control-button`)
- **CSS IDs**: kebab-case (`#word1`, `#next-button`, `#word8`)
- **JavaScript variables/functions**: camelCase (`selectRandomCard`, `selectedCard`, `randomKey`)
- **Card data keys**: `word1` through `word8` (consistent across all 200 cards)
- **Card object keys**: Numeric strings (`"1"`, `"2"`, ..., `"200"`)

## Extension Points

1. **Add cards** — Append new entries to `cards.js` following the existing structure
2. **Modify styling** — Edit `style.css` for visual changes
3. **Change lookup provider** — Modify query formatting in `script.js`
4. **Add animations** — Extend `script.js` with jQuery Easing effects
5. **Localise** — Replace card data in `cards.js` and UI text in `index.html`