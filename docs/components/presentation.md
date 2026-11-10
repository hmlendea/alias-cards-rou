# Presentation Component

## Overview

The presentation component comprises `index.html` (structure) and `style.css` (styling). Together they define the visual card, word slots, control button, and external links.

## File: `index.html`

### Structure

```html
<body>
  <div class="card">
    <div id="word1" class="word">...</div>
    ...
    <div id="word8" class="word">...</div>
  </div>
  <a class="github-link" ...>...</a>
  <a class="donate-link" ...>...</a>
  <button id="next-button" class="control-button" onclick="selectRandomCard()">⟳</button>
</body>
```

### Word Slot Template (×8)

```html
<div id="wordN" class="word">
  <span class="word-number">N</span>
  <span class="word-text">word</span>
</div>
```

- **`id="wordN"`**: Targeted by `script.js` for population (`#word1` through `#word8`)
- **`.word-number`**: Fixed 1–8 badge (purple circle)
- **`.word-text`**: Replaced at runtime with anchor link to NuciSearch

### External Links

| Link | Class | Position | Icon | Text |
|------|-------|----------|------|------|
| GitHub | `.github-link` | Bottom-left | `fa-github` | "Cod sursă" |
| Donate | `.donate-link` | Above GitHub | `fa-heart` | "Donează" |

Both use `target="_blank" rel="noopener noreferrer"`.

### Control Button

- **ID**: `#next-button`
- **Class**: `.control-button`
- **Action**: `onclick="selectRandomCard()"`
- **Position**: Fixed bottom-right (1mm from edges)
- **Content**: Unicode refresh symbol `⟳`

### Resource Loading Order

1. `style.css` (stylesheet)
2. Font Awesome 6.5.1 (CDN)
3. jQuery 3.6.3 (CDN)
4. jQuery Easing 1.12.1 (CDN)
5. `cards.js` (data)
6. `script.js` (logic)

## File: `style.css`

### Layout Strategy

- **Viewport**: `height: 100vh`, `display: flex`, `justify-content: center`
- **Background**: `darkblue`
- **Card**: Absolute positioned, `bottom: 12%`, `height: 85%`, `aspect-ratio: 1/1.4`
- **Max width**: `90%` (responsive)
- **Card styling**: White background, `border-radius: 15px`, `box-shadow`, `padding: 20px`
- **Flex column**: Words stack vertically, each `height: 100%` (equal distribution)

### Word Styling

```css
.word {
  display: flex;
  align-items: center;
  text-align: left;
  font-size: 2.2em;
  height: 100%;
  width: 100%;
}

.word-number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.4em;
  height: 1.4em;
  min-width: 1.4em;
  min-height: 1.4em;
  border-radius: 50%;
  background-color: purple;
  color: white;
  font-weight: bold;
  margin-left: 12px;
  margin-right: 24px;
}

.word-text {
  flex-grow: 1;
  text-align: left;
  color: black;
}

.word-text a {
  color: inherit;
  text-decoration: none;
}
.word-text a:hover {
  text-decoration: underline;
}
```

### Control Button Styling

```css
.control-button {
  position: fixed;
  background-color: transparent;
  color: white;
  border: none;
  display: flex;
  font-size: 48px;
}

#next-button {
  bottom: 1mm;
  right: 1mm;
}
```

### External Link Styling

```css
.github-link, .donate-link {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  font-size: 24px;
  text-decoration: none;
}

.github-link { bottom: 1mm; left: 1mm; }
.donate-link { bottom: 40px; left: 1mm; }

.github-link-text, .donate-link-text { font-size: 18px; }

.github-link:hover { color: lightgrey; }
.donate-link:hover { color: #ff6b6b; }
```

### Reset & Base

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  height: 100vh;
  display: flex;
  justify-content: center;
  background-color: darkblue;
  font-family: Arial, sans-serif;
}
```

## Responsiveness

- **Card max-width**: 90% viewport width
- **Aspect ratio**: 1/1.4 maintained via `aspect-ratio` property
- **Font size**: Fixed `2.2em` on `.word` — scales with card size
- **Button/icon sizes**: Fixed pixel/mm units — may need adjustment on very small screens

## Accessibility

- **Semantic elements**: `<button>`, `<a>` with `href`
- **ARIA labels**: `aria-label` on external links
- **Colour contrast**: White on dark blue (links), black on white (card text), white on purple (numbers)
- **Focus**: Browser default outlines on interactive elements
- **Text scaling**: `em` units respect user font size preferences

## Extension Points

1. **Add word slots**: Add `<div id="word9" class="word">...</div>` in HTML, update `script.js` loop
2. **Change card dimensions**: Modify `.card` height, aspect-ratio, bottom position
3. **Theme colours**: Replace `darkblue`, `purple`, `white` colour values
4. **Typography**: Change `font-family`, `font-size` on `.word`
5. **Animations**: Add transitions on `.word-text a`, `.control-button`, or card entrance