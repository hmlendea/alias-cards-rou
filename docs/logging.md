# Logging

## Overview

The Alias Cards application has **no structured logging**. It uses only `console.error`/`console.warn` for developer-visible errors. This document describes current logging, gaps, and recommendations.

## Current Logging

### Console Output

| Level | Source | Example |
|-------|--------|---------|
| `error` | Uncaught exceptions | `ReferenceError: cards is not defined` |
| `error` | Failed resource loads | `Failed to load resource: net::ERR_CONNECTION_REFUSED` |
| `warn` | Deprecated APIs | `[Violation] Added non-passive event listener` |
| `log` | None (application doesn't log) | — |

### Application-Generated Logs

**None** — The application code contains no `console.log`, `console.warn`, `console.error`, or `console.info` calls.

### Browser-Generated Logs

| Event | Log Level | Example |
|-------|-----------|---------|
| Script parse error | `error` | `SyntaxError: expected expression, got '}'` |
| Resource 404 | `error` | `GET https://cdn.example.com/jquery.min.js 404` |
| CSP violation | `error` | `[Report Only] Refused to load script...` |
| Mixed content | `error` | `Mixed Content: The page was loaded over HTTPS...` |
| Passive listener violation | `warn` | `[Violation] Added non-passive event listener...` |

## Logging Gaps

| Gap | Impact | Recommendation |
|-----|--------|----------------|
| No application logs | Cannot debug production issues | Add structured logging |
| No error context | Stack traces lack user/action context | Add context to errors |
| No performance logs | Cannot measure draw latency | Add timing logs |
| No user action logs | Cannot audit usage | Add event logging |
| No remote logging | Errors only visible in user's DevTools | Add error reporting |

## Recommended Logging

### 1. Structured Console Logging (Development)

```javascript
// script.js - add at top
const LOG_LEVEL = 'debug'; // 'debug' | 'info' | 'warn' | 'error' | 'none'

function log(level, message, context = {}) {
  if (LOG_LEVEL === 'none') return;
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };
  if (levels[level] < levels[LOG_LEVEL]) return;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    url: window.location.href,
    userAgent: navigator.userAgent
  };

  console[level](JSON.stringify(entry));
}

// Usage in selectRandomCard:
function selectRandomCard() {
  log('debug', 'Drawing new card', { action: 'draw' });

  try {
    const keys = Object.keys(cards);
    log('debug', 'Card keys retrieved', { count: keys.length });

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    log('info', 'Card selected', { cardId: randomKey });

    const selectedCard = cards[randomKey];
    // ... rest of logic ...

    log('info', 'Card rendered', { wordsUpdated: 8 });
  } catch (error) {
    log('error', 'Failed to draw card', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
```

### 2. Production Error Reporting

```javascript
// Minimal error reporting (no external dependency)
function reportError(error, context = {}) {
  const payload = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    context
  };

  // Store in sessionStorage for debugging
  try {
    const errors = JSON.parse(sessionStorage.getItem('app_errors') || '[]');
    errors.push(payload);
    if (errors.length > 50) errors.shift();
    sessionStorage.setItem('app_errors', JSON.stringify(errors));
  } catch (e) {
    // Ignore storage errors
  }

  // Send to endpoint (if configured)
  if (window.ERROR_REPORT_ENDPOINT) {
    navigator.sendBeacon(window.ERROR_REPORT_ENDPOINT, JSON.stringify(payload));
  }
}

window.addEventListener('error', (event) => {
  reportError(event.error, { type: 'uncaught', filename: event.filename, lineno: event.lineno });
});

window.addEventListener('unhandledrejection', (event) => {
  reportError(new Error(event.reason), { type: 'unhandledrejection' });
});
```

### 3. Performance Logging

```javascript
function selectRandomCard() {
  const start = performance.now();
  log('debug', 'Draw started');

  // ... existing logic ...

  const duration = performance.now() - start;
  log('info', 'Draw completed', { durationMs: duration.toFixed(2) });

  // Report to Performance API
  performance.mark('card-draw-end');
  performance.measure('card-draw', 'card-draw-start', 'card-draw-end');
}
```

## Log Format

### Structured JSON (Recommended)

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "info",
  "message": "Card rendered",
  "context": {
    "cardId": "42",
    "wordsUpdated": 8,
    "durationMs": "3.45"
  },
  "url": "https://hmlendea.github.io/alias-cards-rou/",
  "userAgent": "Mozilla/5.0..."
}
```

### Human-Readable (Development)

```
[INFO] 2024-01-15T10:30:45.123Z Card rendered { cardId: "42", wordsUpdated: 8, durationMs: "3.45" }
[ERROR] 2024-01-15T10:30:46.789Z Failed to draw card { error: "cards is not defined", stack: "..." }
```

## Log Levels

| Level | Use Case | Production |
|-------|----------|------------|
| `debug` | Detailed flow, variable values | ❌ Off |
| `info` | Key milestones (draw, render) | ✅ On |
| `warn` | Recoverable issues (missing word) | ✅ On |
| `error` | Failures (exceptions, network) | ✅ On |

## What to Log

### Always Log (Errors)

- Uncaught exceptions with stack traces
- Resource load failures
- Validation failures (`cards` missing, empty)
- DOM manipulation errors

### Log in Development (Info/Debug)

- Card draw initiation
- Random card ID selected
- Query format decision (short/long)
- DOM update count
- Draw duration

### Never Log

- User identifiers (none exist)
- Secrets (none exist)
- Full card catalogue (too large)
- NuciSearch URLs (contains words, but public)

## Log Retention

| Storage | Retention | Capacity |
|---------|-----------|----------|
| Console | Session only | Unlimited (browser limit) |
| sessionStorage | Session only | ~5 MB |
| Remote endpoint | Per service policy | Configurable |

## Privacy Considerations

- **No PII in logs** — Application has no user identity
- **Words are public vocabulary** — Logging words is acceptable
- **URLs may contain words** — NuciSearch URLs in logs = public words
- **User agent** — Standard, not PII
- **IP address** — Not logged by client (server logs only)

## Integration with External Services

### Sentry (Example)

```html
<!-- In index.html <head> -->
<script src="https://browser.sentry-cdn.com/7.100.0/bundle.min.js"
        integrity="sha384-..."
        crossorigin="anonymous"></script>
<script>
  Sentry.init({
    dsn: 'https://xxx@sentry.io/xxx',
    environment: 'production',
    beforeSend(event) {
      // Scrub any sensitive data (none expected)
      return event;
    }
  });
</script>
```

### Custom Endpoint

```javascript
// Configure in index.html before script.js
window.ERROR_REPORT_ENDPOINT = 'https://api.example.com/errors';
```

## Testing Logging

### Verify Logs Appear

```javascript
// In console
log('info', 'Test message', { test: true });
// Should output structured JSON
```

### Verify Error Reporting

```javascript
// In console
throw new Error('Test error');
// Should appear in sessionStorage.app_errors
```

### Verify No Sensitive Data

```javascript
// Check sessionStorage
JSON.parse(sessionStorage.getItem('app_errors') || '[]')
// Verify no tokens, passwords, PII
```

## Summary

| Aspect | Current | Target |
|--------|---------|--------|
| Application logs | ❌ None | ✅ Structured JSON |
| Error context | ❌ Minimal | ✅ Rich context |
| Performance logs | ❌ None | ✅ Timing |
| Remote reporting | ❌ None | ✅ Optional endpoint |
| Privacy-safe | ✅ (no data) | ✅ Maintained |
| Log levels | ❌ None | ✅ Configurable |

**Effort**: ~30 min for basic structured logging + error reporting. ~1 hr for full integration.