# Integrations

## Overview

This document describes all external integrations for the Alias Cards application.

## Integration Inventory

| Integration | Type | Direction | Criticality | Status |
|-------------|------|-----------|-------------|--------|
| NuciSearch | Search service | Outbound (navigation) | High | Active |
| GitHub | Code hosting | Outbound (link) | Low | Active |
| Ko-fi | Donations | Outbound (link) | Low | Active |
| cdnjs (jQuery) | CDN | Inbound (script) | High | Active |
| cdnjs (jQuery Easing) | CDN | Inbound (script) | None (unused) | Active |
| cdnjs (Font Awesome) | CDN | Inbound (CSS/fonts) | Medium | Active |
| GitHub Pages | Hosting | Inbound (serving) | High | Active |

---

## NuciSearch Integration

### Purpose

Provide Romanian dictionary definitions for words/phrases on cards.

### Integration Pattern

**Anchor Navigation** — Not API integration. Application generates URLs, user clicks, browser navigates.

### Technical Details

| Aspect | Detail |
|--------|--------|
| **Base URL** | `https://search.nucilandia.ro` |
| **Query Parameter** | `q` (URL-encoded) |
| **Protocol** | HTTPS only |
| **Method** | GET (via link click) |
| **Target** | `_blank` (new tab) |
| **Rel** | `noopener noreferrer` |
| **Authentication** | None |
| **Rate Limits** | Unknown (public service) |
| **SLA** | None |
| **CORS** | N/A (navigation) |

### Query Construction

```javascript
// In selectRandomCard()
const parts = wordText.trim().split(/\s+/);
const useShortQuery = parts.length === 1 ||
  (parts.length === 2 && parts[0].toLowerCase() === 'a');

const query = useShortQuery
  ? wordText + ' DEX'
  : 'Definiție: ' + wordText;

const url = 'https://search.nucilandia.ro?q=' + encodeURIComponent(query);
```

### Query Formats

| Word Type | Example | Query Sent | URL Fragment |
|-----------|---------|------------|--------------|
| Noun | `kilometru` | `kilometru DEX` | `q=kilometru%20DEX` |
| Infinitive | `a urca` | `a urca DEX` | `q=a%20urca%20DEX` |
| Reflexive | `a se mira` | `Definiție: a se mira` | `q=Defini%C8%9Bie%3A%20a%20se%20mira` |
| Phrase | `polul Nord` | `Definiție: polul Nord` | `q=Defini%C8%9Bie%3A%20polul%20Nord` |

### Error Handling

| Scenario | Behaviour |
|----------|-----------|
| NuciSearch down | Browser shows error page in new tab |
| Network offline | Browser shows offline page |
| Invalid query | NuciSearch handles (shows no results) |
| Special characters | `encodeURIComponent` handles |

### Monitoring

- No application-level monitoring
- User reports only
- No fallback search engine

### Contract

**Implicit** — No formal API contract. Relies on:
- NuciSearch accepting `q` parameter
- NuciSearch returning HTML page
- URL structure stability

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| NuciSearch shuts down | Low | High (core feature broken) | Find alternative |
| URL structure changes | Low | Medium | Monitor, update |
| Rate limiting | Unknown | Medium | Cache? Not applicable |
| CORS policy change | N/A | N/A | Navigation, not fetch |

---

## GitHub Integration

### Purpose

Link to source code repository.

### Technical Details

| Aspect | Detail |
|--------|--------|
| **URL** | `https://github.com/hmlendea/alias-cards-rou` |
| **Protocol** | HTTPS |
| **Method** | GET (link click) |
| **Target** | `_blank` |
| **Rel** | `noopener noreferrer` |
| **Icon** | Font Awesome `fa-github` |

### Contract

Stable — GitHub URLs don't change.

---

## Ko-fi Integration

### Purpose

Accept donations.

### Technical Details

| Aspect | Detail |
|--------|--------|
| **URL** | `https://ko-fi.com/hmlendea` |
| **Protocol** | HTTPS |
| **Method** | GET (link click) |
| **Target** | `_blank` |
| **Rel** | `noopener noreferrer` |
| **Icon** | Font Awesome `fa-heart` |

### Contract

Stable — Ko-fi profile URLs don't change.

---

## CDN Integrations

### cdnjs.cloudflare.com

#### jQuery 3.6.3

| Aspect | Detail |
|--------|--------|
| **URL** | `https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js` |
| **Purpose** | DOM manipulation, escaping |
| **Criticality** | High — app broken without it |
| **SRI** | Not implemented (should add) |
| **Fallback** | None (should add local) |
| **Version Pinning** | Yes (exact version in URL) |

#### jQuery Easing 1.12.1

| Aspect | Detail |
|--------|--------|
| **URL** | `https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.12.1/jquery.easing.min.js` |
| **Purpose** | Extended easing functions |
| **Criticality** | None — **unused** |
| **Action** | **Remove** |

#### Font Awesome 6.5.1

| Aspect | Detail |
|--------|--------|
| **URL** | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css` |
| **Purpose** | Icons (⟳, GitHub, heart) |
| **Criticality** | Medium — icons missing without it |
| **SRI** | Not implemented (should add) |
| **Fallback** | None |
| **Font Files** | Lazy-loaded from same CDN |

### CDN Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CDN outage | Low | High (jQuery) / Medium (FA) | SRI + local fallback |
| CDN compromise | Very Low | Critical | SRI, CSP |
| Version removal | Low | Medium | Pin exact versions (done) |
| Geographic latency | Medium | Low | cdnjs is global |

---

## GitHub Pages Integration

### Purpose

Static site hosting.

### Technical Details

| Aspect | Detail |
|--------|--------|
| **Provider** | GitHub Pages |
| **Source** | `main` branch, `/` (root) |
| **URL** | `https://hmlendea.github.io/alias-cards-rou/` |
| **HTTPS** | Enforced |
| **Custom Domain** | None |
| **Build** | None (static) |
| **Headers** | Limited (no custom headers) |
| **Cache-Control** | `max-age=600` (10 min) default |

### Limitations

- No custom response headers (CSP, Referrer-Policy, etc.)
- No server-side logic
- No environment variables
- Single branch deployment

---

## Integration Health Checks

### Manual Verification

```bash
# Check all external URLs return 200
curl -I https://search.nucilandia.ro
curl -I https://github.com/hmlendea/alias-cards-rou
curl -I https://ko-fi.com/hmlendea
curl -I https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
curl -I https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css
```

### Automated (Recommended)

```yaml
# .github/workflows/integration-check.yml
name: Integration Health Check
on:
  schedule:
    - cron: '0 6 * * *'  # Daily 6 AM
  workflow_dispatch:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check NuciSearch
        run: curl -sf https://search.nucilandia.ro > /dev/null
      - name: Check GitHub
        run: curl -sf https://github.com/hmlendea/alias-cards-rou > /dev/null
      - name: Check Ko-fi
        run: curl -sf https://ko-fi.com/hmlendea > /dev/null
      - name: Check jQuery CDN
        run: curl -sf https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js > /dev/null
      - name: Check Font Awesome CDN
        run: curl -sf https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css > /dev/null
```

---

## Future Integration Considerations

### Potential Additions

| Integration | Purpose | Effort | Priority |
|-------------|---------|--------|----------|
| Alternative dictionary | Fallback for NuciSearch | Medium | Low |
| Analytics (Plausible) | Usage statistics | Low | Low |
| Error tracking (Sentry) | Production error visibility | Low | Medium |
| Web Share API | Native share on mobile | Low | Low |
| PWA / Service Worker | Offline support | Medium | Low |
| Custom domain | Branding | Low | Low |

### Integration Principles

1. **Prefer navigation over API** — No CORS, no keys, simpler
2. **Minimize dependencies** — Each integration is a risk
3. **Pin versions** — Exact URLs for CDN resources
4. **Plan for failure** — Graceful degradation
5. **Respect privacy** — No tracking, no personal data