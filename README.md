[![Donate](https://img.shields.io/badge/-%E2%99%A5%20Donate-%23ff69b4)](https://hmlendea.go.ro/fund.html)
[![Latest Release](https://img.shields.io/github/v/release/hmlendea/alias-cards-rou)](https://github.com/hmlendea/alias-cards-rou/releases/latest)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://gnu.org/licenses/gpl-3.0)

# Alias Cards (ROU)

A web app for displaying random Alias Party cards in Romanian. Each card shows 8 words or phrases to be described without using the word itself. Click any word to look it up instantly.

**Live instance:** https://hmlendea.github.io/alias-cards-rou

## Table of Contents

- [Overview](#overview)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Overview

This is a single-page web application that randomly selects one of the pre-defined Alias Party cards and displays its 8 words. It is intended to be used alongside the physical Alias Party board game as a digital card deck, or as a standalone word game.

Words are clickable and open a [NuciSearch](https://search.nucilandia.ro) query in a new tab:
- Single words and verb phrases starting with **"a"** (infinitive form) are searched as `[word] DEX`, pointing directly to dictionary results.
- All other multi-word expressions are searched as `Definiție: [word]`.

## Usage

Open `index.html` in any modern browser, or visit the [live instance](https://hmlendea.github.io/alias-cards-rou).

Press the **⟳** button in the bottom-right corner to draw a new random card.

## Project Structure

| File | Description |
|------|-------------|
| `index.html` | Main page layout — card structure and button |
| `style.css` | Visual styling for the card, words, and controls |
| `script.js` | Card selection logic and word link generation |
| `cards.js` | Card data — all word sets defined as a JS object |

## Architecture

For a comprehensive description of the system design, including component responsibilities, runtime flow, data architecture, external integrations, and cross-cutting concerns, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Contributing

Contributions are welcome.

Please:

- keep the changes cross-platform
- keep the pull requests focused and consistent with the existing style
- update the documentation when the behaviour changes

## License

Licensed under the GNU General Public License v3.0 or later.
See [LICENSE](./LICENSE) for details.
