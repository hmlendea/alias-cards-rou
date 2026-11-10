# Change Guide

## Overview

This document describes how to make common changes to the Alias Cards application safely and correctly.

## Change Categories

| Category | Files Affected | Risk | Review Required |
|----------|----------------|------|-----------------|
| Card content | `cards.js` | Low | Yes (PR) |
| Draw logic | `script.js` | Medium | Yes (PR) |
| Visual styling | `style.css` | Low | Visual check |
| Layout/structure | `index.html` | Medium | Yes (PR) |
| Dependencies | `index.html` | Medium | Yes (PR) |
| Documentation | `docs/*.md`, root `*.md` | Low | Yes (PR) |

---

## Adding/Modifying Cards

### Location

`cards.js` — JavaScript object literal with 200 cards.

### Format

```javascript
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
  // ... cards 2-199
  "200": {
    word1: "...",
    word2: "...",
    word3: "...",
    word4: "...",
    word5: "...",
    word6: "...",
    word7: "...",
    word8: "..."
  }
};
```

### Rules

1. **Exactly 8 words per card** — Keys must be `word1` through `word8`
2. **Sequential numeric keys** — `"1"`, `"2"`, ..., `"200"` (as strings)
3. **Non-empty strings** — No empty words
4. **Romanian vocabulary** — Target language
5. **UTF-8 encoding** — Save file as UTF-8
6. **No trailing commas** — After last property of last card

### Adding a New Card (201+)

1. Open `cards.js`
2. Add new entry after `"200"`:
   ```javascript
  "201": {
    word1: "cuvânt nou",
    word2: "a alerga",
    word3: "munte mare",
    word4: "a citi",
    word5: "a scrie",
    word6: "a desena",
    word7: "a cânta",
    word8: "a dansa"
  }
   ```
3. Update expected count in documentation (`docs/data-model.md`, `docs/configuration.md`)
4. Test: load page, verify card appears in draws
5. Commit and push

### Modifying Existing Card

1. Find card by ID in `cards.js`
2. Edit word values
3. Maintain 8 words per card
4. Test: draw until card appears (or temporarily modify `script.js` to force specific card)
5. Commit and push

### Bulk Editing

Use a script for large changes:

```javascript
// edit-cards.js
const fs = require('fs');
const cards = require('./cards.js'); // If module, or parse manually

// Example: fix encoding issue
for (const key of Object.keys(cards)) {
  for (let i = 1; i <= 8; i++) {
    cards[key]['word' + i] = cards[key]['word' + i].replace(/â/g, 'â');
  }
}

fs.writeFileSync('cards.js', 'const cards = ' + JSON.stringify(cards, null, 2) + ';');
```

---

## Modifying Draw Logic

### Location

`script.js` — `selectRandomCard()` function.

### Current Logic

```javascript
function selectRandomCard() {
  const keys = Object.keys(cards);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const selectedCard = cards[randomKey];

  for (let i = 1; i <= 8; i++) {
    const wordKey = 'word' + i;
    const wordText = selectedCard[wordKey];
    const parts = wordText.trim().split(/\s+/);
    const useShortQuery = parts.length === 1 ||
      (parts.length === 2 && parts[0].toLowerCase() === 'a');
    const query = useShortQuery
      ? wordText + ' DEX'
      : 'Definiție: ' + wordText;
    const encodedQuery = encodeURIComponent(query);
    const url = 'https://search.nucilandia.ro?q=' + encodedQuery;
    const escapedText = $('<span>').text(wordText).html();
    const anchorHTML = '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + escapedText + '</a>';
    $('#' + wordKey + ' .word-text').html(anchorHTML);
  }
}
```

### Common Modifications

#### Change Random Distribution

```javascript
// Weighted random (requires card metadata)
const weights = keys.map(k => cards[k].difficulty || 1);
const totalWeight = weights.reduce((a, b) => a + b, 0);
let random = Math.random() * totalWeight;
for (let i = 0; i < keys.length; i++) {
  random -= weights[i];
  if (random <= 0) { randomKey = keys[i]; break; }
}
```

#### Change Query Format

```javascript
// Add new condition for 3-word phrases starting with "a se"
const useShortQuery = parts.length === 1 ||
  (parts.length === 2 && parts[0].toLowerCase() === 'a') ||
  (parts.length === 3 && parts[0].toLowerCase() === 'a' && parts[1].toLowerCase() === 'se');
```

#### Add Categories

```javascript
// If cards have category metadata
const category = selectedCard.category;
const query = useShortQuery
  ? wordText + ' DEX'
  : 'Definiție: ' + wordText + ' (' + category + ')';
```

### Testing Changes

1. Edit `script.js`
2. Load locally: `python3 -m http.server 8000`
3. Open DevTools Console
4. Call `selectRandomCard()` manually
5. Verify:
   - 8 words updated
   - Links have correct URLs
   - No console errors
6. Test edge cases (special chars, long words, etc.)
7. Commit and push

---

## Modifying Visual Styling

### Location

`style.css` — All styles.

### Key Selectors

| Element | Selector | Purpose |
|---------|----------|---------|
| Card container | `.card` | Main card box |
| Word row | `.word` | Flex container for number + text |
| Word number | `.word-number` | Purple circle 1–8 |
| Word text | `.word-text` | Contains the link |
| Links | `.word-text a` | Word links |
| Button | `.control-button` | ⟳ button |
| GitHub link | `.github-link` | Bottom-left GitHub |
| Donate link | `.donate-link` | Bottom-left heart |

### Common Changes

#### Card Size

```css
.card {
  height: 85%;        /* Change percentage */
  aspect-ratio: 1 / 1.4;  /* Change ratio */
  max-width: 600px;   /* Change max width */
}
```

#### Font Size

```css
.word {
  font-size: 2.2em;   /* Change word text size */
}

.word-number {
  font-size: 1.5em;   /* Change number size */
}
```

#### Colors

```css
:root {
  --primary: #8e44ad;      /* Purple accent */
  --bg: #f5f6fa;           /* Page background */
  --card-bg: white;        /* Card background */
  --text: #2c3e50;         /* Primary text */
  --text-hover: #8e44ad;   /* Hover color */
}

.word-number { background: var(--primary); }
a { color: var(--text); }
a:hover { color: var(--text-hover); }
```

#### Mobile Breakpoint

```css
@media (max-width: 768px) {  /* Change breakpoint */
  .card { height: auto; }
  .word { font-size: 1.8em; }
}
```

### Testing Changes

1. Edit `style.css`
2. Load locally
3. Test viewports: 375px, 768px, 1200px, 1920px
4. Test orientations: portrait, landscape
5. Verify no horizontal scroll
6. Check hover/focus states
7. Commit and push

---

## Modifying Layout/Structure

### Location

`index.html` — DOM structure.

### Critical Elements (Do Not Remove)

| Element | ID/Class | Required By |
|---------|----------|-------------|
| Word containers | `#word1`–`#word8` | `script.js` |
| Word text spans | `.word-text` | `script.js` |
| Next button | `#next-button` | `onclick` handler |
| Card container | `.card` | CSS layout |

### Adding Elements

1. Add HTML in appropriate location
2. Add corresponding CSS in `style.css`
3. Update `script.js` if dynamic content needed
4. Test thoroughly

### Removing Elements

1. Verify not referenced in `script.js` or `style.css`
2. Remove from `index.html`
3. Remove orphaned CSS
4. Test

---

## Updating Dependencies

### Location

`index.html` — `<script>` and `<link>` tags.

### jQuery

```html
<!-- Current -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>

<!-- Update to 3.7.1 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        integrity="sha512-..."
        crossorigin="anonymous"></script>
```

**Steps**:
1. Check jQuery changelog for breaking changes
2. Update version in URL
3. Add SRI hash (get from cdnjs)
4. Test locally: all functionality works
5. Commit and push

### Font Awesome

```html
<!-- Current -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<!-- Update to 6.6.0 -->
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
      integrity="sha512-..."
      crossorigin="anonymous">
```

**Steps**:
1. Check Font Awesome changelog for icon class changes
2. Update version in URL
3. Add SRI hash
4. Verify icons still render (⟳, GitHub, heart)
5. Commit and push

### Removing jQuery Easing (Recommended)

```html
<!-- REMOVE THIS LINE -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.12.1/jquery.easing.min.js"></script>
```

**Steps**:
1. Verify not used in `script.js` (grep for `easing`)
2. Remove line from `index.html`
3. Test locally
4. Commit and push

---

## Documentation Updates

### When to Update

| Trigger | Documents to Update |
|---------|---------------------|
| Card count change | `docs/data-model.md`, `docs/configuration.md`, `docs/repository-overview.md` |
| Draw logic change | `docs/flows/startup-and-rendering.md`, `docs/flows/calendar-search.md`, `docs/flows/detail-mutation.md`, `docs/components/application-services.md` |
| Query format change | `docs/data-model.md`, `docs/flows/calendar-search.md`, `docs/components/application-services.md` |
| Styling change | `docs/components/presentation.md` |
| Layout change | `docs/components/presentation.md`, `docs/repository-structure.md` |
| Dependency change | `docs/dependencies.md`, `docs/build-and-deployment.md`, `docs/security.md` |
| New integration | `docs/integrations.md`, `docs/architecture.md` |
| Security change | `docs/security.md`, `SECURITY.md` |

### Process

1. Make code change
2. Update affected documentation
3. Verify links still work
4. Commit together (code + docs)

---

## Release Process

### Current: Continuous Deployment

```
git add .
git commit -m "feat: description of change"
git push origin main
# GitHub Pages auto-deploys in 1-2 minutes
```

### Versioning (Not Currently Used)

If versioning added:

```bash
# Tag release
git tag -a v1.1.0 -m "Add card categories"
git push origin v1.1.0

# GitHub Release created manually or via workflow
```

### Rollback

```bash
# Quick rollback
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <good-commit>
git push --force origin main  # Requires force push permission
```

---

## Pre-Commit Checklist

- [ ] Test locally with `python3 -m http.server`
- [ ] Verify no console errors
- [ ] Test button draws new card
- [ ] Test word links open NuciSearch
- [ ] Test GitHub/Donate links
- [ ] Test mobile viewport (375px, 768px)
- [ ] Test keyboard navigation (Tab, Enter)
- [ ] Check all 8 words display
- [ ] Verify HTTPS on all external resources
- [ ] Update relevant documentation
- [ ] Commit message follows convention

---

## Emergency Procedures

### Site Down (GitHub Pages)

1. Check GitHub Status: `https://www.githubstatus.com/`
2. Check repository Settings → Pages for errors
3. Verify `main` branch exists and has `index.html`
4. Force rebuild: Settings → Pages → "Save" (no changes needed)

### Broken Functionality After Deploy

1. Revert immediately: `git revert HEAD && git push origin main`
2. Investigate locally
3. Fix and re-deploy

### CDN Compromise

1. Add SRI hashes immediately
2. Or switch to local copies
3. Deploy fix
4. Monitor