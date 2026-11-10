# Security

## Overview

This document complements the root `SECURITY.md` and describes the security posture of the Alias Cards application.

## Threat Model

### Assets

| Asset | Sensitivity | Location |
|-------|-------------|----------|
| User session | Low (no auth) | Browser memory |
| Card catalogue | Public | `cards.js` (served publicly) |
| Application code | Public | All source files |
| NuciSearch queries | Low (public words) | HTTPS to external service |
| Referrer information | Medium | Controlled via `rel="noreferrer"` |

### Actors

| Actor | Trust Level | Capabilities |
|-------|-------------|--------------|
| End user | Untrusted | Browser interaction, DevTools |
| Attacker (network) | Untrusted | MITM, DNS spoofing, CDN compromise |
| Attacker (supply chain) | Untrusted | Compromised CDN, GitHub Pages |
| NuciSearch | Semi-trusted | Receives queries, returns results |

### Attack Surface

| Surface | Exposure | Mitigation |
|---------|----------|------------|
| CDN resources (jQuery, FA) | High | HTTPS, pin versions (SRI recommended) |
| NuciSearch navigation | Medium | `target="_blank"`, `rel="noopener noreferrer"` |
| GitHub Pages hosting | Low | HTTPS enforced, no server-side code |
| Client-side JS | Medium | No `eval`, no user input, CSP recommended |
| `cards.js` content | Low | Static, reviewed in PR |

## Security Controls

### Implemented

| Control | Status | Details |
|---------|--------|---------|
| HTTPS everywhere | ✅ | GitHub Pages + CDN + NuciSearch all HTTPS |
| No user input | ✅ | Zero input fields, zero forms |
| No authentication | ✅ | No auth = no credential theft |
| No server-side code | ✅ | Static only = no injection surface |
| HTML escaping | ✅ | jQuery `$('<span>').text().html()` |
| Link hardening | ✅ | `target="_blank" rel="noopener noreferrer"` |
| No sensitive data | ✅ | No PII, no tokens, no secrets |
| Content Security Policy | ❌ | Not implemented (recommended) |
| Subresource Integrity | ❌ | Not implemented (recommended) |
| Referrer Policy | ❌ | Not set (recommended) |
| Permissions Policy | ❌ | Not set (recommended) |

### HTML Escaping Analysis

```javascript
// In script.js - SAFE
escapedText = $('<span>').text(wordText).html();
// 1. Creates detached <span>
// 2. Sets textContent (auto-escapes)
// 3. Reads innerHTML (escaped string)
// Result: <script> → <script>, " → ", & → &
```

**Verdict**: XSS via `cards.js` content is prevented.

### Link Hardening Analysis

```html
<!-- Generated in script.js - SAFE -->
<a href="https://search.nucilandia.ro?q=..."
   target="_blank"
   rel="noopener noreferrer">
  word
</a>
```

| Attribute | Protection |
|-----------|------------|
| `target="_blank"` | Opens in new tab |
| `rel="noopener"` | Prevents `window.opener` access |
| `rel="noreferrer"` | Strips `Referer` header |

**Verdict**: No tab-nabbing, no referrer leakage.

## Vulnerability Assessment

### Current Vulnerabilities

| ID | Severity | Component | Description | Mitigation |
|----|----------|-----------|-------------|------------|
| VULN-01 | Medium | CDN | No SRI — compromised CDN serves malicious code | Add SRI hashes |
| VULN-02 | Medium | CSP | No CSP — inline scripts/styles allowed | Add CSP header |
| VULN-03 | Low | Referrer | No Referrer-Policy — full referrer sent to NuciSearch | Add `Referrer-Policy: no-referrer` |
| VULN-04 | Low | Permissions | No Permissions-Policy — all browser features allowed | Add restrictive policy |
| VULN-05 | Info | jQuery Easing | Unused dependency — unnecessary attack surface | Remove from index.html |

### Exploit Scenarios

#### Scenario 1: CDN Compromise (jQuery)

**Attack**: Attacker compromises cdnjs.cloudflare.com, injects malicious code into `jquery.min.js`.

**Impact**: Full control of application — keylogging, data exfiltration, redirect.

**Likelihood**: Low (cdnjs is reputable, but supply chain attacks happen).

**Mitigation**: Add SRI hash — browser rejects modified file.

#### Scenario 2: CDN Compromise (Font Awesome)

**Attack**: Malicious CSS/font files.

**Impact**: Visual defacement, potential CSS exfiltration (limited).

**Mitigation**: Add SRI hash, or self-host CSS.

#### Scenario 3: NuciSearch Compromise

**Attack**: NuciSearch serves malicious page.

**Impact**: User sees malicious content in new tab. No access to app tab (`noopener`).

**Mitigation**: `noopener` prevents tab-nabbing. User education.

#### Scenario 4: GitHub Pages Compromise

**Attack**: Attacker gains write access to repository.

**Impact**: Modified `cards.js`, `script.js`, `index.html` served to all users.

**Mitigation**: Branch protection, 2FA, code review, signed commits.

## Security Headers (Recommended)

### Content Security Policy

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdnjs.cloudflare.com;
  style-src 'self' https://cdnjs.cloudflare.com;
  font-src https://cdnjs.cloudflare.com;
  img-src 'self' data:;
  connect-src 'none';
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'none';
  frame-ancestors 'none';
  upgrade-insecure-requests;
```

**Note**: GitHub Pages doesn't support custom headers. Use `<meta http-equiv>` in HTML (limited).

```html
<!-- In index.html <head> -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://cdnjs.cloudflare.com;
  style-src 'self' https://cdnjs.cloudflare.com;
  font-src https://cdnjs.cloudflare.com;
  img-src 'self' data:;
  connect-src 'none';
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'none';
  frame-ancestors 'none';
  upgrade-insecure-requests;
">
```

### Referrer Policy

```html
<meta name="referrer" content="no-referrer">
<!-- Or HTTP header: Referrer-Policy: no-referrer -->
```

### Permissions Policy

```http
Permissions-Policy:
  accelerometer=(),
  camera=(),
  geolocation=(),
  gyroscope=(),
  magnetometer=(),
  microphone=(),
  payment=(),
  usb=(),
  interest-cohort=()
```

### Other Headers

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

## Dependency Security

### Current Dependencies

| Dependency | Version | Known CVEs | Action |
|------------|---------|------------|--------|
| jQuery | 3.6.3 | Check advisories | Monitor, update to 3.7.x |
| jQuery Easing | 1.12.1 | Unmaintained | Remove (unused) |
| Font Awesome | 6.5.1 | Check advisories | Monitor, update to 6.6.x |

### Supply Chain Recommendations

1. **Add SRI hashes** to all CDN resources
2. **Remove unused** jQuery Easing
3. **Self-host critical** dependencies (jQuery, Font Awesome CSS)
4. **Enable Dependabot** for automated updates
5. **Pin exact versions** (already done via URL)

## Data Protection

### Personal Data

| Data Type | Collected? | Stored? | Transmitted? |
|-----------|------------|---------|--------------|
| IP address | No (GitHub Pages logs) | No | No |
| User agent | No | No | No |
| Cookies | No | No | No |
| LocalStorage | No | No | No |
| SessionStorage | No | No | No |
| Query parameters | No | No | Yes (to NuciSearch) |
| Referrer | No (blocked) | No | No |

**GDPR/Privacy**: No personal data processed by application. NuciSearch receives only word queries (public vocabulary).

### Secrets Management

- **No secrets in code** — Verified: no API keys, tokens, passwords
- **No environment variables** — Static site
- **No build-time secrets** — No build

## Incident Response

### Detection

| Signal | Method |
|--------|--------|
| User reports | Manual |
| GitHub security alerts | Automated (Dependabot) |
| CDN status pages | Manual |
| NuciSearch status | Manual |

### Response Procedures

| Incident | Steps |
|----------|-------|
| CDN compromised | 1. Add SRI / switch to self-hosted 2. Deploy 3. Monitor |
| Repository compromised | 1. Revoke access 2. Revert to clean commit 3. Rotate credentials 4. Audit |
| NuciSearch malicious | 1. Remove links 2. Find alternative 3. Deploy |
| XSS discovered | 1. Fix escaping 2. Deploy 3. Verify |

### Recovery Time Objectives

| Incident | RTO | RPO |
|----------|-----|-----|
| CDN issue | < 1 hour | 0 (code) |
| Repo compromise | < 4 hours | 0 (Git history) |
| NuciSearch issue | < 1 day | 0 (code) |

## Compliance

| Standard | Applicable? | Status |
|----------|-------------|--------|
| GDPR | Yes (EU users) | Compliant (no personal data) |
| CCPA | Yes (CA users) | Compliant (no personal data) |
| SOC 2 | No | N/A |
| ISO 27001 | No | N/A |
| PCI DSS | No | N/A |
| HIPAA | No | N/A |

## Security Checklist

### Pre-Deploy

- [ ] No console.log with sensitive data
- [ ] No hardcoded secrets
- [ ] All external resources HTTPS
- [ ] SRI hashes added (TODO)
- [ ] CSP meta tag added (TODO)
- [ ] Referrer-Policy meta tag added (TODO)
- [ ] Unused dependencies removed (jQuery Easing - TODO)
- [ ] Dependabot alerts resolved

### Post-Deploy

- [ ] Verify HTTPS on live site
- [ ] Verify CSP not blocking resources
- [ ] Verify word links open correctly
- [ ] Check DevTools Security panel
- [ ] Run Lighthouse security audit

### Ongoing

- [ ] Monthly dependency review
- [ ] Quarterly penetration test (manual)
- [ ] Annual threat model review
- [ ] Monitor GitHub security advisories

## Related Documents

- Root `SECURITY.md` — Vulnerability reporting, disclosure policy
- `docs/dependencies.md` — Dependency details
- `docs/build-and-deployment.md` — Deployment security
- `PRIVACY.md` — Data handling