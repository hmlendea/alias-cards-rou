# Inspect, Edit, Delete Behaviour

## Overview

This document describes the inspect, edit, and delete capabilities available to users in the Alias Cards application.

## Inspect Behaviour

### Card Inspection

| Aspect | Capability |
|--------|------------|
| View current card | Always visible — 8 words displayed |
| View word details | Click word link → opens NuciSearch in new tab |
| View card metadata | None — no card ID, category, difficulty shown |
| View draw history | None — no history tracking |
| View statistics | None — no counters, no progress |

### DOM Inspection (Developer)

| Tool | What Can Be Inspected |
|------|----------------------|
| DevTools Elements | Current DOM state — 8 word slots with anchors |
| DevTools Console | `cards` object (200 cards × 8 words) |
| DevTools Network | Resource loads (index.html, style.css, cards.js, script.js, CDN) |
| DevTools Sources | All source files (index.html, style.css, cards.js, script.js) |

### Data Inspection

```javascript
// In console: inspect full catalogue
console.log(cards)
// → { "1": {word1: "...", ..., word8: "..."}, ..., "200": {...} }

// Inspect specific card
console.log(cards["42"])
// → {word1: "...", word2: "...", ..., word8: "..."}

// Count cards
Object.keys(cards).length
// → 200

// Count total words
Object.values(cards).flatMap(Object.values).length
// → 1600

// Current displayed card (from DOM)
Array.from(document.querySelectorAll('.word-text a')).map(a => a.textContent)
// → ["word1", "word2", ..., "word8"]
```

## Edit Behaviour

### User-Level Editing

| Entity | Editable? | Method |
|--------|-----------|--------|
| Current card | No | — |
| Word text | No | — |
| Word links | No | — |
| Card catalogue | No | — |
| Application settings | No | — |
| Theme/appearance | No | — |

**No user-facing edit capabilities exist.**

### Developer-Level Editing

#### Source Code Edits

| File | Editable Content | Effect |
|------|------------------|--------|
| `cards.js` | Card catalogue (add/remove/modify cards) | Changes available words — requires deploy |
| `script.js` | `selectRandomCard()` logic | Changes draw behaviour, query format — requires deploy |
| `style.css` | Visual styling | Changes appearance — requires deploy |
| `index.html` | DOM structure, button, links | Changes layout/structure — requires deploy |

#### Runtime Edits (Console)

```javascript
// Override cards object (temporary, until refresh)
cards = {"1": {word1: "test", word2: "test", ..., word8: "test"}}

// Override selectRandomCard (temporary)
selectRandomCard = function() { /* custom logic */ }

// Modify DOM directly (temporary)
$('#word1 .word-text').html('<a href="...">custom</a>')

// Add custom card to catalogue (temporary)
cards["201"] = {word1: "new", word2: "word", ..., word8: "here"}
```

**All runtime edits lost on page refresh.**

#### Build-Time Edits

- No build step — direct source edits
- Deploy = push to GitHub Pages branch
- Changes live after GitHub Pages rebuild (~1–2 min)

## Delete Behaviour

### User-Level Deletion

| Entity | Deletable? | Method |
|--------|------------|--------|
| Current card | No | — |
| Word from card | No | — |
| Card from catalogue | No | — |
| Draw history | N/A | — |
| Account/data | N/A | — |

**No user-facing delete capabilities exist.**

### Developer-Level Deletion

#### Source Code Deletion

| File | Deletable Content | Effect |
|------|-------------------|--------|
| `cards.js` | Remove card entries | Reduces catalogue — requires deploy |
| `cards.js` | Delete entire file | Breaks app (ReferenceError) — requires deploy |
| `script.js` | Delete `selectRandomCard` | Button does nothing — requires deploy |
| `style.css` | Delete rules | Unstyled — requires deploy |
| `index.html` | Remove elements | Broken layout — requires deploy |

#### Runtime Deletion (Console)

```javascript
// Delete specific card (temporary)
delete cards["42"]

// Delete all cards (temporary)
cards = {}

// Delete function (temporary)
delete selectRandomCard

// Remove DOM elements (temporary)
$('#word1').remove()
$('.card').remove()
```

**All runtime deletions lost on page refresh.**

#### Repository Deletion

- Delete files from GitHub repo → removed from GitHub Pages
- Delete repo → application unavailable
- No soft delete / archive — standard Git operations

## Summary Matrix

| Operation | User | Developer (Runtime) | Developer (Source) |
|-----------|------|---------------------|-------------------|
| Inspect card | ✓ View | ✓ Console/DOM | ✓ Source |
| Inspect catalogue | ✗ | ✓ `console.log(cards)` | ✓ `cards.js` |
| Edit card | ✗ | ✓ DOM manipulation | ✓ `cards.js` |
| Edit catalogue | ✗ | ✓ `cards = {...}` | ✓ `cards.js` |
| Edit logic | ✗ | ✓ Function override | ✓ `script.js` |
| Edit style | ✗ | ✓ DevTools CSS | ✓ `style.css` |
| Delete card | ✗ | ✓ `delete cards["N"]` | ✓ Remove from `cards.js` |
| Delete catalogue | ✗ | ✓ `cards = {}` | ✓ Delete `cards.js` |
| Delete logic | ✗ | ✓ `delete fn` | ✓ Edit `script.js` |

## Design Rationale

### Why No User Edit/Delete?

1. **Purpose**: Vocabulary learning tool — fixed, curated content
2. **Simplicity**: Zero configuration, zero state, zero complexity
3. **Integrity**: All users see same cards, same distribution
4. **Maintenance**: No user data to backup, migrate, or secure
5. **Performance**: No storage, no sync, no conflict resolution

### Why Developer Edit/Delete Exists?

1. **Content updates**: Add new cards, fix typos, improve definitions
2. **Feature evolution**: Modify query logic, add categories, difficulty
3. **Bug fixes**: Correct query formatting, escaping, accessibility
4. **Experimentation**: Test changes in console before committing

## Security Implications

### No User Edit/Delete = No Injection Vectors

- No user input → no XSS via stored data
- No user input → no SQL/NoSQL injection
- No user input → no path traversal
- No user input → no CSRF targets

### Developer Edit/Delete = Supply Chain Risk

- `cards.js` modifications affect all users
- GitHub Pages deploy = production release
- Review process: PR → review → merge → deploy
- No automated content validation

## Audit Trail

### Source Changes

- Git history: every `cards.js` change tracked
- Commit messages: document what/why
- PR reviews: second pair of eyes
- Deploy logs: GitHub Actions/Pages history

### Runtime Changes

- **No audit trail** — console edits ephemeral
- DevTools console history: per-session only
- No server-side logging of client mutations