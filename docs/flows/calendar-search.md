# Card Draw and Word Lookup Flow

## Overview

This flow describes the user-initiated card draw cycle and subsequent word lookup navigation.

## Flow Diagram

```mermaid
flowchart TD
    A[User clicks ⟳ button] --> B[onclick=selectRandomCard()]
    B --> C[selectRandomCard executes]
    C --> D[keys = Object.keys(cards)]
    D --> E[randomKey = keys[Math.floor(Math.random() * keys.length)]]
    E --> F[selectedCard = cards[randomKey]]
    F --> G[For each word in selectedCard]
    G --> H[wordText = selectedCard[word]]
    H --> I[parts = wordText.trim().split(/\s+/)]
    I --> J{parts.length === 1 OR<br/>(parts.length === 2 AND parts[0] === 'a')?}
    J -->|Yes| K[query = wordText + ' DEX']
    J -->|No| L[query = 'Definiție: ' + wordText]
    K --> M[encodedQuery = encodeURIComponent(query)]
    L --> M
    M --> N[url = 'https://search.nucilandia.ro?q=' + encodedQuery]
    N --> O[escapedText = $('<span>').text(wordText).html()]
    O --> P[anchorHTML = '<a href=\"' + url + '\" target=\"_blank\" rel=\"noopener noreferrer\">' + escapedText + '</a>']
    P --> Q[$('#' + word + ' .word-text').html(anchorHTML)]
    Q --> R[All 8 words updated]
    R --> S[Browser re-renders card]
    S --> T[User sees new card with 8 links]

    T --> U{User clicks word link?}
    U -->|Yes| V[Browser opens href in new tab]
    V --> W[NuciSearch loads with query]
    W --> X[User views definition]
    X --> Y[User returns to app tab]
    Y --> T
    U -->|No| Z{User clicks ⟳ again?}
    Z -->|Yes| A
    Z -->|No| T
```

## Card Draw Cycle (Steps A–T)

### Trigger

- **Primary**: Click ⟳ button (`#next-button`)
- **Secondary**: Page load (initial draw via `$(document).ready`)

### Execution (Synchronous, < 5 ms)

1. **Enumerate cards**: `Object.keys(cards)` → 200 keys
2. **Random selection**: Uniform distribution across 200 cards
3. **Retrieve card**: Direct object property access
4. **Process 8 words**: Sequential loop, independent iterations

### Query Format Decision Tree

```
wordText = "kilometru"
    │
    ▼
parts = ["kilometru"] (length 1)
    │
    ▼
useShortQuery = TRUE
    │
    ▼
query = "kilometru DEX"
    │
    ▼
url = "https://search.nucilandia.ro?q=kilometru%20DEX"
```

```
wordText = "a urca"
    │
    ▼
parts = ["a", "urca"] (length 2, parts[0] === "a")
    │
    ▼
useShortQuery = TRUE
    │
    ▼
query = "a urca DEX"
    │
    ▼
url = "https://search.nucilandia.ro?q=a%20urca%20DEX"
```

```
wordText = "polul Nord"
    │
    ▼
parts = ["polul", "Nord"] (length 2, parts[0] !== "a")
    │
    ▼
useShortQuery = FALSE
    │
    ▼
query = "Definiție: polul Nord"
    │
    ▼
url = "https://search.nucilandia.ro?q=Defini%C8%9Bie%3A%20polul%20Nord"
```

### DOM Update

- **8 independent jQuery operations**: `$('#word1 .word-text').html(...)`, ..., `$('#word8 .word-text').html(...)`
- **Each replaces** entire `.word-text` content
- **Previous anchors** garbage collected
- **Browser reflows** once after all 8 updates (batched by event loop)

## Word Lookup Navigation (Steps U–Y)

### Trigger

- User clicks any of the 8 word links (`.word-text a`)

### Navigation

1. **Browser intercepts** click on `<a href="..." target="_blank" rel="noopener noreferrer">`
2. **Opens new tab** with `href` URL
3. **No referrer sent** (`rel="noreferrer"`)
4. **No opener access** (`rel="noopener"`)
4. **NuciSearch receives** GET request with `q` parameter

### NuciSearch Processing (External)

| Query Type | NuciSearch Behaviour |
|------------|---------------------|
| `[word] DEX` | Dictionary lookup — shows definition, etymology, synonyms |
| `Definiție: [phrase]` | Definition search — shows pages defining the phrase |

### Return to Application

- User closes/closes NuciSearch tab
- Application tab unchanged (card still displayed)
- Can click another word or ⟳ for new card

## Concurrency & Race Conditions

**None** — All operations synchronous, single-threaded:

- Button click → `selectRandomCard()` → DOM updates → return
- No async operations, no promises, no timers
- Rapid clicks: each click queues new `selectRandomCard()` call, executes sequentially
- No shared mutable state between draws

## Error Scenarios

| Scenario | During Draw | During Lookup |
|----------|-------------|---------------|
| `cards` undefined | `ReferenceError`, draw fails | N/A |
| `cards` empty | Loop skipped, blank card | N/A |
| jQuery missing | `ReferenceError` on `$` | N/A |
| Network offline | Draw works (local), lookup fails | Browser "No internet" |
| NuciSearch down | N/A | Browser shows error page |
| Special chars in word | `encodeURIComponent` handles | NuciSearch handles |

## Performance

| Metric | Value |
|--------|-------|
| Draw latency | < 5 ms (JS) + 1 paint |
| Memory per draw | ~8 anchor strings (GC) |
| DOM operations | 8 `.html()` calls |
| Layout thrashing | Minimal (batched) |
| Repeat draws | Unlimited, no degradation |

## Invariants

1. **Exactly 8 words updated** per draw
2. **Each word gets unique link** (different query)
3. **Links open in new tabs** (never replace app tab)
4. **No referrer/opener leakage** to NuciSearch
5. **Card data never mutated** (read-only)
6. **Uniform random distribution** across 200 cards