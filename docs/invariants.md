# Invariants

## Overview

This document lists the invariants — properties that must always hold true — for the Alias Cards application. These are guarantees that the code, data, and deployment must maintain.

## Data Invariants

### Card Catalogue (`cards.js`)

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-DATA-01** | Exactly 200 cards | Manual (authored) |
| **INV-DATA-02** | Card keys are strings "1" through "200" | Manual |
| **INV-DATA-03** | Each card has exactly 8 properties: `word1`–`word8` | Manual |
| **INV-DATA-04** | All word values are non-empty strings | Not enforced (should add) |
| **INV-DATA-05** | No duplicate cards (by all 8 words) | Manual review |
| **INV-DATA-06** | Total word count = 1,600 (200 × 8) | Derived |
| **INV-DATA-07** | All words are Romanian vocabulary | Manual (authored) |
| **INV-DATA-08** | UTF-8 encoding, no mojibake | Editor/Git config |

### Word Format

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-WORD-01** | Single word: no spaces | Data authoring |
| **INV-WORD-02** | Infinitive: starts with "a " + verb | Data authoring |
| **INV-WORD-03** | Reflexive: starts with "a se " + verb | Data authoring |
| **INV-WORD-04** | Phrase: 2+ words, not starting with "a " | Data authoring |
| **INV-WORD-05** | No HTML/JS in word text | Data authoring (escaped at runtime) |
| **INV-WORD-06** | No leading/trailing whitespace | `.trim()` at runtime |

## Code Invariants

### `selectRandomCard()` Function

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-CODE-01** | Always selects exactly one card | `keys[randomIndex]` |
| **INV-CODE-02** | Selection is uniform across all cards | `Math.random() * keys.length` |
| **INV-CODE-03** | Processes exactly 8 words per draw | Loop `i = 1; i <= 8; i++` |
| **INV-CODE-04** | Updates exactly 8 DOM elements | `$('#word1 .word-text')` through `$('#word8 .word-text')` |
| **INV-CODE-05** | Each word gets unique NuciSearch URL | Different `wordText` → different query |
| **INV-CODE-06** | All links have `target="_blank"` | Hardcoded in template |
| **INV-CODE-07** | All links have `rel="noopener noreferrer"` | Hardcoded in template |
| **INV-CODE-08** | Word text is HTML-escaped before injection | `$('<span>').text().html()` |
| **INV-CODE-09** | No side effects beyond DOM mutation | No network, no storage, no globals modified |
| **INV-CODE-10** | Function is idempotent (safe to call repeatedly) | No state changes |
| **INV-CODE-11** | Function completes synchronously | No async operations |
| **INV-CODE-12** | No exceptions thrown for valid data | Try/catch not needed (currently) |

### Query Format Logic

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-QUERY-01** | Single word → `"{word} DEX"` | `parts.length === 1` |
| **INV-QUERY-02** | Two words starting with "a" → `"{word} DEX"` | `parts.length === 2 && parts[0] === 'a'` |
| **INV-QUERY-03** | All other → `"Definiție: {word}"` | Else branch |
| **INV-QUERY-04** | Query is URL-encoded | `encodeURIComponent()` |
| **INV-QUERY-05** | URL uses HTTPS | Hardcoded `https://` |
| **INV-QUERY-06** | URL points to `search.nucilandia.ro` | Hardcoded domain |

## DOM Invariants

### Structure

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-DOM-01** | Exactly 8 `.word` divs with IDs `word1`–`word8` | `index.html` |
| **INV-DOM-02** | Each `.word` has `.word-number` (1–8) | `index.html` |
| **INV-DOM-03** | Each `.word` has `.word-text` span | `index.html` |
| **INV-DOM-04** | `.card` container exists | `index.html` |
| **INV-DOM-05** | `#next-button` exists with `onclick="selectRandomCard()"` | `index.html` |
| **INV-DOM-06** | GitHub link exists with `aria-label` | `index.html` |
| **INV-DOM-07** | Donate link exists with `aria-label` | `index.html` |

### After Render

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-RENDER-01** | Each `.word-text` contains exactly one `<a>` element | `selectRandomCard()` |
| **INV-RENDER-02** | Anchor `href` is valid NuciSearch URL | Code logic |
| **INV-RENDER-03** | Anchor text equals original word text (escaped) | Code logic |
| **INV-RENDER-04** | Anchor has `target="_blank"` | Code logic |
| **INV-RENDER-05** | Anchor has `rel="noopener noreferrer"` | Code logic |
| **INV-RENDER-06** | `.word-number` unchanged (static 1–8) | Never modified |
| **INV-RENDER-07** | No duplicate word texts in same card | Data invariant |

## CSS Invariants

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-CSS-01** | `.card` uses `aspect-ratio: 1 / 1.4` | `style.css` |
| **INV-CSS-02** | `.card` height is `85%` (desktop) | `style.css` |
| **INV-CSS-03** | `.word` uses flex layout, vertical center | `style.css` |
| **INV-CSS-04** | `.word-number` is purple circle (`#8e44ad`) | `style.css` |
| **INV-CSS-05** | `.control-button` fixed bottom-right | `style.css` |
| **INV-CSS-06** | Links have hover color `#8e44ad` | `style.css` |
| **INV-CSS-07** | Mobile breakpoint at 768px | `style.css` |

## Network Invariants

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-NET-01** | All external resources use HTTPS | `index.html` URLs |
| **INV-NET-02** | jQuery loaded from cdnjs.cloudflare.com | `index.html` |
| **INV-NET-03** | Font Awesome loaded from cdnjs.cloudflare.com | `index.html` |
| **INV-NET-04** | NuciSearch queries use HTTPS | `script.js` |
| **INV-NET-05** | No cookies sent with any request | No auth, no cookies |
| **INV-NET-06** | No `fetch`/`XHR` from application code | Code audit |

## Deployment Invariants

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-DEPLOY-01** | Served from GitHub Pages | Repository settings |
| **INV-DEPLOY-02** | HTTPS enforced | GitHub Pages default |
| **INV-DEPLOY-03** | `main` branch is source | GitHub Pages config |
| **INV-DEPLOY-04** | Root directory is publish directory | GitHub Pages config |
| **INV-DEPLOY-05** | No build step required | No build config |
| **INV-DEPLOY-06** | All source files in repository root | File structure |

## Behavioural Invariants

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-BEH-01** | Page load → card drawn automatically | `$(document).ready` |
| **INV-BEH-02** | Button click → new card drawn | `onclick` handler |
| **INV-BEH-03** | Word click → new tab to NuciSearch | Anchor attributes |
| **INV-BEH-04** | App tab never navigates away | `target="_blank"` |
| **INV-BEH-05** | No user data collected | Code audit |
| **INV-BEH-06** | No persistent state | Code audit |
| **INV-BEH-07** | Refresh → new random card | No session restore |
| **INV-BEH-08** | Works offline after first load (cached) | Browser cache |

## Security Invariants

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-SEC-01** | No `eval`/`Function` constructor | Code audit |
| **INV-SEC-02** | No `innerHTML` with unescaped user data | jQuery `.text().html()` |
| **INV-SEC-03** | No secrets in source code | Code audit |
| **INV-SEC-04** | External links use `noopener noreferrer` | Code logic |
| **INV-SEC-05** | No inline scripts (except `onclick`) | `index.html` |
| **INV-SEC-06** | CDN versions pinned in URL | `index.html` |

## Accessibility Invariants

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-A11Y-01** | All interactive elements keyboard reachable | Semantic HTML |
| **INV-A11Y-02** | Button has accessible name (`title`) | `index.html` |
| **INV-A11Y-03** | Links have meaningful text (the word itself) | Code logic |
| **INV-A11Y-04** | External links have `aria-label` | `index.html` |
| **INV-A11Y-05** | Color contrast meets WCAG AA | Design review |
| **INV-A11Y-06** | Focus visible on all interactive elements | Browser default + CSS |

## Performance Invariants

| Invariant | Description | Enforcement |
|-----------|-------------|-------------|
| **INV-PERF-01** | `selectRandomCard()` executes in < 10 ms | Code simplicity |
| **INV-PERF-02** | No memory leak across draws | No retained references |
| **INV-PERF-03** | Initial load < 2 s on 3G | Resource sizes |
| **INV-PERF-04** | No layout thrashing during draw | Batched DOM updates |

## Invariant Verification

### Automated Checks (Not Implemented)

```javascript
// Could add to script.js or separate validation script
function verifyInvariants() {
  // INV-DATA-01, 02, 03
  const keys = Object.keys(cards);
  console.assert(keys.length === 200, 'INV-DATA-01: 200 cards');
  console.assert(keys.every((k, i) => k === String(i + 1)), 'INV-DATA-02: sequential keys');

  for (const key of keys) {
    const card = cards[key];
    const wordKeys = Object.keys(card).sort();
    console.assert(
      JSON.stringify(wordKeys) === JSON.stringify(['word1','word2','word3','word4','word5','word6','word7','word8']),
      `INV-DATA-03: card ${key} has 8 words`
    );
    for (const wk of wordKeys) {
      console.assert(typeof card[wk] === 'string' && card[wk].trim() !== '', `INV-DATA-04: ${key}.${wk} non-empty string`);
    }
  }

  // INV-DOM-01
  console.assert(document.querySelectorAll('.word').length === 8, 'INV-DOM-01: 8 word divs');
  for (let i = 1; i <= 8; i++) {
    console.assert(document.getElementById('word' + i), `INV-DOM-01: #word${i} exists`);
  }

  console.log('All invariants verified');
}

// Run on load
verifyInvariants();
```

### Manual Verification Checklist

| Check | Method | Frequency |
|-------|--------|-----------|
| Card count = 200 | `Object.keys(cards).length` in console | On `cards.js` change |
| All 8 words present | DevTools Elements → count `.word` | On `index.html` change |
| Links have correct attributes | DevTools Elements → inspect anchor | On `script.js` change |
| HTTPS on all resources | DevTools Network → check protocol | On deploy |
| No console errors | DevTools Console | On every change |
| Mobile layout works | DevTools device toolbar | On CSS change |
| Keyboard navigation | Tab through page | On HTML change |

## Invariant Violation Response

| Invariant Category | Detection | Response |
|--------------------|-----------|----------|
| Data | Validation script, manual review | Fix `cards.js`, redeploy |
| Code | Tests, code review | Fix `script.js`, redeploy |
| DOM | Visual inspection, automated test | Fix `index.html`, redeploy |
| CSS | Visual regression, manual test | Fix `style.css`, redeploy |
| Network | DevTools, CSP reports | Fix `index.html`, redeploy |
| Deployment | GitHub Pages status | Check settings, redeploy |
| Behaviour | Manual testing | Fix code, redeploy |
| Security | Audit, CSP, Dependabot | Fix immediately, redeploy |
| Accessibility | axe-core, manual test | Fix HTML/CSS, redeploy |
| Performance | Lighthouse, WebPageTest | Optimize, redeploy |

## Summary

| Category | Invariants | Automated | Manual |
|----------|------------|-----------|--------|
| Data | 8 | 0 | 8 |
| Code | 12 | 0 | 12 |
| Query | 6 | 0 | 6 |
| DOM | 13 | 0 | 13 |
| CSS | 7 | 0 | 7 |
| Network | 6 | 0 | 6 |
| Deployment | 6 | 0 | 6 |
| Behaviour | 8 | 0 | 8 |
| Security | 6 | 0 | 6 |
| Accessibility | 6 | 0 | 6 |
| Performance | 4 | 0 | 4 |
| **Total** | **82** | **0** | **82** |

**Recommendation**: Add automated invariant verification (30 min) and run in CI.