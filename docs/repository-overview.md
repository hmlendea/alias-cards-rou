# Repository Overview

## Purpose

Alias Cards (ROU) is a single-page web application that displays random Alias Party game cards in Romanian. Each card contains 8 words or phrases that players must describe without using the word itself. The application integrates with NuciSearch to provide instant dictionary and definition lookups when players click on any word.

## Scope

The repository contains a complete, self-contained static web application with:

- **Card catalogue**: 200 cards with 8 words/phrases each (1,600 total entries) in `cards.js`
- **Presentation layer**: HTML structure and CSS styling for the card display
- **Logic layer**: JavaScript for random card selection and search link generation
- **External integrations**: jQuery (CDN), jQuery Easing (CDN), NuciSearch (lookup service)

## Entry Points

- **Primary**: `index.html` — loads all resources and initialises the application
- **Live deployment**: https://hmlendea.github.io/alias-cards-rou (GitHub Pages)

## Principal Capabilities

1. **Random card display** — On page load and each button press, a random card is selected from the catalogue
2. **Interactive word lookup** — Each word becomes a link to NuciSearch with intelligently formatted queries:
   - Single words and "a + infinitive" phrases → dictionary lookup (`[word] DEX`)
   - Multi-word expressions → definition search (`Definiție: [phrase]`)
3. **Zero-configuration deployment** — Static files served directly from GitHub Pages
4. **No backend, no database, no authentication** — Pure client-side application

## Architectural Decomposition

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser Runtime                        │
├─────────────────────────────────────────────────────────────┤
│  index.html (View Template)                                 │
│  style.css (Presentation)                                   │
│  script.js (Controller)                                     │
│  cards.js (Model — Card Catalogue)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Dependencies                     │
├─────────────────────────────────────────────────────────────┤
│  cdnjs.cloudflare.com → jQuery 3.6.3 + jQuery Easing 1.12.1 │
│  search.nucilandia.ro → NuciSearch lookup service           │
└─────────────────────────────────────────────────────────────┘
```

## Runtime Topology

- **Client-only**: All execution occurs in the browser
- **Stateless**: No session, no persistent storage, no cookies
- **Event-driven**: Card draws triggered by user button clicks
- **User-initiated external calls**: NuciSearch links opened in new tabs on word click

## Major Integrations

| Integration | Type | Direction | Purpose |
|-------------|------|-----------|---------|
| jQuery (CDN) | Library | Inbound | DOM manipulation, event handling |
| jQuery Easing (CDN) | Library | Inbound | Animation easing functions |
| NuciSearch | Service | Outbound | Word/phrase definition lookups |
| GitHub Pages | Hosting | Inbound | Static file distribution |

## System-Wide Invariants

1. **Card catalogue immutability** — `cards.js` is never modified at runtime
2. **Exactly 8 words per card** — Every card object has keys `word1` through `word8`
3. **Query formatting determinism** — Same word always produces same NuciSearch query format
4. **No personal data processing** — Application handles zero personal data
5. **HTTPS-only external calls** — All CDN and service endpoints use HTTPS