# Error Handling

## Overview

The Alias Cards application has **minimal error handling** — it relies on browser defaults and fails silently in most error scenarios. This document describes current behaviour, gaps, and recommendations.

## Current Error Handling

### JavaScript Errors

| Error Scenario | Current Behaviour | User Impact |
|----------------|-------------------|-------------|
| `cards` undefined | `ReferenceError` in console, button does nothing | Button broken, no card drawn |
| `cards` empty object | Loop runs 0 times, blank card | Empty word slots |
| jQuery (`$`) undefined | `ReferenceError` in console, button does nothing | Button broken |
| `selectRandomCard` throws | Uncaught exception in console | Button broken |
| Network error loading `cards.js` | Script fails, `cards` undefined | Button broken |
| Network error loading jQuery | `$` undefined | Button broken |
| Network error loading Font Awesome | Icons missing (fallback to text) | Visual only |
| NuciSearch unreachable | Browser shows "This site can't be reached" in new tab | Word links fail |

### DOM Errors

| Error Scenario | Current Behaviour |
|----------------|-------------------|
| `#wordN` element missing | jQuery selector returns empty, `.html()` no-op, silent |
| `.word-text` element missing | Same as above |
| Duplicate IDs | First match used, others ignored |

### Network Errors

| Resource | Failure Mode | Recovery |
|----------|--------------|----------|
| `index.html` | Browser error page | Refresh |
| `style.css` | Unstyled page | Refresh |
| `script.js` | Button non-functional | Refresh |
| `cards.js` | Button non-functional | Refresh |
| jQuery CDN | Button non-functional | Refresh / CDN recovery |
| Font Awesome CDN | Missing icons | Refresh / CDN recovery |
| NuciSearch | External link fails | Retry / wait |

## Error Boundaries (None)

- No `try/catch` in `selectRandomCard()`
- No `window.onerror` handler
- No `unhandledrejection` handler (no promises)
- No React-style error boundaries (not applicable)

## Silent Failures

### jQuery Selector Failures

```javascript
// If #word5 doesn't exist:
$('#word5 .word-text').html(anchorHTML);
// → jQuery returns empty collection
// → .html() does nothing
// → No error thrown
// → Word 5 remains unchanged (or empty)
```

### Missing Card Keys

```javascript
// If cards["42"] doesn't exist:
selectedCard = cards[randomKey]; // undefined
selectedCard["word1"]; // TypeError: Cannot read property 'word1' of undefined
// → Uncaught exception
// → Function aborts
// → Remaining words not updated
```

## Console Output

### Normal Operation

```
[No output]
```

### Error Examples

```
ReferenceError: cards is not defined
    at selectRandomCard (script.js:3)
    at HTMLButtonElement.onclick (index.html:1)

ReferenceError: $ is not defined
    at selectRandomError (script.js:2)

TypeError: Cannot read properties of undefined (reading 'word1')
    at selectRandomCard (script.js:8)
```

## Error Handling Gaps

| Gap | Risk | Recommendation |
|-----|------|----------------|
| No `cards` validation | Corrupted data breaks app | Validate on load |
| No jQuery fallback | CDN failure breaks app | Local fallback or SRI |
| No user-facing errors | User sees broken UI, no guidance | Show friendly message |
| No error logging | No visibility into production errors | Add error reporting |
| No retry logic | Transient failures permanent | Retry with backoff |
| No graceful degradation | All-or-nothing | Show cached card if possible |

## Recommended Error Handling

### 1. Validate `cards` on Load

```javascript
// Top of script.js
(function validateCards() {
  if (typeof cards === 'undefined') {
    console.error('Cards catalogue not loaded');
    showError('Failed to load word cards. Please refresh.');
    return false;
  }
  const keys = Object.keys(cards);
  if (keys.length === 0) {
    console.error('Cards catalogue empty');
    showError('No cards available. Please refresh.');
    return false;
  }
  // Optional: validate structure
  for (const key of keys) {
    const card = cards[key];
    for (let i = 1; i <= 8; i++) {
      if (!card['word' + i]) {
        console.warn(`Card ${key} missing word${i}`);
      }
    }
  }
  return true;
})();
```

### 2. Wrap `selectRandomCard` in Try/Catch

```javascript
function selectRandomCard() {
  try {
    if (!window.cardsValidated) return;

    const keys = Object.keys(cards);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const selectedCard = cards[randomKey];

    if (!selectedCard) {
      throw new Error(`Card ${randomKey} not found`);
    }

    for (let i = 1; i <= 8; i++) {
      const wordKey = 'word' + i;
      const wordText = selectedCard[wordKey];

      if (!wordText) {
        console.warn(`Card ${randomKey} missing ${wordKey}`);
        continue;
      }

      // ... existing logic ...
    }
  } catch (error) {
    console.error('Failed to draw card:', error);
    showError('Could not draw card. Please try again.');
  }
}
```

### 3. User-Facing Error Display

```html
<!-- In index.html, inside .card or after -->
<div id="error-message" class="error-message" style="display: none;"></div>
```

```css
/* In style.css */
.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 1rem;
  font-size: 1.1em;
}
```

```javascript
function showError(message) {
  const errorEl = document.getElementById('error-message');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
  }
}
```

### 4. Global Error Handler

```javascript
window.addEventListener('error', function(event) {
  console.error('Global error:', event.error);
  // Could send to error tracking service
  // showError('Something went wrong. Please refresh.');
});

window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
});
```

### 5. Resource Loading Fallbacks

```html
<!-- jQuery with local fallback -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
<script>
  window.jQuery || document.write('<script src="js/jquery-3.6.3.min.js"><\/script>')
</script>

<!-- Font Awesome with local fallback -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      onerror="this.href='css/fontawesome-6.5.1.min.css'">
```

## Error Taxonomy

| Category | Examples | Severity | Handling |
|----------|----------|----------|----------|
| **Initialisation** | `cards` missing, jQuery missing | Critical | Fail fast, show error |
| **Runtime** | Random card undefined, DOM missing | High | Try/catch, skip word |
| **Network** | CDN timeout, NuciSearch down | Medium | Graceful degradation |
| **Data** | Empty word, malformed word | Low | Skip, log warning |
| **User** | Rapid clicks, browser quirks | Low | Idempotent, no-op |

## Testing Error Scenarios

### Manual Test Cases

| Test | Method | Expected |
|------|--------|----------|
| Block `cards.js` | DevTools Network → Block URL | Error message shown |
| Block jQuery CDN | DevTools Network → Block URL | Error message shown |
| Corrupt `cards.js` | Edit file, invalid JS | Error message shown |
| Empty `cards` | `cards = {}` in console | Error message shown |
| Missing `#word3` | Delete div in DevTools | Other words update, no crash |
| NuciSearch offline | Disconnect network, click link | Browser error page (expected) |

### Automated Test (If Added)

```javascript
// tests/error-handling.test.js
describe('Error handling', () => {
  it('shows error when cards undefined', () => {
    delete window.cards;
    selectRandomCard();
    expect(document.getElementById('error-message').style.display).toBe('block');
  });

  it('handles missing word gracefully', () => {
    window.cards = { "1": { word1: "test", word2: undefined, ... } };
    selectRandomCard();
    // word2 slot should not crash
  });

  it('does not throw on rapid clicks', () => {
    for (let i = 0; i < 100; i++) {
      selectRandomCard();
    }
    // No uncaught exceptions
  });
});
```

## Monitoring (Not Implemented)

### Recommended: Error Tracking

| Service | Free Tier | Integration |
|---------|-----------|-------------|
| Sentry | 5k errors/month | `<script src="...sentry.js">` |
| LogRocket | 1k sessions/month | npm package |
| Rollbar | 5k errors/month | `<script>` |
| Custom | Unlimited | `fetch('/api/errors', ...)` |

### Minimal Custom Logging

```javascript
function logError(error, context = {}) {
  const payload = {
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    context
  };

  // Store locally (dev only)
  console.error(payload);

  // Send to endpoint (prod)
  // navigator.sendBeacon('/api/errors', JSON.stringify(payload));
}
```

## Summary

| Aspect | Current | Target |
|--------|---------|--------|
| Initialisation validation | ❌ | ✅ |
| Runtime try/catch | ❌ | ✅ |
| User-facing errors | ❌ | ✅ |
| Global error handler | ❌ | ✅ |
| Resource fallbacks | ❌ | ✅ |
| Error logging | ❌ | ✅ (optional) |
| Graceful degradation | ❌ | ✅ |

**Priority**: Add validation + try/catch + user-facing error (30 min). Add fallbacks + logging (optional, 1 hr).