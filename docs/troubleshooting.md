# Troubleshooting

## Overview

Common issues, causes, and solutions for the Alias Cards application.

---

## Quick Diagnostic

```bash
# 1. Check if site loads
curl -I https://hmlendea.github.io/alias-cards-rou/

# 2. Check for console errors (open DevTools in browser)
# 3. Verify all resources load (Network tab)
# 4. Test button click → new card
# 5. Test word click → NuciSearch opens
```

---

## Issues by Category

### Page Load Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Blank white page | `cards.js` syntax error | Check DevTools Console → fix JS |
| "cards is not defined" | `cards.js` not loaded / wrong order | Verify `<script src="cards.js">` before `script.js` |
| 404 on `cards.js` | File missing / wrong path | Ensure `cards.js` in repo root |
| 404 on `script.js` | File missing / wrong path | Ensure `script.js` in repo root |
| 404 on `style.css` | File missing / wrong path | Ensure `style.css` in repo root |
| Font Awesome icons missing (□) | CDN blocked / CSP | Check Network tab, add SRI, allow CDN |
| jQuery not loaded ($ undefined) | CDN blocked / wrong version | Check Network tab, verify URL |

### Card Draw Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Button click does nothing | `selectRandomCard` not defined | Check `script.js` loaded, no syntax errors |
| Same card repeats | Random coincidence (1/200) | Click again; add "no repeat" logic if needed |
| Only some words update | Selector mismatch in loop | Verify `#word1`–`#word8` exist in HTML |
| Word text shows HTML tags | Escaping broken | Check `$('<span>').text().html()` chain |
| Links missing `target="_blank"` | Template string error | Verify anchorHTML construction |

### NuciSearch Link Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Link opens 404 | NuciSearch URL changed | Check current NuciSearch URL format |
| Link opens blank page | Network / NuciSearch down | Try manually in browser |
| Wrong definition shown | Query format mismatch | Verify query logic in `script.js` |
| Special chars broken | Encoding issue | Verify `encodeURIComponent` used |
| Opens in same tab | `target="_blank"` missing | Check anchorHTML template |

### Styling/Layout Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Card cut off / scroll | Height > viewport | Check `.card { height: 85% }`, reduce |
| Horizontal scroll on mobile | Fixed width > viewport | Use `max-width: 100%`, check padding |
| Words overlap | Font size too large | Reduce `.word { font-size }` |
| Button not clickable | z-index / overlay | Check `.control-button { z-index }` |
| Links not purple on hover | CSS specificity | Check `a:hover` selector |
| Purple circles missing | `.word-number` styles | Verify `background: #8e44ad` |

### Mobile Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Card tiny on phone | Viewport not set | Verify `<meta name="viewport">` in HTML |
| Text unreadable | Font size not responsive | Check `@media (max-width: 768px)` |
| Button off-screen | Fixed positioning | Check `bottom/right` values in media query |
| Links hard to tap | Touch target too small | Increase padding on `a` in media query |

### Deployment Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Changes not live | GitHub Pages cache | Wait 1-2 min; hard refresh (Ctrl+Shift+R) |
| 404 on GitHub Pages | Wrong branch / path | Settings → Pages → Source: `main` / `/root` |
| Mixed content warnings | HTTP resource | All URLs must be HTTPS |
| Custom domain broken | DNS / CNAME | Check DNS, CNAME file, GitHub settings |

---

## Debugging Procedures

### Local Development Server

```bash
# From repo root
python3 -m http.server 8000
# Open http://localhost:8000
```

### Browser DevTools

1. **Console** — JavaScript errors, `console.log` output
2. **Network** — Failed requests (red), timing, sizes
3. **Elements** — DOM structure, applied styles, event listeners
4. **Sources** — Set breakpoints in `script.js`
5. **Application** — LocalStorage, cookies, cache

### Console Debugging

```javascript
// In DevTools Console

// Check cards loaded
console.log('Cards:', Object.keys(cards).length);  // Should be 200

// Inspect a card
console.log(cards['1']);

// Test draw function
selectRandomCard();

// Check DOM after draw
for (let i = 1; i <= 8; i++) {
  console.log(`word${i}:`, $('#word' + i + ' .word-text').html());
}

// Verify links
$$('.word-text a').forEach(a => console.log(a.href, a.textContent));
```

### Network Debugging

```bash
# Check all resources return 200
curl -s -o /dev/null -w "%{http_code}\n" https://hmlendea.github.io/alias-cards-rou/
curl -s -o /dev/null -w "%{http_code}\n" https://hmlendea.github.io/alias-cards-rou/cards.js
curl -s -o /dev/null -w "%{http_code}\n" https://hmlendea.github.io/alias-cards-rou/script.js
curl -s -o /dev/null -w "%{http_code}\n" https://hmlendea.github.io/alias-cards-rou/style.css

# Check CDN resources
curl -s -o /dev/null -w "%{http_code}\n" https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
curl -s -o /dev/null -w "%{http_code}\n" https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css
```

---

## Error Reference

### JavaScript Errors

| Error | File | Line | Meaning | Fix |
|-------|------|------|---------|-----|
| `Uncaught ReferenceError: cards is not defined` | script.js | 1 | `cards.js` not loaded | Fix script order in HTML |
| `Uncaught TypeError: Cannot read properties of undefined (reading 'word1')` | script.js | loop | Card missing words | Fix `cards.js` data |
| `Uncaught SyntaxError: Unexpected token` | cards.js | varies | Invalid JS syntax | Fix JSON/JS syntax |
| `jQuery is not defined` | script.js | 1 | jQuery not loaded | Check jQuery script tag |

### Network Errors

| Error | Resource | Meaning | Fix |
|-------|----------|---------|-----|
| 404 Not Found | cards.js | File missing from deploy | Push file to main branch |
| 404 Not Found | script.js | File missing from deploy | Push file to main branch |
| 404 Not Found | style.css | File missing from deploy | Push file to main branch |
| 502 Bad Gateway | CDN | CDN temporary issue | Wait, retry |
| CORS error | CDN | CSP blocking | Add `crossorigin="anonymous"` |

---

## Performance Issues

| Symptom | Diagnosis | Solution |
|---------|-----------|----------|
| Slow initial load | Large `cards.js` (80 KB) | Acceptable; consider splitting if >200 KB |
| Slow draw | DOM manipulation | Current < 10 ms; no action needed |
| Jank on mobile | Layout thrashing | Batch DOM updates (already done) |
| Memory growth | Event listeners | None added; no leak |

---

## Accessibility Issues

| Issue | Test | Fix |
|-------|------|-----|
| No focus outline | Tab through page | Add `:focus-visible` styles |
| Low contrast | axe-core / WAVE | Adjust colors in CSS |
| Missing alt text | Screen reader test | Links have text content (OK) |
| No landmarks | Screen reader test | Add `<main>`, `<nav>` if needed |

---

## Security Issues

| Issue | Detection | Fix |
|-------|-----------|-----|
| No SRI on CDN | Manual check | Add `integrity` attributes |
| No CSP | Manual check | Add CSP meta tag (limited on GH Pages) |
| Mixed content | Browser warning | Ensure all HTTPS |
| `noopener` missing | Code review | Already present |

---

## Escalation

| Level | Trigger | Action |
|-------|---------|--------|
| L1 | Single user report | Verify locally, check console |
| L2 | Multiple reports / core feature broken | Debug in DevTools, check Network |
| L3 | Site down / data corruption | Check GitHub Pages status, revert deploy |
| L4 | Security incident | Immediate revert, investigate, rotate any keys (none used) |

---

## Prevention Checklist

- [ ] Test locally before push
- [ ] Verify all 8 words render
- [ ] Test button and links
- [ ] Check mobile viewport
- [ ] Run `curl` health checks on deploy
- [ ] Monitor GitHub Pages build status
- [ ] Keep dependencies updated
- [ ] Add SRI to CDN resources
- [ ] Document all changes