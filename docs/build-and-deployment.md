# Build and Deployment

## Overview

The Alias Cards application is a **static site** with **no build step**. Deployment is via **GitHub Pages** from the repository root.

## Build Process

### Current: No Build

```
Source files (root)          GitHub Pages
├── index.html        ──────►  https://hmlendea.github.io/alias-cards-rou/
├── style.css         ──────►  (served as-is)
├── script.js         ──────►
├── cards.js          ──────►
├── README.md         ──────►  (not served as page)
├── LICENSE           ──────►
├── SECURITY.md       ──────►
├── ARCHITECTURE.md   ──────►
├── PRIVACY.md        ──────►
├── CODE_OF_CONDUCT.md─────►
├── CONTRIBUTING.md   ──────►
└── ROADMAP.md        ──────►  (missing)
```

**No**: bundling, minification, transpilation, linting, testing, type-checking, optimization.

### Why No Build?

1. **Vanilla JS/CSS/HTML** — Runs natively in all modern browsers
2. **No dependencies to bundle** — All external via CDN
3. **Single-page, single-user** — No code splitting needed
4. **Zero configuration** — Simplicity over tooling
5. **GitHub Pages native** — Serves static files directly

## Deployment

### Platform: GitHub Pages

| Property | Value |
|----------|-------|
| **Source** | `main` branch, `/` (root) |
| **URL** | `https://hmlendea.github.io/alias-cards-rou/` |
| **HTTPS** | Enforced (GitHub Pages default) |
| **Custom domain** | None |
| **Build command** | None (static) |
| **Output directory** | `/` (repository root) |

### Deployment Trigger

```
git push origin main
       │
       ▼
GitHub Pages detects change
       │
       ▼
Rebuilds site (1–2 minutes)
       │
       ▼
Live at URL
```

### Branch Strategy

- **Single branch**: `main` only
- **No staging/preview** — Direct to production
- **No feature branches** — Commits directly to main (small project)

### Rollback

```bash
# Option 1: Revert commit
git revert <commit-hash>
git push origin main

# Option 2: Reset branch (force push - requires permission)
git reset --hard <good-commit>
git push --force origin main

# Option 3: GitHub Pages UI → "Deploy from branch" → select older commit
```

## Local Development

### Prerequisites

- Any static file server (or just open `index.html` directly)
- Modern browser (Chrome, Firefox, Safari, Edge)

### Run Locally

```bash
# Option 1: Python (if available)
python3 -m http.server 8000
# → http://localhost:8000

# Option 2: Node.js (if available)
npx serve .
# → http://localhost:3000

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# Option 4: Direct file open (limited)
# file:///path/to/index.html
# ⚠ Some features may not work (CORS, modules)
```

### Development Workflow

1. Edit files in place
2. Refresh browser (F5)
3. No hot reload, no watch mode
4. Test in multiple browsers if needed

## Production Considerations

### Performance Optimisations (Not Applied)

| Optimisation | Effort | Impact | Status |
|--------------|--------|--------|--------|
| Minify CSS/JS | Low | ~30% size reduction | Not done |
| Add SRI hashes | Low | Security | Not done |
| Self-host CDN deps | Medium | Reliability, privacy | Not done |
| Service worker | Medium | Offline, cache | Not done |
| Compress cards.js | Low | ~60% size reduction | Not done |
| Add CSP header | Low | Security | Not done |
| Preconnect CDN | Low | Faster DNS/TCP | Not done |

### GitHub Pages Limits

| Limit | Value | Impact |
|-------|-------|--------|
| Repository size | 1 GB | Well under (<< 1 MB) |
| File size | 100 MB | Well under (cards.js ~80 KB) |
| Bandwidth | 100 GB/month | Ample for static site |
| Build time | 10 min | N/A (no build) |
| Custom domains | 1 | Not used |

### Cache Behaviour

| Resource | Cache-Control | Notes |
|----------|---------------|-------|
| `index.html` | `max-age=600` (10 min) | GitHub Pages default |
| `style.css` | `max-age=600` | |
| `script.js` | `max-age=600` | |
| `cards.js` | `max-age=600` | Largest, benefits most from longer cache |
| CDN resources | Varies by CDN | cdnjs: 1 year + immutable |

**Cache busting**: Not implemented. Users may see stale `cards.js` for up to 10 min after deploy.

### Recommended Cache Improvement

```html
<!-- Add to index.html for longer caching of static assets -->
<!-- Not possible on GitHub Pages without custom headers -->
<!-- Workaround: rename files on change (cards.v2.js) -->
```

## CI/CD (Not Configured)

### Current: None

- No GitHub Actions workflow
- No automated tests
- No linting
- No validation
- No preview deployments

### Recommended: Minimal Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate HTML
        run: npx htmlhint index.html || true
      - name: Validate CSS
        run: npx stylelint style.css || true
      - name: Validate JS
        run: npx eslint script.js cards.js || true
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
        with:
          path: .
```

## Environment Parity

| Aspect | Local | Production |
|--------|-------|------------|
| Protocol | `http://` or `file://` | `https://` |
| Host | `localhost` | `hmlendea.github.io` |
| Path | `/` or `/index.html` | `/alias-cards-rou/` |
| CDN access | Direct | Direct |
| NuciSearch access | Direct | Direct |
| Mixed content | Possible (http local) | Blocked (https only) |

**Note**: `file://` protocol blocks CDN loads (CORS). Use local server.

## Monitoring

### Current: None

- No uptime monitoring
- No error tracking
- No analytics
- No performance monitoring

### Recommended (Free Tier)

| Tool | Purpose | Cost |
|------|---------|------|
| UptimeRobot | Uptime alerts | Free (50 monitors) |
| Google Analytics / Plausible | Usage stats | Free / Paid |
| WebPageTest | Performance | Free |
| Lighthouse CI | Regression detection | Free (GitHub Actions) |

## Disaster Recovery

### Scenarios

| Scenario | Recovery Time | Data Loss |
|----------|---------------|-----------|
| GitHub Pages down | Minutes–hours (GitHub) | None |
| Repository deleted | Restore from local clone | None (if cloned) |
| `cards.js` corrupted | Git revert + deploy | None |
| CDN compromised | Self-host / SRI | None |
| NuciSearch down | Wait / find alternative | Word links broken |

### Backup Strategy

- **Primary**: Git history (every commit)
- **Secondary**: Local clones on developer machines
- **Tertiary**: GitHub archive (if enabled)

## Checklist for Deploy

- [ ] Test locally with `python3 -m http.server`
- [ ] Verify all 8 words display correctly
- [ ] Verify ⟳ button draws new card
- [ ] Verify word links open NuciSearch in new tab
- [ ] Verify GitHub/Donate links work
- [ ] Check console for errors
- [ ] Test mobile viewport (DevTools device toolbar)
- [ ] Commit and push to `main`
- [ ] Verify live at `https://hmlendea.github.io/alias-cards-rou/`