# Design Decisions

## Overview

This document records the key design decisions for the Alias Cards application, their rationale, and alternatives considered.

## Decision Log

### 1. Vanilla HTML/CSS/JS (No Framework)

**Decision**: Use plain HTML, CSS, and JavaScript with no framework (React, Vue, Svelte, etc.).

**Date**: Project inception

**Rationale**:
- Zero build step — deploy by pushing files
- Zero dependencies — no `node_modules`, no package.json
- Zero learning curve — any web developer can modify
- Maximum performance — no framework overhead
- Longevity — vanilla JS doesn't become obsolete
- Simplicity — single file per concern

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| React + Vite | Build step, dependencies, overkill for 1 function |
| Vue 3 | Build step, dependencies |
| Svelte | Build step, compilation |
| Alpine.js | Still a dependency, minimal benefit |
| HTMX | Server needed, not static |

**Consequences**:
- Manual DOM manipulation (jQuery)
- No component reuse (not needed)
- No state management (not needed)
- No TypeScript (could add, but no build)

---

### 2. jQuery for DOM Manipulation

**Decision**: Use jQuery 3.6.3 via CDN for DOM operations.

**Date**: Project inception

**Rationale**:
- Familiar API (`$()`, `.html()`, `.text()`)
- Built-in HTML escaping via `.text()`
- Cross-browser compatibility (legacy)
- Small size (~30 KB gzipped)
- Already familiar to author

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Vanilla `document.querySelector` | Verbose, no built-in escaping |
| `textContent` + `innerHTML` | Manual escaping error-prone |
| Cash.js | Smaller but less familiar |
| uhtml / lit-html | Template overhead for simple case |

**Consequences**:
- Extra 30 KB download
- CDN dependency
- jQuery Easing loaded but unused (mistake)

---

### 3. Static Card Catalogue in JavaScript File

**Decision**: Store 200 cards × 8 words as a JavaScript object literal in `cards.js`.

**Date**: Project inception

**Rationale**:
- Zero parse time — browser evaluates directly
- Zero fetch — loads with script tag
- Zero dependencies — no JSON.parse, no fetch
- Easy to edit — plain JS object
- Version controlled — diffs readable

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| JSON file + fetch | Async, CORS, extra request, parse time |
| CSV + PapaParse | Dependency, parse time |
| IndexedDB | Complexity, async, overkill |
| Server API | Not static, hosting complexity |
| Embedded in HTML | Bloats HTML, not cacheable separately |

**Consequences**:
- 80 KB script (largest resource)
- No schema validation
- Manual editing only
- All 1,600 words in memory always

---

### 4. Uniform Random Card Selection

**Decision**: `Math.random()` uniform distribution across 200 cards.

**Date**: Project inception

**Rationale**:
- Simple, unbiased
- No weighting logic needed
- Predictable behaviour
- Easy to test/verify

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Weighted by difficulty | No difficulty metadata |
| Spaced repetition | Requires persistence, history |
| Category-based | No categories |
| Shuffle once, iterate | Requires session state |

**Consequences**:
- Duplicate cards possible (birthday paradox: ~50% after 17 draws)
- No learning optimisation
- Truly random, not "feels random"

---

### 5. Query Format Heuristic

**Decision**: Classify words by whitespace split: 1 word OR 2 words starting with "a" → short query (`WORD DEX`); else → long query (`Definiție: PHRASE`).

**Date**: Project inception

**Rationale**:
- Covers Romanian infinitives (`a verb`) and single nouns
- Heuristic matches observed data patterns
- No linguistic analysis needed
- Single `split(/\s+/)`

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Explicit type per word | 1,600 manual annotations |
| Dictionary lookup | External dependency, complexity |
| Part-of-speech tagger | Heavy, overkill |
| User selects | UX friction |

**Consequences**:
- Reflexive verbs (`a se mira` = 3 words) → long query (correct)
- False positives: 2-word phrases starting with "a" → short query (rare)
- False negatives: Single-word phrases → short query (acceptable)

---

### 6. NuciSearch Integration via Anchor Navigation

**Decision**: Generate `https://search.nucilandia.ro?q=...` links with `target="_blank" rel="noopener noreferrer"`.

**Date**: Project inception

**Rationale**:
- No CORS issues (navigation, not fetch)
- No API key needed
- User sees full dictionary context
- Opens in new tab — app stays open
- `noopener` + `noreferrer` — security best practice

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Embedded iframe | CSP, UX, sizing issues |
| Fetch + render results | CORS, API dependency, complexity |
| Custom dictionary | Maintenance burden |
| Wiktionary API | Rate limits, different language |

**Consequences**:
- Depends on external service (NuciSearch)
- No control over result format
- User leaves app context
- Referrer not sent (privacy)

---

### 7. GitHub Pages Hosting

**Decision**: Deploy to GitHub Pages from repository root.

**Date**: Project inception

**Rationale**:
- Free HTTPS hosting
- Custom domain support
- Automatic on push
- No server maintenance
- Integrates with Git workflow

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Netlify/Vercel | Extra account, config |
| Self-hosted VPS | Cost, maintenance |
| Firebase Hosting | Extra setup |
| Cloudflare Pages | Extra setup |

**Consequences**:
- No custom headers (CSP, Referrer-Policy)
- 10 min cache default
- No build step (static only)
- Single branch deployment

---

### 8. No Build Step

**Decision**: Serve source files directly, no bundling, minification, transpilation.

**Date**: Project inception

**Rationale**:
- Zero configuration
- Zero maintenance
- Instant deploy
- Debuggable source in production
- No toolchain to rot

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Vite/esbuild | Config, `node_modules`, build step |
| Webpack | Complex config |
| Rollup | Config, overkill |
| Manual minify | Manual step, easy to forget |

**Consequences**:
- Larger transfer sizes (~30% larger)
- No tree-shaking (jQuery Easing included)
- No TypeScript
- No linting in CI

---

### 9. Fixed 8 Words Per Card

**Decision**: Every card has exactly 8 words (`word1`–`word8`).

**Date**: Project inception

**Rationale**:
- Matches Alias game format (8 words per card)
- Fixed layout in CSS/HTML
- Predictable rendering
- Simple loop (1–8)

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Variable words per card | Dynamic layout, complex CSS |
| Configurable count | Unnecessary flexibility |
| Responsive count | Layout complexity |

**Consequences**:
- Cannot add/remove words without HTML/CSS/JS changes
- All cards must have 8 entries
- Empty slots if data missing

---

### 10. No User State/Persistence

**Decision**: No localStorage, sessionStorage, cookies, accounts, history.

**Date**: Project inception

**Rationale**:
- Privacy by default
- Zero backend
- Zero maintenance
- Instant reset on refresh
- No GDPR concerns

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| localStorage history | Privacy, storage quota, sync |
| User accounts | Backend, auth, privacy |
| Session history | Lost on close anyway |
| Favourites | Storage, UI complexity |

**Consequences**:
- No progress tracking
- No "previous card"
- No personalization
- Same experience every visit

---

### 11. CDN for External Libraries

**Decision**: Load jQuery, jQuery Easing, Font Awesome from cdnjs.cloudflare.com.

**Date**: Project inception

**Rationale**:
- No local copies to maintain
- Browser caching across sites
- Geographic distribution
- Automatic compression

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| Self-hosted | Manual updates, larger repo |
| npm + bundle | Build step required |
| jsDelivr | Similar, cdnjs preferred |

**Consequences**:
- Supply chain risk (mitigated by pinning versions)
- No SRI (should add)
- Third-party request (privacy)

---

### 12. Font Awesome for Icons

**Decision**: Use Font Awesome 6.5.1 for ⟳, GitHub, heart icons.

**Date**: Project inception

**Rationale**:
- Scalable vector icons
- Consistent style
- Single CSS include
- Widely recognized icons

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|
| SVG inline | More HTML, manual |
| Unicode chars (⟳, ❤, 🐙) | Inconsistent rendering |
| Custom icon font | Maintenance |
| CSS-only icons | Limited set |

**Consequences**:
- 50 KB CSS + font downloads
- Flash of unstyled icons
- CDN dependency

---

## Decision Template (For Future)

```markdown
### N. [Title]

**Decision**: [What was decided]

**Date**: [When]

**Rationale**: [Why]

**Alternatives Considered**:
| Alternative | Rejected Because |
|-------------|------------------|

**Consequences**:
- [Positive]
- [Negative]

**Revisit When**: [Condition to reconsider]
```