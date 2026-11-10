# Ambiguities and Open Questions

## Overview

Items that are unresolved, undecided, or need clarification. Updated as decisions are made.

---

## Open Questions

### Product / UX

| ID | Question | Context | Status | Owner |
|----|----------|---------|--------|-------|
| AMB-001 | Should cards avoid repeats in a session? | Currently pure random; user may see same card twice | Open | Product |
| AMB-002 | Add categories/tags to cards? | Would enable filtered draws (verbs, nouns, etc.) | Open | Product |
| AMB-003 | Show card number / progress? | "Card 42 of 200" or session counter | Open | UX |
| AMB-004 | Keyboard shortcut for new card? | Space / Enter / N key support | Open | UX |
| AMB-005 | Share card button? | Web Share API or copy link | Open | Product |
| AMB-006 | Dark mode support? | CSS prefers-color-scheme | Open | UX |
| AMB-007 | Sound on card draw? | Subtle audio feedback | Open | UX |
| AMB-008 | Animation on card flip? | CSS transition between cards | Open | UX |

### Technical

| ID | Question | Context | Status | Owner |
|----|----------|---------|--------|-------|
| AMB-010 | Replace jQuery with vanilla JS? | ~20 lines; removes 30 KB dependency | Open | Tech |
| AMB-011 | Remove unused jQuery Easing? | Loaded but never used | **Decided: Remove** | Tech |
| AMB-012 | Add SRI to CDN resources? | Security best practice | Open | Security |
| AMB-013 | Local fallback for CDN? | Resilience if CDN down | Open | Tech |
| AMB-014 | Service Worker for offline? | Full offline support | Open | Tech |
| AMB-015 | Split cards.js into chunks? | If > 200 cards, lazy load | Open | Tech |
| AMB-016 | Add CSP headers? | Limited on GitHub Pages | Open | Security |
| AMB-017 | TypeScript migration? | Type safety for cards data | Open | Tech |
| AMB-018 | Unit tests for selectRandomCard? | Currently no tests | Open | QA |
| AMB-019 | E2E tests with Playwright? | Verify draw, links, mobile | Open | QA |
| AMB-020 | CI pipeline? | Lint, test, link check on PR | Open | DevOps |

### Data

| ID | Question | Context | Status | Owner |
|----|----------|---------|--------|-------|
| AMB-030 | Verify all 1,600 words unique? | No automated check | Open | Data |
| AMB-031 | Add difficulty metadata? | Easy/Medium/Hard for adaptive draws | Open | Data |
| AMB-032 | Add part-of-speech tags? | Noun, verb, adjective, phrase | Open | Data |
| AMB-033 | Source attribution for words? | Dictionary sources, licenses | Open | Legal |
| AMB-034 | Expand beyond 200 cards? | 500? 1000? | Open | Product |
| AMB-035 | User-submitted cards? | Moderation workflow needed | Open | Product |

### Integrations

| ID | Question | Context | Status | Owner |
|----|----------|---------|--------|-------|
| AMB-040 | Fallback dictionary if NuciSearch down? | DexOnline, Wiktionary, etc. | Open | Product |
| AMB-041 | Analytics (privacy-respecting)? | Plausible, Umami, GoatCounter | Open | Product |
| AMB-042 | Error tracking? | Sentry, LogRocket | Open | Tech |
| AMB-043 | Custom domain? | alias-cards.ro or similar | Open | Product |

### Accessibility

| ID | Question | Context | Status | Owner |
|----|----------|---------|--------|-------|
| AMB-050 | WCAG 2.1 AA audit? | Color contrast, focus, landmarks | Open | A11y |
| AMB-051 | Screen reader testing? | NVDA, VoiceOver, JAWS | Open | A11y |
| AMB-052 | Reduced motion support? | prefers-reduced-motion | Open | A11y |
| AMB-053 | High contrast mode? | prefers-contrast | Open | A11y |

### Deployment / Ops

| ID | Question | Context | Status | Owner |
|----|----------|---------|--------|-------|
| AMB-060 | Staging environment? | Preview deployments for PRs | Open | DevOps |
| AMB-061 | Automated dependency updates? | Dependabot / Renovate | Open | DevOps |
| AMB-062 | Performance budget? | Lighthouse CI thresholds | Open | Tech |
| AMB-063 | Monitoring uptime? | UptimeRobot, Better Uptime | Open | DevOps |

---

## Resolved Decisions

| ID | Question | Decision | Date | Reference |
|----|----------|----------|------|-----------|
| AMB-011 | Remove jQuery Easing? | **Yes** — unused, saves 3 KB | 2025-01-15 | `docs/change-guide.md` |
| AMB-001 | No-repeat logic? | **Deferred** — low priority, 1/200 chance | 2025-01-15 | — |

---

## Decision Framework

For each open question, apply:

1. **Impact** — User value / risk reduction (High/Medium/Low)
2. **Effort** — Implementation cost (High/Medium/Low)
3. **Risk** — Regression / maintenance burden (High/Medium/Low)
4. **Alignment** — Fits product vision? (Yes/No)

**Prioritize**: High Impact, Low Effort, Low Risk, Yes Alignment

---

## Tracking

- Review monthly in team sync
- Move to `docs/design-decisions.md` when decided
- Close with resolution link
- Archive resolved items annually