# Configuration

## Overview

The Alias Cards application has **no configuration system**. All behaviour is hardcoded in source files. This document describes what *would* be configurable if a configuration system existed, and documents the current hardcoded values.

## Current Hardcoded Values

### Application Behaviour

| Behaviour | Hardcoded Value | Location |
|-----------|-----------------|----------|
| Card count | 200 | `cards.js` (implicit) |
| Words per card | 8 | `script.js` (loop 1–8), `index.html` (8 divs) |
| Random distribution | Uniform | `script.js` (`Math.random()`) |
| Query format threshold | 1 word OR 2 words starting with "a" | `script.js` (parts.length logic) |
| Short query suffix | `" DEX"` | `script.js` |
| Long query prefix | `"Definiție: "` | `script.js` |
| Search engine | NuciSearch | `script.js` (URL template) |
| Search engine URL | `https://search.nucilandia.ro` | `script.js` |
| Link target | `_blank` | `script.js` (anchor template) |
| Link rel | `noopener noreferrer` | `script.js` (anchor template) |

### Visual Configuration

| Property | Hardcoded Value | Location |
|----------|-----------------|----------|
| Card height | `85%` | `style.css` (`.card`) |
| Card aspect ratio | `1 / 1.4` | `style.css` (`.card`) |
| Card max width | `600px` | `style.css` (`.card`) |
| Word font size | `2.2em` | `style.css` (`.word`) |
| Word number size | `1.5em` | `style.css` (`.word-number`) |
| Word number color | `#8e44ad` | `style.css` (`.word-number`) |
| Button position | Fixed bottom-right, `20px` | `style.css` (`.control-button`) |
| GitHub link position | Fixed bottom-left, `20px` | `style.css` (`.github-link`) |
| Donate link position | Fixed bottom-left, `70px` | `style.css` (`.donate-link`) |
| Link color | `#2c3e50` | `style.css` (`a`) |
| Link hover color | `#8e44ad` | `style.css` (`a:hover`) |
| Background | `#f5f6fa` | `style.css` (`body`) |
| Card background | `white` | `style.css` (`.card`) |
| Card shadow | `0 4px 15px rgba(0,0,0,0.1)` | `style.css` (`.card`) |
| Border radius | `15px` | `style.css` (`.card`) |

### External Dependencies (CDN URLs)

| Dependency | Version | URL | Location |
|------------|---------|-----|----------|
| jQuery | 3.6.3 | `https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js` | `index.html` |
| jQuery Easing | 1.12.1 | `https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.12.1/jquery.easing.min.js` | `index.html` |
| Font Awesome | 6.5.1 | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css` | `index.html` |

### External Links

| Link | URL | Location |
|------|-----|----------|
| GitHub repository | `https://github.com/hmlendea/alias-cards-rou` | `index.html` |
| Donate (Ko-fi) | `https://ko-fi.com/hmlendea` | `index.html` |

## Configuration File (Not Present)

### If Configuration Existed: `config.json`

```json
{
  "version": "1.0",
  "cards": {
    "cataloguePath": "cards.js",
    "expectedCount": 200,
    "wordsPerCard": 8
  },
  "draw": {
    "distribution": "uniform",
    "seed": null
  },
  "query": {
    "shortFormatSuffix": " DEX",
    "longFormatPrefix": "Definiție: ",
    "infinitivePrefixes": ["a"],
    "reflexivePrefixes": ["a se"]
  },
  "search": {
    "engine": "nucilandia",
    "baseUrl": "https://search.nucilandia.ro",
    "queryParam": "q",
    "linkTarget": "_blank",
    "linkRel": "noopener noreferrer"
  },
  "ui": {
    "card": {
      "heightPercent": 85,
      "aspectRatio": [1, 1.4],
      "maxWidthPx": 600,
      "borderRadiusPx": 15,
      "shadow": "0 4px 15px rgba(0,0,0,0.1)"
    },
    "word": {
      "fontSizeEm": 2.2,
      "numberFontSizeEm": 1.5,
      "numberColor": "#8e44ad"
    },
    "button": {
      "position": "fixed",
      "bottomPx": 20,
      "rightPx": 20,
      "icon": "fa-redo",
      "title": "Next card"
    },
    "links": {
      "github": {
        "url": "https://github.com/hmlendea/alias-cards-rou",
        "icon": "fa-github",
        "position": "bottom-left",
        "bottomPx": 20,
        "leftPx": 20
      },
      "donate": {
        "url": "https://ko-fi.com/hmlendea",
        "icon": "fa-heart",
        "position": "bottom-left",
        "bottomPx": 70,
        "leftPx": 20
      }
    },
    "colors": {
      "background": "#f5f6fa",
      "cardBackground": "white",
      "textPrimary": "#2c3e50",
      "textHover": "#8e44ad",
      "wordNumber": "#8e44ad"
    },
    "breakpoints": {
      "mobileMaxWidthPx": 768
    }
  },
  "dependencies": {
    "jquery": {
      "version": "3.6.3",
      "cdn": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js",
      "integrity": "sha512-STof4xm1wgkfm7heWqFJVn58Hm3EtS31XFaagaa8VMReCXAkQnJZ+jEy8PCC/iT18dFy95WcExNHFTqLyp72eQ==",
      "crossorigin": "anonymous"
    },
    "jqueryEasing": {
      "version": "1.12.1",
      "cdn": "https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.12.1/jquery.easing.min.js",
      "integrity": "sha512-...",
      "crossorigin": "anonymous",
      "required": false
    },
    "fontAwesome": {
      "version": "6.5.1",
      "cdn": "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.js",
      "integrity": "sha512-...",
      "crossorigin": "anonymous"
    }
  }
}
```

## Environment Variables (Not Used)

| Variable | Purpose | Current Value |
|----------|---------|---------------|
| `NODE_ENV` | Build environment | N/A (no build) |
| `BASE_URL` | Deployment base path | N/A (root) |
| `CARDS_PATH` | Catalogue file path | N/A (hardcoded) |
| `SEARCH_ENGINE_URL` | NuciSearch endpoint | N/A (hardcoded) |

## Feature Flags (Not Present)

| Flag | Default | Purpose |
|------|---------|---------|
| `ENABLE_ANALYTICS` | `false` | Track draws, clicks |
| `ENABLE_HISTORY` | `false` | Remember previous cards |
| `ENABLE_CATEGORIES` | `false` | Filter by theme |
| `ENABLE_DIFFICULTY` | `false` | Weight cards by difficulty |
| `ENABLE_OFFLINE` | `false` | Service worker caching |
| `ENABLE_THEMES` | `false` | Light/dark mode |

## Runtime Configuration (Console Only)

```javascript
// Override any hardcoded value at runtime (lost on refresh)
window.CONFIG = {
  searchEngineUrl: 'https://custom-search.example.com',
  querySuffix: ' DEFINITION',
  cardsPerDraw: 8,
  // ...
};

// Monkey-patch selectRandomCard
const originalSelect = selectRandomCard;
selectRandomCard = function() {
  // Custom logic
  return originalSelect.apply(this, arguments);
};
```

## Configuration Drift Risks

| Risk | Description | Mitigation |
|------|-------------|------------|
| `cards.js` vs `index.html` word count mismatch | 8 divs in HTML, but cards have 7 or 9 words | Manual consistency, validation script |
| `script.js` loop vs `cards.js` keys | Loop hardcoded 1–8, but card keys differ | Validation script |
| CDN URLs outdated | Libraries update, old versions deprecated | Periodic audit, Dependabot |
| Search engine URL changes | NuciSearch moves or changes API | Monitor, fallback |

## Recommended Configuration Approach (If Needed)

### Option 1: JSON Config File (Minimal)

```
config.json          # New file
script.js            # Fetch config.json on load, then init
```

### Option 2: ES Module Config (Modern)

```
config.js            # export const CONFIG = {...}
script.js            # import {CONFIG} from './config.js'
index.html           # <script type="module" src="script.js">
```

### Option 3: URL Parameters (Zero File)

```
?cards=50&theme=dark&engine=custom
script.js            # Parse new URLSearchParams(window.location.search)
```

**Recommendation**: Current zero-config approach is appropriate for this application's scope. Add configuration only when a genuine need arises (e.g., multiple deployments with different card sets).