# Application Services Component

## Overview

The application services component encompasses the core business logic in `script.js` — the `selectRandomCard()` function and its helper operations. This is the controller layer in the MVC architecture.

## File: `script.js`

### Exported Symbols

| Symbol | Type | Scope | Description |
|--------|------|-------|-------------|
| `selectRandomCard` | Function | Global | Primary entry point; selects random card and populates DOM |

### Function: `selectRandomCard()`

```javascript
function selectRandomCard() {
    const keys = Object.keys(cards);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const selectedCard = cards[randomKey];

    for (let word in selectedCard) {
      const wordText = selectedCard[word];
      const parts = wordText.trim().split(/\s+/);
      const useShortQuery = parts.length === 1 || (parts.length === 2 && parts[0].toLowerCase() === 'a');
      const query = useShortQuery ? wordText + ' DEX' : 'Definiție: ' + wordText;
      const encodedQuery = encodeURIComponent(query);
      const url = 'https://search.nucilandia.ro?q=' + encodedQuery;
      $('#' + word + ' .word-text')
        .html('<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + $('<span>').text(wordText).html() + '</a>');
    }
}
```

### Execution Flow

```
selectRandomCard()
├── keys = Object.keys(cards)                    // ["1", "2", ..., "200"]
├── randomKey = keys[Math.floor(Math.random() * keys.length)]
├── selectedCard = cards[randomKey]              // { word1: "...", ..., word8: "..." }
├── for (word in selectedCard)                   // Iterates "word1" ... "word8"
│   ├── wordText = selectedCard[word]            // Raw word/phrase string
│   ├── parts = wordText.trim().split(/\s+/)     // Split on whitespace
│   ├── useShortQuery = parts.length === 1
│   │       || (parts.length === 2 && parts[0].toLowerCase() === 'a')
│   ├── query = useShortQuery
│   │       ? wordText + ' DEX'
│   │       : 'Definiție: ' + wordText
│   ├── encodedQuery = encodeURIComponent(query)
│   ├── url = 'https://search.nucilandia.ro?q=' + encodedQuery
│   ├── escapedText = $('<span>').text(wordText).html()
│   ├── anchorHTML = '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + escapedText + '</a>'
│   └── $('#' + word + ' .word-text').html(anchorHTML)
```

### Query Formatting Logic

The algorithm distinguishes three categories:

| Category | Condition | Query Format | Example |
|----------|-----------|--------------|---------|
| Single word | `parts.length === 1` | `[word] DEX` | `kilometru DEX` |
| Infinitive phrase | `parts.length === 2 && parts[0] === 'a'` | `[phrase] DEX` | `a urca DEX` |
| Multi-word phrase | Otherwise | `Definiție: [phrase]` | `Definiție: polul Nord` |

**Rationale**: Romanian dictionary (DEX) lookups work best for single words and infinitive verbs. Multi-word expressions need definition searches.

### HTML Escaping (XSS Prevention)

```javascript
$('<span>').text(wordText).html()
```

- Creates detached `<span>`
- Sets text content (auto-escapes HTML entities)
- Reads innerHTML (now safe)
- **Critical**: Card data in `cards.js` is trusted but this defence-in-depth protects against future data source changes

### DOM Manipulation

```javascript
$('#' + word + ' .word-text').html(anchorHTML)
```

- Selector: `#word1 .word-text`, `#word2 .word-text`, ..., `#word8 .word-text`
- Replaces entire `.word-text` content with new anchor
- Previous anchor (if any) removed automatically by `.html()`

### Initialisation

```javascript
$(document).ready(function() {
    selectRandomCard();
});
```

- Binds to jQuery's `ready` event (DOMContentLoaded)
- Executes once on page load
- Subsequent draws via button `onclick="selectRandomCard()"`

## Dependencies

### Internal

| Dependency | Source | Usage |
|------------|--------|-------|
| `cards` | `cards.js` (global) | Card catalogue object |
| `$` / `jQuery` | jQuery CDN | DOM selection, manipulation, HTML escaping |

### External Services

| Service | Endpoint | Integration Type |
|---------|----------|------------------|
| NuciSearch | `https://search.nucilandia.ro` | Anchor `href` (user-initiated navigation) |

## Error Handling

**None implemented**. Potential failure points:

| Failure Point | Current Behaviour | Risk |
|---------------|-------------------|------|
| `cards` undefined | `ReferenceError` → app broken | High (CDN load order) |
| `cards` empty object | `keys.length === 0` → `randomKey` = `undefined` → `selectedCard` = `undefined` → loop skipped | Medium |
| jQuery not loaded | `$` undefined → `ReferenceError` | High (CDN failure) |
| `encodeURIComponent` fails | Never fails on valid strings | None |
| DOM elements missing | `.html()` on empty set → silent no-op | Low (template mismatch) |

## Performance Characteristics

| Metric | Value |
|--------|-------|
| Time complexity | O(1) — fixed 8 iterations |
| Space complexity | O(1) — no allocation beyond loop variables |
| DOM operations | 8 `.html()` calls per draw |
| Memory allocation | ~8 anchor strings + 8 jQuery objects per draw (GC eligible) |

## Extension Points

1. **Weighted card selection**: Replace `Math.random()` with weighted algorithm
2. **Card history**: Track recent cards to avoid immediate repeats
3. **Categories/tags**: Add metadata to cards, filter selection
4. **Animation**: Add jQuery Easing transitions on word replacement
5. **Alternative lookup providers**: Parameterise URL template
6. **Keyboard shortcut**: Add key listener for space/enter to draw card
7. **Card counter**: Display draw count, card number
8. **Shareable URLs**: Encode card key in URL hash for sharing

## Testing Considerations

- **No automated tests exist**
- **Manual verification**: Open `index.html`, click ⟳, verify 8 links appear, click links open NuciSearch
- **Edge cases to verify**:
  - Single-word entries (e.g., "kilometru")
  - Infinitive phrases (e.g., "a urca")
  - Multi-word phrases (e.g., "polul Nord")
  - Special characters in words (escaped correctly?)
  - Rapid button clicks (no race conditions — synchronous)
  - Page reload (new random card each time)