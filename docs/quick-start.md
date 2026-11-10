# Quick Start

## For Users

### Online (Recommended)

Visit: **https://hmlendea.github.io/alias-cards-rou/**

1. Page loads → random card displayed
2. Click any **word** → opens definition on NuciSearch (new tab)
3. Click **⟳ button** (bottom right) → new random card
4. Click **GitHub** (bottom left) → source code
5. Click **♥** (bottom left) → donate

### Offline (After First Visit)

1. Visit online once (caches resources)
2. Open bookmark offline
4. Draw cards work offline
5. Word links require internet

---

## For Developers

### Prerequisites

- Git
- Any static file server (Python, Node, nginx, etc.)
- Modern browser

### Clone & Run Locally

```bash
# Clone
git clone https://github.com/hmlendea/alias-cards-rou.git
cd alias-cards-rou

# Option 1: Python (built-in)
python3 -m http.server 8000
# Open http://localhost:8000

# Option 2: Node (http-server)
npx http-server
# Open shown URL

# Option 3: VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

### Project Structure

```
alias-cards-rou/
├── index.html      # Entry point
├── style.css       # Styling
├── script.js       # App logic
├── cards.js        # 200 cards × 8 words
└── docs/           # Documentation
```

### Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `index.html` | DOM structure, CDN links | ~35 |
| `style.css` | Card layout, responsive | ~80 |
| `script.js` | `selectRandomCard()` | ~25 |
| `cards.js` | Word catalogue | ~2000 |

### Make a Change

```bash
# 1. Edit file (e.g., add card to cards.js)
# 2. Test locally
python3 -m http.server 8000
# 3. Verify in browser
# 4. Commit & push
git add .
git commit -m "feat: add new vocabulary card"
git push origin main
# 5. Live in 1-2 min at github.io URL
```

---

## For Contributors

### Add a Vocabulary Card

1. Open `cards.js`
2. Add after card `"200"`:

```javascript
"201": {
  word1: "cuvânt",
  word2: "a vorbi",
  word3: "fraza lungă",
  word4: "a asculta",
  word5: "a înțelege",
  word6: "a explica",
  word7: "a întreba",
  word8: "a răspunde"
}
```

3. Test locally
4. Submit PR

### Report a Bug

1. Open GitHub Issues
2. Include: browser, steps, expected vs actual
3. Screenshots help

### Suggest a Word

Open Issue or PR with word and suggested card position.

---

## For Deployers

### GitHub Pages (Current)

1. Repository Settings → Pages
2. Source: `main` branch, `/` (root)
3. Save → auto-deploys on push to `main`

### Custom Domain (Optional)

1. Add `CNAME` file with domain
2. Configure DNS: CNAME → `hmlendea.github.io`
3. Enable "Enforce HTTPS" in Pages settings

### Other Static Hosts

| Platform | Command |
|----------|---------|
| Netlify | `netlify deploy --prod --dir .` |
| Vercel | `vercel --prod` |
| Cloudflare Pages | Connect repo, build: none, output: `/` |
| Firebase | `firebase deploy` (with `firebase.json`) |
| Surge | `surge .` |
| nginx/Apache | Copy files to document root |

---

## Minimal Test Checklist

Before any push:

- [ ] `python3 -m http.server` loads
- [ ] Card displays 8 words
- [ ] ⟳ button draws new card
- [ ] Word click → NuciSearch opens
- [ ] GitHub/Donate links work
- [ ] Mobile viewport (375px) OK
- [ ] No console errors
- [ ] All resources HTTPS

---

## One-Line Commands

```bash
# Quick local test
cd alias-cards-rou && python3 -m http.server 8000

# Validate HTML
npx html-validate index.html

# Check for console errors (headless)
npx playwright install && npx playwright test --headed=false

# Deploy to Netlify (one-time setup)
netlify deploy --prod --dir .

# Check live site
curl -I https://hmlendea.github.io/alias-cards-rou/
```