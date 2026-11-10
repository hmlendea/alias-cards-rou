# API Usage Examples

## Overview

This application has no traditional API (no REST, GraphQL, gRPC). However, it integrates with external services via URL-based navigation. This document describes those integration patterns as "API usage."

---

## NuciSearch Integration

### Base URL

```
https://search.nucilandia.ro
```

### Query Parameter

| Parameter | Required | Description |
|-----------|----------|-------------|
| `q` | Yes | URL-encoded search query |

### Query Formats

The application generates three query formats based on word structure:

#### 1. Single Word (Noun, Adjective, etc.)

```
GET https://search.nucilandia.ro?q=kilometru%20DEX
```

**Decoded query**: `kilometru DEX`

**Use case**: Dictionary lookup for single words.

#### 2. Infinitive Verb (starts with "a ")

```
GET https://search.nucilandia.ro?q=a%20urca%20DEX
```

**Decoded query**: `a urca DEX`

**Use case**: Verb dictionary form lookup.

#### 3. Reflexive Verb (starts with "a se ")

```
GET https://search.nucilandia.ro?q=Defini%C8%9Bie%3A%20a%20se%20mira
```

**Decoded query**: `Definiție: a se mira`

**Use case**: Phrase/definition search.

#### 4. Multi-word Phrase

```
GET https://search.nucilandia.ro?q=Defini%C8%9Bie%3A%20polul%20Nord
```

**Decoded query**: `Definiție: polul Nord`

**Use case**: Compound words, proper nouns, idioms.

### JavaScript Implementation

```javascript
// From script.js - selectRandomCard()
function buildNuciSearchUrl(wordText) {
  const parts = wordText.trim().split(/\s+/);
  const isSingleWord = parts.length === 1;
  const isInfinitive = parts.length === 2 && parts[0].toLowerCase() === 'a';
  const isReflexive = parts.length >= 3 &&
    parts[0].toLowerCase() === 'a' &&
    parts[1].toLowerCase() === 'se';

  let query;
  if (isSingleWord || isInfinitive) {
    query = wordText + ' DEX';
  } else {
    query = 'Definiție: ' + wordText;
  }

  const encodedQuery = encodeURIComponent(query);
  return 'https://search.nucilandia.ro?q=' + encodedQuery;
}

// Usage
const url = buildNuciSearchUrl('a se mira');
// Returns: "https://search.nucilandia.ro?q=Defini%C8%9Bie%3A%20a%20se%20mira"
```

### Direct Usage Examples

#### From Browser Console

```javascript
// Open definition for any Romanian word
function openDefinition(word) {
  const parts = word.trim().split(/\s+/);
  const query = (parts.length === 1 ||
    (parts.length === 2 && parts[0].toLowerCase() === 'a'))
    ? word + ' DEX'
    : 'Definiție: ' + word;
  window.open('https://search.nucilandia.ro?q=' + encodeURIComponent(query), '_blank');
}

// Examples
openDefinition('kilometru');
openDefinition('a urca');
openDefinition('a se mira');
openDefinition('polul Nord');
```

#### From Command Line

```bash
# Single word
open "https://search.nucilandia.ro?q=kilometru%20DEX"

# Infinitive
open "https://search.nucilandia.ro?q=a%20urca%20DEX"

# Phrase
open "https://search.nucilandia.ro?q=Defini%C8%9Bie%3A%20polul%20Nord"
```

#### From HTML

```html
<!-- Direct link -->
<a href="https://search.nucilandia.ro?q=kilometru%20DEX"
   target="_blank"
   rel="noopener noreferrer">
  kilometru
</a>

<!-- With JavaScript -->
<button onclick="window.open('https://search.nucilandia.ro?q=' + encodeURIComponent('a urca DEX'), '_blank')">
  Define "a urca"
</button>
```

---

## GitHub Integration

### Repository URL

```
https://github.com/hmlendea/alias-cards-rou
```

### Usage

```html
<a href="https://github.com/hmlendea/alias-cards-rou"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="View source on GitHub">
  <i class="fa-brands fa-github"></i>
</a>
```

---

## Ko-fi Integration

### Profile URL

```
https://ko-fi.com/hmlendea
```

### Usage

```html
<a href="https://ko-fi.com/hmlendea"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Donate on Ko-fi">
  <i class="fa-solid fa-heart"></i>
</a>
```

---

## CDN Resources

### jQuery 3.6.3

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js"
        integrity="sha512-..."
        crossorigin="anonymous"></script>
```

### Font Awesome 6.5.1

```html
<link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      integrity="sha512-..."
      crossorigin="anonymous">
```

---

## Internal "API" (JavaScript Functions)

### `selectRandomCard()`

**Signature**: `function selectRandomCard(): void`

**Description**: Draws a random card and updates the DOM.

**Side Effects**: Mutates 8 DOM elements (`#word1 .word-text` through `#word8 .word-text`)

**Example**:

```javascript
// Called automatically on page load
$(document).ready(function() {
  selectRandomCard();
});

// Called on button click
<button id="next-button" onclick="selectRandomCard()" title="New card">⟳</button>

// Manual call from console
selectRandomCard();
```

### `cards` Object

**Type**: `Record<string, Card>`

**Structure**:

```typescript
interface Card {
  word1: string;
  word2: string;
  word3: string;
  word4: string;
  word5: string;
  word6: string;
  word7: string;
  word8: string;
}

// Access
const card = cards['1'];        // Card #1
const word = cards['42'].word3; // 3rd word of card #42
const count = Object.keys(cards).length; // 200
```

---

## Error Responses

### NuciSearch

| Scenario | HTTP Status | Response |
|----------|-------------|----------|
| Success | 200 | HTML page with results |
| No results | 200 | HTML page "No results found" |
| Server error | 5xx | HTML error page |
| Rate limited | 429 | HTML error page (if implemented) |

### GitHub Pages

| Scenario | HTTP Status |
|----------|-------------|
| Success | 200 |
| Not found | 404 |
| Server error | 5xx |

---

## Rate Limits

| Service | Limit | Notes |
|---------|-------|-------|
| NuciSearch | Unknown | Public service, no published limits |
| GitHub Pages | 100 GB/month bandwidth | Soft limit |
| cdnjs | Generous | Global CDN |

---

## Authentication

None required for any integration.

---

## Versioning

| Integration | Versioning |
|-------------|------------|
| NuciSearch | None (URL-based) |
| GitHub | URL stable |
| Ko-fi | URL stable |
| jQuery | Pinned in URL (3.6.3) |
| Font Awesome | Pinned in URL (6.5.1) |

---

## Changelog

| Date | Change |
|------|--------|
| 2025-01-15 | Documented current integration patterns |