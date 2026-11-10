# Frequently Asked Questions

## General

### What is Alias Cards?

A simple web app for practicing Romanian vocabulary. Each "card" shows 8 Romanian words/phrases. Click a word to see its definition on NuciSearch. Click ⟳ for a new random card.

### Who is it for?

Romanian language learners, teachers, and anyone wanting quick vocabulary practice.

### Is it free?

Yes. No ads, no tracking, no account needed.

### Does it work offline?

After first load, the page is cached. You can draw cards offline, but clicking words requires internet to reach NuciSearch.

---

## Usage

### How do I get a new card?

Click the ⟳ button (bottom right) or refresh the page.

### How do I see a word's definition?

Click any word. Opens NuciSearch in a new tab.

### Why do some words show "DEX" and others "Definiție"?

- Single words → `word DEX` (dictionary form)
- Infinitives (`a verb`) → `a verb DEX`
- Phrases / reflexives → `Definiție: phrase`

### Can I choose a specific card?

No. Cards are random. For specific practice, use the direct NuciSearch URL: `https://search.nucilandia.ro?q=your+word+DEX`

### Can I save/favorite cards?

No persistent state. Bookmark the page; each visit gives a new random card.

### Is there a mobile app?

No. It's a responsive web page. Add to home screen for app-like experience.

---

## Technical

### What technology does it use?

Vanilla HTML, CSS, JavaScript. jQuery 3.6.3 for DOM. Font Awesome for icons. No build step, no framework.

### Where is the data?

`cards.js` — 200 cards × 8 words = 1,600 Romanian words/phrases.

### How is randomness implemented?

`Math.random()` × 200 cards. Uniform distribution.

### Why jQuery?

Legacy choice. Only used for `$()`, `.text()`, `.html()`, `.ready()`. Could be replaced with vanilla JS (~20 lines).

### Why not React/Vue/Svelte?

Overkill for a single function. Zero dependencies preferred.

### How is it deployed?

GitHub Pages from `main` branch. Push to deploy.

### Can I self-host?

Yes. Any static file server: `python3 -m http.server`, nginx, Apache, Netlify, Vercel, Cloudflare Pages.

---

## Data

### Where do the words come from?

Curated Romanian vocabulary by the author.

### Are there duplicates?

Not intentionally. 1,600 unique entries targeted.

### Can I add my own words?

Edit `cards.js` directly. Follow the format: 8 words per card, keys `"1"`–`"200"`.

### What word types are included?

Nouns, verbs (infinitive, reflexive), adjectives, phrases, idioms.

### Are definitions included in the app?

No. Definitions fetched from NuciSearch on click.

---

## NuciSearch

### What is NuciSearch?

Romanian dictionary search engine at `search.nucilandia.ro`.

### Is it official?

Independent project. Not affiliated with this app.

### What if NuciSearch is down?

Links will show NuciSearch's error page. No fallback currently.

### Can I use a different dictionary?

Edit `script.js` query construction to point elsewhere.

---

## Contributing

### How do I report a bug?

Open a GitHub Issue with: browser, steps to reproduce, expected vs actual.

### How do I suggest a word?

Open a GitHub Issue or PR editing `cards.js`.

### Can I translate to other languages?

The app is Romanian-specific. Fork and adapt for other languages.

---

## Privacy & Security

### Is my data collected?

No. No analytics, no cookies, no localStorage, no accounts.

### Are my searches tracked?

By NuciSearch when you click a word (their policy applies). This app sends nothing.

### Is it secure?

HTTPS only. No user input processed server-side. XSS prevented by jQuery escaping. External links use `noopener noreferrer`.

---

## Troubleshooting

### Page won't load

Check internet. Try hard refresh (Ctrl+Shift+R). Check GitHub Status.

### Button doesn't work

Enable JavaScript. Check DevTools Console for errors.

### Words show as code/HTML

JavaScript error. Refresh. Report if persists.

### Icons show as squares

Font Awesome failed to load. Check network/ad blocker.

### Mobile layout broken

Rotate device. Update browser. Report with device/browser info.

---

## License

### What license?

MIT License. See `LICENSE` file.

### Can I use commercially?

Yes, with license attribution.

### Can I modify?

Yes. Fork, modify, redistribute under MIT.