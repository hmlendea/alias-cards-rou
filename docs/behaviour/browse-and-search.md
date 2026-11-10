# Browse and Search Behaviour

## Overview

This document describes the user-facing browse and search behaviours of the Alias Cards application.

## Primary Interaction: Card Draw

### Trigger

- **Page load**: Automatic initial card draw
- **Button click**: User clicks ⟳ button (`#next-button`)

### Behaviour

1. Application selects a random card from 200 available cards
2. Each card contains exactly 8 Romanian words/phrases
3. Words are displayed in numbered slots (1–8)
4. Each word becomes a clickable link to NuciSearch

### Visual Feedback

- **Immediate**: New words appear in slots (no loading indicator)
- **No animation**: Instant replacement
- **Button state**: No visual change on click (no disabled state, no spinner)
- **Card layout**: Stable — only word text changes

### Frequency

- Unlimited draws
- No rate limiting
- No cooldown
- Each draw independent (uniform random)

## Secondary Interaction: Word Lookup

### Trigger

- User clicks any word link (`.word-text a`)

### Behaviour

1. Link opens in **new browser tab** (`target="_blank"`)
2. URL format: `https://search.nucilandia.ro?q=[encoded-query]`
3. Query format depends on word structure:
   - Single word or infinitive (`a [verb]`): `[word] DEX`
   - Multi-word phrase: `Definiție: [phrase]`
4. No referrer sent (`rel="noreferrer"`)
5. No opener access (`rel="noopener"`)

### NuciSearch Interaction (External)

| Query Type | Example | NuciSearch Result |
|------------|---------|-------------------|
| Single word DEX | `kilometru DEX` | Dictionary entry: definition, etymology, synonyms |
| Infinitive DEX | `a urca DEX` | Verb dictionary entry |
| Phrase definition | `Definiție: polul Nord` | Search results for phrase definition |

### Return Behaviour

- Application tab **unchanged** — card remains visible
- User can click another word link (opens another tab)
- User can click ⟳ for new card
- No state sync between tabs

## Navigation Behaviour

### Internal Navigation

- **None** — Single page application, no routing
- No browser history manipulation
- No deep linking to specific cards
- Refresh = new random card

### External Navigation

| Link | Target | Behaviour |
|------|--------|-----------|
| Word links (8) | NuciSearch | New tab, no referrer |
| GitHub link | GitHub repo | New tab, no referrer |
| Donate link | Ko-fi | New tab, no referrer |

## Search Behaviour

### Application-Level Search

- **None** — No search input, no filtering, no card lookup by word
- Cards only accessible via random draw

### External Search Integration

- **NuciSearch** — Sole search integration
- Queries constructed client-side
- No autocomplete, no suggestions
- No search history

## Browse Patterns

### Casual Browse

1. Load page → see random card
2. Click ⟳ → see new card
3. Repeat

### Targeted Learning

1. Load page → see random card
2. Click unknown word → read definition on NuciSearch
3. Return → click ⟳ for new card
4. Repeat

### Session Patterns

| Pattern | Typical Draws | Duration |
|---------|---------------|----------|
| Quick glance | 1–3 | < 30 s |
| Study session | 10–50 | 5–15 min |
| Extended | 50+ | 15+ min |

## Accessibility Behaviour

### Keyboard Navigation

| Element | Tab Order | Activation |
|---------|-----------|------------|
| ⟳ button | 1 | Enter/Space |
| Word 1 link | 2 | Enter |
| Word 2 link | 3 | Enter |
| ... | ... | ... |
| Word 8 link | 9 | Enter |
| GitHub link | 10 | Enter |
| Donate link | 11 | Enter |

### Screen Reader

- Button: `aria-label="Next card"` (via title attribute)
- Word links: Link text = word itself (readable)
- GitHub link: `aria-label="GitHub repository"`
- Donate link: `aria-label="Donate on Ko-fi"`

### Focus Management

- No focus trapping
- No focus restoration after new tab opens
- Button retains focus after click (standard behaviour)

## Error Behaviour

### Network Errors

| Scenario | User Experience |
|----------|-----------------|
| Initial load fails | Blank page, browser error |
| CDN resources fail | Unstyled/broken layout, button may not work |
| NuciSearch unreachable | Word links open error page in new tab |

### JavaScript Errors

| Scenario | User Experience |
|----------|-----------------|
| `cards` undefined | Button does nothing, console error |
| jQuery missing | Button does nothing, console error |
| `selectRandomCard` throws | Button does nothing, console error |

### Recovery

- **All errors**: Page refresh (F5)
- No in-app error UI
- No retry mechanisms
- No offline support

## State Behaviour

### Persistent State

- **None** — No localStorage, sessionStorage, cookies, IndexedDB
- No user preferences stored
- No draw history
- No favourites/bookmarks

### Session State

- **None** — Each draw independent
- Current card only in DOM
- No "previous card" memory
- No "drawn cards" tracking

### Ephemeral State

- Current card DOM representation (8 words + links)
- Lost on refresh, navigation, close

## Responsive Behaviour

### Viewport Adaptation

| Breakpoint | Layout Change |
|------------|---------------|
| > 768px | Card centered, 85% height, 1/1.4 aspect |
| ≤ 768px | Card fills width, height auto, font scales |

### Orientation

- Portrait: Card vertical, words stacked
- Landscape: Card horizontal-ish, words stacked
- No layout reflow on rotate (CSS handles)

## Performance Behaviour

### Perceived Performance

- **Instant** card draws (< 100 ms visual update)
- **Instant** link clicks (browser handles)
- No loading states ever shown

### Resource Behaviour

- All resources cached by browser after first load
- Repeat visits: near-instant (cache hit)
- No service worker (no offline)

## Limitations

1. **No card selection** — Cannot choose specific card
2. **No word search** — Cannot find cards containing a word
3. **No history** — Cannot go back to previous card
4. **No favourites** — Cannot save cards/words
5. **No progress tracking** — No statistics, no streaks
6. **No categories** — Cards not grouped by theme
7. **No difficulty levels** — All cards equal probability
8. **Single language** — Romanian only, no translations