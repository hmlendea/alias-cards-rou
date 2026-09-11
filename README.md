[![Donate](https://img.shields.io/badge/-%E2%99%A5%20Donate-%23ff69b4)](https://hmlendea.go.ro/funding)
[![Latest Release](https://img.shields.io/github/v/release/hmlendea/alias-cards-rou)](https://github.com/hmlendea/alias-cards-rou/releases/latest)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://gnu.org/licenses/gpl-3.0)

# Alias Cards (ROU)

A web app for displaying random Alias Party cards in Romanian. Each card shows 8 words or phrases to be described without using the word itself. Click any word to look it up instantly.

**Live instance:** https://hmlendea.github.io/alias-cards-rou

## 📑 Table of Contents

- [Capabilities](#capabilities)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Project Engagement](#project-engagement)
- [License](#license)

## ✨ Capabilities

- Display random Alias Party game cards with 8 words or phrases per card
- Instantly look up any word with integrated [NuciSearch](https://search.nucilandia.ro) queries
- Intelligently format searches: single words and infinitive phrases as dictionary lookups, multi-word expressions as definitions
- Play alongside the physical board game or use as a standalone digital card game

## 🚀 Usage

Open `index.html` in any modern browser, or visit the [live instance](https://hmlendea.github.io/alias-cards-rou).

Press the **⟳** button in the bottom-right corner to draw a new random card. Click any word to search its definition on NuciSearch.

## 🗂️ Project Structure

| File | Description |
|------|-------------|
| `index.html` | Main page layout — card structure and button |
| `style.css` | Visual styling for the card, words, and controls |
| `script.js` | Card selection logic and word link generation |
| `cards.js` | Card data — all word sets defined as a JS object |

## 🏗️ Architecture

See the [architecture documentation](./ARCHITECTURE.md) for the system context, principal components, runtime flows, ownership boundaries, dependencies, constraints, and extension points.

## 🤝 Contributing

You are welcome to submit any suggestion, feedback, or modification to this project.

When doing so, please:
- Maintain cross-platform compatibility
- Submit focused pull requests that conform to the existing code style
- Maintain your branch synchronised with `main`
- Revise the documentation when functionality changes
- Properly test all modifications, including edge cases and error conditions

## 💝 Project Engagement

Discovered a problem or have a suggestion? [Open an issue](https://github.com/hmlendea/alias-cards-rou/issues)!

If you find this project useful, consider [funding it](https://hmlendea.go.ro/funding) or starring ⭐️ it on GitHub!

[![Donate](https://raw.githubusercontent.com/hmlendea/readme-assets/master/donate_generic.png)](https://hmlendea.go.ro/funding)

## 📄 License

This project is being distributed under the `GNU General Public License v3.0 or later`.
See [LICENSE](./LICENSE) for further information.
