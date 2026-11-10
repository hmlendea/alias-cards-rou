# Data Model

## Overview

The Alias Cards application has a single, flat data model: a catalogue of 200 cards, each containing exactly 8 Romanian words or phrases.

## Core Entity: Card Catalogue

### Structure

```javascript
// cards.js
const cards = {
  "1": {
    word1: "kilometru",
    word2: "a urca",
    word3: "polul Nord",
    word4: "a se mira",
    word5: "a se bucura",
    word6: "a se teme",
    word7: "a se gândi",
    word8: "a se hotărî"
  },
  "2": { ... },
  // ...
  "200": { ... }
};
```

### Type Definition (TypeScript-style)

```typescript
interface WordSlot {
  word1: string;
  word2: string;
  word3: string;
  word3: string;
  word4: string;
  word5: string;
  word6: string;
  word7: string;
  word8: string;
}

interface CardCatalogue {
  [cardId: string]: WordSlot;  // Keys: "1" | "2" | ... | "200"
}

declare const cards: CardCatalogue;
```

### Constraints

| Constraint | Value | Enforcement |
|------------|-------|-------------|
| Card count | Exactly 200 | Manual (authored) |
| Words per card | Exactly 8 | Manual (authored) |
| Word keys | `word1`–`word8` | Code expects exact keys |
| Word values | Non-empty strings | Not validated at runtime |
| Card IDs | Sequential strings "1"–"200" | `Object.keys(cards)` used |
| Total words | 1,600 | Derived (200 × 8) |

## Word Schema

### Format

Each word value is a Romanian word or phrase:

| Type | Pattern | Examples |
|------|---------|----------|
| Single noun | `[a-zăâîșț]+` | `kilometru`, `casă`, `copac` |
| Infinitive verb | `a [a-zăâîșț]+` | `a urca`, `a merge`, `a citi` |
| Reflexive verb | `a se [a-zăâîșț]+` | `a se mira`, `a se bucura` |
| Multi-word phrase | `[^ ]+ [^ ]+` | `polul Nord`, `Marele Nord` |
| Proper noun phrase | `[A-Z][a-z]+ [A-Z][a-z]+` | `Muntele Everest` |

### Query Classification Logic

```javascript
const parts = wordText.trim().split(/\s+/);
const useShortQuery = parts.length === 1 ||
  (parts.length === 2 && parts[0].toLowerCase() === 'a');
```

| Word Structure | `parts.length` | `parts[0]` | Query Format |
|----------------|----------------|------------|--------------|
| `kilometru` | 1 | — | `kilometru DEX` |
| `a urca` | 2 | `a` | `a urca DEX` |
| `a se mira` | 3 | `a` | `Definiție: a se mira` |
| `polul Nord` | 2 | `polul` | `Definiție: polul Nord` |
| `Marele Nord` | 2 | `Marele` | `Definiție: Marele Nord` |

**Note**: Reflexive verbs (`a se ...`) have 3 parts → use long query format.

## Card Distribution Analysis

### Word Type Distribution (Sample of 200 cards)

| Category | Estimated Count | Percentage |
|----------|-----------------|------------|
| Single nouns | ~600 | ~37.5% |
| Infinitives (`a ...`) | ~400 | ~25% |
| Reflexive verbs (`a se ...`) | ~300 | ~18.75% |
| Multi-word phrases | ~300 | ~18.75% |
| **Total** | **1,600** | **100%** |

### Thematic Coverage (Observed)

| Theme | Example Words |
|-------|---------------|
| Geography | `kilometru`, `polul Nord`, `Ecuator`, `Marele Nord` |
| Verbs (motion) | `a urca`, `a coborî`, `a merge`, `a alerga` |
| Verbs (emotion) | `a se mira`, `a se bucura`, `a se teme`, `a se îngrijora` |
| Verbs (cognition) | `a se gândi`, `a se hotărî`, `a crede`, `a ști` |
| Daily life | `a mânca`, `a dormi`, `a citi`, `a scrie` |
| Nature | `copac`, `floră`, `râu`, `munte`, `mare` |
| Abstract | `fericire`, `tristețe`, `dragoste`, `libertate` |

**No explicit categorisation** — cards are flat, unordered, unthemed.

## Runtime Representation

### In Memory (After `cards.js` Loads)

```javascript
// Global variable
window.cards = {
  "1": {word1: "...", ..., word8: "..."},
  // ...
  "200": {word1: "...", ..., word8: "..."}
};

// Memory footprint (approximate)
Object.keys(cards).length        // 200
JSON.stringify(cards).length     // ~80,000 chars (~80 KB)
```

### During Draw (`selectRandomCard`)

```javascript
// Transient variables (per draw)
const keys = Object.keys(cards);           // string[200] — ~2 KB
const randomKey = keys[randomIndex];       // string — "42"
const selectedCard = cards[randomKey];     // WordSlot — 8 strings
// Loop creates per-iteration strings (query, url, escapedText, anchorHTML)
```

### In DOM (After Render)

```html
<!-- 8 instances of: -->
<div id="word3" class="word">
  <span class="word-number">3</span>
  <span class="word-text">
    <a href="https://search.nucilandia.ro?q=..." target="_blank" rel="noopener noreferrer">
      polul Nord
    </a>
  </span>
</div>
```

## Data Flow

```
cards.js (source)
    │
    ▼
Global `cards` object (runtime)
    │
    ├──► selectRandomCard() reads via Object.keys(cards)
    │         │
    │         ▼
    │    Random card selected
    │         │
    │         ▼
    │    8 words extracted
    │         │
    │         ▼
    │    Query formatted per word
    │         │
    │         ▼
    │    NuciSearch URLs built
    │         │
    │         ▼
    │    HTML-escaped anchors injected
    │         │
    ▼         ▼
DOM (8 .word-text elements)    NuciSearch (external)
```

## Validation

### Current Validation

- **None at runtime** — Code assumes valid data
- **No schema validation** — No JSON Schema, no TypeScript
- **No integrity checks** — No checksums, no versioning

### Recommended Validation (If Added)

```javascript
// Could add at top of script.js
function validateCards(catalogue) {
  const keys = Object.keys(catalogue);
  if (keys.length !== 200) throw new Error(`Expected 200 cards, got ${keys.length}`);

  for (const key of keys) {
    const card = catalogue[key];
    const wordKeys = Object.keys(card).sort();
    const expected = ['word1','word2','word3','word4','word5','word6','word7','word8'];
    if (JSON.stringify(wordKeys) !== JSON.stringify(expected)) {
      throw new Error(`Card ${key} has invalid keys: ${wordKeys}`);
    }
    for (const w of expected) {
      if (typeof card[w] !== 'string' || card[w].trim() === '') {
        throw new Error(`Card ${key}.${w} is empty or not a string`);
      }
    }
  }
}

validateCards(cards);  // Fail fast on data corruption
```

## Extensibility Points

### Adding Cards

1. Edit `cards.js`
2. Add new entry: `"201": {word1: "...", ..., word8: "..."}`
3. Ensure sequential ID
4. Deploy

### Adding Word Slots

**Breaking change** — Requires:
1. Add `word9`, `word10`... to all 200 cards in `cards.js`
2. Add `#word9`, `#word10`... divs in `index.html`
3. Update loop in `script.js` (currently hardcoded 1–8)
4. Update CSS for 9+ words
5. Deploy

### Adding Metadata

**Breaking change** — Requires:
1. Change card values from strings to objects:
   ```javascript
   word1: { text: "kilometru", category: "geography", difficulty: 1 }
   ```
2. Update `selectRandomCard()` to extract `.text`
3. Update query logic if needed
4. Update DOM injection
5. Deploy

## Data Integrity

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Typo in `cards.js` | Medium | Single word wrong | Manual review, PR process |
| Missing word key | Low | Draw error (undefined) | Validation function |
| Duplicate cards | Low | Skewed distribution | Manual review |
| Corrupted file | Very low | App broken | Git history, CI check |
| Encoding issues | Low | Mojibake in words | UTF-8 enforcement |

### Current Safeguards

- Git version control (history, diff, blame)
- PR review required (branch protection)
- Manual testing before deploy
- No automated tests (would catch regressions)

## Serialisation

### Current Format

- **Source**: JavaScript object literal in `cards.js`
- **Encoding**: UTF-8
- **Delivery**: Static file served by GitHub Pages
- **Parsing**: Browser JS engine (eval of script)

### Alternative Formats (Not Used)

| Format | Pros | Cons |
|--------|------|------|
| JSON | Standard, validated, language-agnostic | Requires fetch + parse, CORS |
| CSV | Spreadsheet-editable | Requires parse, no nesting |
| SQLite/WASM | Queryable, indexed | Overkill for 1,600 rows |
| IndexedDB | Client persistence | Complexity, not needed |

**Rationale for current**: Zero dependencies, zero parse time, zero fetch, maximum simplicity.

## Versioning

### Current

- **No versioning** — `cards.js` is the single source of truth
- **No migration** — Breaking changes = new deploy
- **No rollback data** — Git revert = rollback

### If Versioning Added

```javascript
// cards.js
const cards = {
  version: "2024.1",
  generated: "2024-01-15",
  count: 200,
  data: {
    "1": {...},
    ...
  }
};

// script.js
if (cards.version !== EXPECTED_VERSION) {
  console.warn(`Card catalogue version mismatch: ${cards.version} vs ${EXPECTED_VERSION}`);
}
```