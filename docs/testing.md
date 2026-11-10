# Testing

## Overview

The Alias Cards application has **no automated tests**. Testing is entirely manual. This document describes the current testing approach, test cases, and recommendations for adding automated testing.

## Current Testing State

| Test Type | Status | Tool | Coverage |
|-----------|--------|------|----------|
| Unit tests | ❌ None | — | 0% |
| Integration tests | ❌ None | — | 0% |
| E2E tests | ❌ None | — | 0% |
| Visual regression | ❌ None | — | 0% |
| Accessibility audit | ❌ None | — | 0% |
| Performance budget | ❌ None | — | 0% |
| Manual testing | ✅ Ad-hoc | Browser | ~80% |

## Manual Test Cases

### Smoke Tests (Run on Every Change)

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| SMK-01 | Page loads | Open `https://hmlendea.github.io/alias-cards-rou/` | Page renders, no console errors |
| SMK-02 | Initial card drawn | Page load completes | 8 words visible in numbered slots |
| SMK-03 | Button click draws new card | Click ⟳ button | 8 new words appear |
| SMK-04 | Word link opens NuciSearch | Click any word link | New tab opens NuciSearch with query |
| SMK-05 | GitHub link works | Click GitHub icon | New tab opens GitHub repo |
| SMK-06 | Donate link works | Click heart icon | New tab opens Ko-fi |

### Functional Tests

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| FUN-01 | All 8 words populated | Load page, count `.word-text a` | Exactly 8 links |
| FUN-02 | Word numbers 1–8 | Inspect `.word-number` elements | Text content: "1", "2", ..., "8" |
| FUN-03 | Query format: single word | Find card with single noun, click | URL contains `word%20DEX` |
| FUN-04 | Query format: infinitive | Find card with `a verb`, click | URL contains `a%20verb%20DEX` |
| FUN-05 | Query format: phrase | Find card with phrase, click | URL contains `Defini%C8%9Bie%3A` |
| FUN-06 | HTML escaping | Find word with `<script>`, click | No script execution, text escaped |
| FUN-07 | Link target `_blank` | Inspect any word link | `target="_blank"` present |
| FUN-08 | Link rel noopener | Inspect any word link | `rel="noopener noreferrer"` present |
| FUN-09 | Random distribution | Draw 100 cards, track keys | Roughly uniform across 1–200 |
| FUN-10 | No duplicate draws in session | Draw 10 cards rapidly | All different (probabilistic) |

### Visual/Layout Tests

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| VIS-01 | Desktop layout | Viewport 1200×800 | Card centered, 85% height, proper aspect |
| VIS-02 | Mobile layout | Viewport 375×667 | Card fills width, words stacked |
| VIS-03 | Button position | Any viewport | Fixed bottom-right, 20px from edges |
| VIS-04 | GitHub link position | Any viewport | Fixed bottom-left, 20px from bottom/left |
| VIS-05 | Donate link position | Any viewport | Fixed bottom-left, 70px from bottom |
| VIS-06 | Hover states | Hover button, links | Color change to `#8e44ad` |
| VIS-07 | Focus states | Tab through elements | Visible focus outline |
| VIS-08 | Font Awesome icons | Load page | ⟳, GitHub, heart icons visible |

### Accessibility Tests

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| A11Y-01 | Keyboard navigation | Tab through all interactive elements | All 11 elements reachable in order |
| A11Y-02 | Button activation | Focus button, press Enter/Space | New card drawn |
| A11Y-03 | Link activation | Focus word link, press Enter | New tab opens NuciSearch |
| A11Y-04 | ARIA labels | Inspect button, GitHub, donate links | `aria-label` or `title` present |
| A11Y-05 | Link text meaningful | Inspect word links | Text = word itself (not "click here") |
| A11Y-06 | Color contrast | Check text/background ratios | WCAG AA (4.5:1) minimum |
| A11Y-07 | Zoom 200% | Browser zoom 200% | No horizontal scroll, content readable |
| A11Y-08 | Screen reader | NVDA/VoiceOver + tab | Announces button, links correctly |

### Error/Edge Case Tests

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| ERR-01 | Rapid button clicks | Click ⟳ 20 times rapidly | No errors, last card displayed |
| ERR-02 | Network offline | Disconnect network, click word | Browser shows offline page |
| ERR-03 | NuciSearch down | Mock 500 from NuciSearch | Browser shows error page |
| ERR-04 | Missing cards.js | Rename cards.js, reload | Console error, button broken |
| ERR-05 | Missing jQuery | Block jQuery CDN, reload | Console error, button broken |
| ERR-06 | Corrupted cards.js | Edit cards.js invalid JS | Console error, app broken |
| ERR-07 | Empty word value | Edit cards.js word1: "" | Empty link text (edge case) |
| ERR-08 | Special chars in word | Word with `&<>"'` | Properly escaped in anchor |

### Performance Tests

| ID | Test | Steps | Expected |
|----|------|-------|----------|
| PERF-01 | Initial load time | Lighthouse / DevTools Network | < 2 s on 3G |
| PERF-02 | Draw latency | Click ⟳, measure JS time | < 10 ms |
| PERF-03 | Memory leak | Draw 1000 cards, heap snapshot | No growing detached DOM |
| PERF-04 | Bundle size | Total transferred bytes | < 200 KB (incl. CDN) |

## Test Data

### Known Card Samples (for reproducible tests)

| Card ID | Word 1 | Word 2 | Word 3 | Word 4 | Word 5 | Word 6 | Word 7 | Word 8 |
|---------|--------|--------|--------|--------|--------|--------|--------|--------|
| 1 | kilometru | a urca | polul Nord | a se mira | a se bucura | a se teme | a se gândi | a se hotărî |
| 42 | (sample) | (sample) | (sample) | (sample) | (sample) | (sample) | (sample) | (sample) |
| 200 | (sample) | (sample) | (sample) | (sample) | (sample) | (sample) | (sample) | (sample) |

**Note**: Full catalogue in `cards.js` — 200 cards × 8 words.

### Test Queries for NuciSearch Validation

| Word Type | Example Word | Expected Query | Expected URL Fragment |
|-----------|--------------|----------------|----------------------|
| Noun | `kilometru` | `kilometru DEX` | `q=kilometru%20DEX` |
| Infinitive | `a urca` | `a urca DEX` | `q=a%20urca%20DEX` |
| Reflexive | `a se mira` | `Definiție: a se mira` | `q=Defini%C8%9Bie%3A%20a%20se%20mira` |
| Phrase | `polul Nord` | `Definiție: polul Nord` | `q=Defini%C8%9Bie%3A%20polul%20Nord` |
| Special chars | `a & b` | `Definiție: a & b` | `q=Defini%C8%9Bie%3A%20a%20%26%20b` |

## Automated Testing Recommendations

### Option 1: Playwright (E2E) — Recommended

```javascript
// tests/e2e.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Alias Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://hmlendea.github.io/alias-cards-rou/');
  });

  test('loads and shows card', async ({ page }) => {
    await expect(page.locator('.word-text a')).toHaveCount(8);
  });

  test('button draws new card', async ({ page }) => {
    const wordsBefore = await page.locator('.word-text a').allTextContents();
    await page.click('#next-button');
    const wordsAfter = await page.locator('.word-text a').allTextContents();
    expect(wordsAfter).not.toEqual(wordsBefore);
  });

  test('word links open NuciSearch', async ({ page, context }) => {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('.word-text a:first-child')
    ]);
    await expect(newPage).toHaveURL(/search\.nucilandia\.ro/);
  });

  test('query format: single word', async ({ page }) => {
    // Would need to inject known card or mock cards.js
  });
});
```

**Setup**:
```bash
npm init -y
npm install -D @playwright/test
npx playwright install chromium
npx playwright test
```

### Option 2: Vitest + JSDOM (Unit/Integration)

```javascript
// tests/unit.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe('selectRandomCard', () => {
  let dom, window, document, $, cards;

  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><html><body>
      <div id="word1"><span class="word-text"></span></div>
      ...
      <div id="word8"><span class="word-text"></span></div>
    </body></html>`, { url: 'http://localhost' });
    window = dom.window;
    document = window.document;
    global.window = window;
    global.document = document;
    global.navigator = window.navigator;

    // Load jQuery
    $ = require('jquery')(window);
    global.$ = global.jQuery = $;

    // Load cards
    cards = { "1": {word1: "test", ..., word8: "test"} };
    global.cards = cards;

    // Load script.js (would need to be module or eval)
  });

  it('selects random card', () => {
    selectRandomCard();
    // Assert DOM updated
  });

  it('formats query for single word', () => {
    // Test query logic
  });
});
```

### Option 3: Lighthouse CI (Performance/Accessibility)

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install -g @lhci/cli
      - run: lhci autorun
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:8000"],
      "startServerCommand": "python3 -m http.server 8000"
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.8 }]
      }
    }
  }
}
```

## Test Infrastructure (Not Present)

### Missing

- [ ] Test runner (Playwright, Vitest, Jest)
- [ ] CI pipeline (GitHub Actions)
- [ ] Test data fixtures
- [ ] Mock NuciSearch for deterministic tests
- [ ] Visual regression baseline images
- [ ] Accessibility regression baseline
- [ ] Performance budgets

### Required for CI

```yaml
# .github/workflows/test.yml (minimal)
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install -D @playwright/test
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
```

## Test Execution

### Current: Manual Only

```bash
# 1. Start local server
python3 -m http.server 8000

# 2. Open browser
# http://localhost:8000

# 3. Run through test cases in "Manual Test Cases" above

# 4. Check DevTools Console for errors

# 5. Run Lighthouse in DevTools (Audit tab)
```

### Future: Automated

```bash
# Unit/Integration
npm test

# E2E
npm run test:e2e

# Visual regression
npm run test:visual

# Accessibility
npm run test:a11y

# Performance
npm run test:perf
```

## Coverage Goals (If Automated)

| Metric | Target |
|--------|--------|
| Statement coverage | > 90% |
| Branch coverage | > 80% |
| Function coverage | 100% (only `selectRandomCard`) |
| E2E critical paths | 100% (load, draw, link) |
| Accessibility | WCAG 2.1 AA |
| Performance | Lighthouse > 90 |

## Risk Assessment

| Risk | Likelihood | Impact | Current Mitigation |
|------|------------|--------|-------------------|
| Regression in `selectRandomCard` | Medium | High (core feature) | Manual smoke test |
| Query format bug | Low | Medium (wrong search) | Manual functional test |
| XSS via word text | Low | High | jQuery `.text()` escaping |
| CDN failure | Low | High (broken app) | None |
| NuciSearch API change | Low | Medium (broken links) | None |
| Browser compatibility | Low | Medium | Manual multi-browser test |

## Recommendation Priority

1. **Add Playwright E2E** — Covers critical user flows, runs in CI
2. **Add Lighthouse CI** — Catches performance/accessibility regressions
3. **Add unit test for query logic** — Pure function, easy to test
4. **Add visual regression** — If UI changes frequently
5. **Add contract test for NuciSearch** — If API stabilises