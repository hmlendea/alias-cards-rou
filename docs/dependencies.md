# Dependencies

## Overview

The Alias Cards application has **zero build-time dependencies** and **four runtime dependencies** loaded via CDN.

## Dependency Graph

```
index.html (entry)
├── style.css (local)
├── cards.js (local)
├── script.js (local)
├── Font Awesome 6.5.1 (CDN) ──► CSS only
├── jQuery 3.6.3 (CDN) ──► Required
├── jQuery Easing 1.12.1 (CDN) ──► Loaded, UNUSED
└── NuciSearch (external service) ──► Runtime integration
```

## Runtime Dependencies (CDN)

### 1. jQuery 3.6.3 — **Required**

| Property | Value |
|----------|-------|
| **Purpose** | DOM manipulation, event handling, HTML escaping |
| **CDN URL** | `https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js` |
| **Size** | ~30 KB (minified, gzipped ~10 KB) |
| **Global** | `$`, `jQuery` |
| **Used By** | `script.js` — `$(document).ready()`, `$('#id')`, `.html()`, `$('<span>').text().html()` |
| **Critical** | Yes — app non-functional without it |
| **SRI** | Not currently used (recommended) |
| **License** | MIT |

**Usage in `script.js`:**
```javascript
$(document).ready(function() { selectRandomCard(); });  // Initial draw
$('#' + word + ' .word-text').html(anchorHTML);        // DOM injection
$('<span>').text(wordText).html();                     // HTML escaping
```

### 2. jQuery Easing 1.12.1 — **Unused (Dead Code)**

| Property | Value |
|----------|-------|
| **Purpose** | Extended easing functions for animations |
| **CDN URL** | `https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.12.1/jquery.easing.min.js` |
| **Size** | ~5 KB (minified, gzipped ~2 KB) |
| **Global** | Extends `$.easing` |
| **Used By** | **Nothing** — no animations in codebase |
| **Critical** | No — safe to remove |
| **SRI** | Not used |
| **License** | BSD-3-Clause |

**Recommendation**: Remove from `index.html` — saves 1 HTTP request + 5 KB.

### 3. Font Awesome 6.5.1 — **Required (Icons)**

| Property | Value |
|----------|-------|
| **Purpose** | Icons for button (⟳), GitHub, Donate |
| **CDN URL** | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css` |
| **Size** | ~50 KB (CSS, gzipped ~10 KB) + font files (lazy-loaded) |
| **Global** | CSS classes: `fa-redo`, `fa-github`, `fa-heart` |
| **Used By** | `index.html` — `<i class="fa-solid fa-redo"></i>` etc. |
| **Critical** | Yes — icons missing without it (fallback: text) |
| **SRI** | Not currently used (recommended) |
| **License** | CC BY 4.0 (icons), SIL OFL 1.1 (fonts), MIT (CSS) |

**Usage in `index.html`:**
```html
<i class="fa-solid fa-redo"></i>           <!-- ⟳ button -->
<i class="fa-brands fa-github"></i>        <!-- GitHub link -->
<i class="fa-solid fa-heart"></i>          <!-- Donate link -->
```

## Local Dependencies (Source Files)

### 1. `cards.js` — **Required (Data)**

| Property | Value |
|----------|-------|
| **Purpose** | Card catalogue (200 cards × 8 words) |
| **Size** | ~80 KB (raw), ~25 KB gzipped |
| **Global** | `cards` object |
| **Used By** | `script.js` — `Object.keys(cards)`, `cards[randomKey]` |
| **Critical** | Yes — empty app without it |
| **Format** | JavaScript object literal (IIFE not used) |
| **Encoding** | UTF-8 |

### 2. `script.js` — **Required (Logic)**

| Property | Value |
|----------|-------|
| **Purpose** | Application logic: random draw, query formatting, DOM update |
| **Size** | ~1 KB |
| **Global** | `selectRandomCard` function |
| **Used By** | `index.html` — `onclick="selectRandomCard()"` |
| **Critical** | Yes — button non-functional without it |
| **Dependencies** | Requires `cards` global, `$` global (jQuery) |

### 3. `style.css` — **Required (Presentation)**

| Property | Value |
|----------|-------|
| **Purpose** | All visual styling |
| **Size** | ~3 KB |
| **Used By** | `index.html` — `<link rel="stylesheet" href="style.css">` |
| **Critical** | Yes — unstyled/broken layout without it |
| **Dependencies** | None |

### 4. `index.html` — **Required (Structure)**

| Property | Value |
|----------|-------|
| **Purpose** | DOM structure, resource loading, initial content |
| **Size** | ~2 KB |
| **Role** | Entry point, orchestrates all dependencies |
| **Critical** | Yes — no app without it |

## External Service Dependency

### NuciSearch — **Required (Word Lookup)**

| Property | Value |
|----------|-------|
| **Purpose** | Romanian dictionary/definition search |
| **Base URL** | `https://search.nucilandia.ro` |
| **Query Parameter** | `q` (URL-encoded) |
| **Protocol** | HTTPS only |
| **Integration** | Anchor navigation (`target="_blank"`) |
| **Critical** | Yes — word links non-functional without it |
| **SLA** | None (external, uncontrolled) |
| **Rate Limits** | Unknown (public service) |
| **CORS** | N/A (navigation, not fetch) |

**Query Formats Sent:**
- Short: `https://search.nucilandia.ro?q=kilometru%20DEX`
- Long: `https://search.nucilandia.ro?q=Defini%C8%9Bie%3A%20polul%20Nord`

## Dependency Analysis

### Critical Path (Must Load for Functionality)

```
index.html
    ├── style.css (local, fast)
    ├── cards.js (local, 80 KB) ──────► Largest, blocks draw
    ├── script.js (local, 1 KB)
    ├── jQuery 3.6.3 (CDN, 30 KB) ────► Required for script.js
    └── Font Awesome (CDN, 50 KB) ────► Required for icons
```

### Non-Critical (Can Fail Gracefully)

| Dependency | Failure Mode | User Impact |
|------------|--------------|-------------|
| jQuery Easing | 404/timeout | None — unused |
| NuciSearch | Down/slow | Word links open error page |
| Font Awesome fonts | Blocked | Icons show as squares (CSS loaded) |

### Load Order Requirements

```html
<!-- Required order in index.html -->
<script src="jquery.min.js"></script>        <!-- 1. $ defined -->
<script src="jquery.easing.min.js"></script> <!-- 2. Extends $ (optional) -->
<script src="cards.js"></script>             <!-- 3. cards defined -->
<script src="script.js"></script>            <!-- 4. Uses $ and cards -->
```

**Violating order** → `ReferenceError: $ is not defined` or `ReferenceError: cards is not defined`.

## Version Management

### Current Versions (Pinned in HTML)

| Dependency | Version | Pinned? | Update Process |
|------------|---------|---------|----------------|
| jQuery | 3.6.3 | Yes (URL) | Manual edit `index.html` |
| jQuery Easing | 1.12.1 | Yes (URL) | Manual edit `index.html` |
| Font Awesome | 6.5.1 | Yes (URL) | Manual edit `index.html` |
| cards.js | N/A | N/A (local) | Edit file directly |
| script.js | N/A | N/A (local) | Edit file directly |
| style.css | N/A | N/A (local) | Edit file directly |

### Update Considerations

| Dependency | Breaking Change Risk | Testing Needed |
|------------|---------------------|----------------|
| jQuery 3.x → 4.x | High (API changes) | Full regression |
| jQuery 3.6.x → 3.7.x | Low (patch) | Smoke test |
| Font Awesome 6.x → 7.x | High (class names) | Visual regression |
| Font Awesome 6.5.x → 6.6.x | Low | Visual check |
| NuciSearch URL/API | Unknown | Manual verification |

## Security Considerations

### CDN Risks

| Risk | Mitigation |
|------|------------|
| CDN compromise | Add Subresource Integrity (SRI) hashes |
| CDN outage | Local fallbacks / self-host |
| Version drift | Pin exact versions (current) |
| Mixed content | All CDN URLs use HTTPS (current) |

### Recommended SRI Hashes

```html
<!-- jQuery 3.6.3 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js"
        integrity="sha512-STof4xm1wgkfm7heWqFJVn58Hm3EtS31XFaagaa8VMReCXAkQnJZ+jEy8PCC/iT18dFy95WcExNHFTqLyp72eQ=="
        crossorigin="anonymous"></script>

<!-- jQuery Easing 1.12.1 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.12.1/jquery.easing.min.js"
        integrity="sha512-..."
        crossorigin="anonymous"></script>

<!-- Font Awesome 6.5.1 CSS -->
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      integrity="sha512-..."
      crossorigin="anonymous">
```

### Content Security Policy (If Added)

```html
<meta http-equiv="Content-Security-Policy"
      content="
        default-src 'self';
        script-src 'self' https://cdnjs.cloudflare.com;
        style-src 'self' https://cdnjs.cloudflare.com;
        font-src https://cdnjs.cloudflare.com;
        connect-src 'none';
        frame-src 'none';
        img-src 'self' data:;
      ">
```

## License Compliance

| Dependency | License | Obligations | Status |
|------------|---------|-------------|--------|
| jQuery | MIT | Preserve copyright/license notice | ✓ (in minified file) |
| jQuery Easing | BSD-3-Clause | Preserve copyright/license notice | ✓ (in minified file) |
| Font Awesome | CC BY 4.0 / SIL OFL / MIT | Attribution for icons/fonts | ⚠ Not in UI |
| NuciSearch | Unknown (service) | Terms of service | ⚠ Review needed |

**Action**: Add Font Awesome attribution in footer or about section.

## Dependency Health Checklist

- [ ] Remove unused jQuery Easing
- [ ] Add SRI hashes to all CDN resources
- [ ] Add Font Awesome attribution
- [ ] Document NuciSearch ToS compliance
- [ ] Consider self-hosting critical dependencies (jQuery, Font Awesome CSS)
- [ ] Add Dependabot / Renovate for automated version monitoring
- [ ] Test with CSP header