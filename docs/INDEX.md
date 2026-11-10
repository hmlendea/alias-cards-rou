# Documentation Index

## Master Navigation

This is the central index for all documentation in the Alias Cards project.

---

## Root Documentation (GitHub Standard)

| File | Description |
|------|-------------|
| [README.md](../README.md) | Project overview, quick start, links |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | System architecture, components, data flows |
| [SECURITY.md](../SECURITY.md) | Security policy, reporting, supported versions |
| [PRIVACY.md](../PRIVACY.md) | Data handling, privacy practices |
| [ROADMAP.md](../ROADMAP.md) | Future plans, milestones |
| [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) | Community standards |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Contribution guidelines |
| [LICENSE](../LICENSE) | MIT License |

---

## Repository Overview

| File | Description |
|------|-------------|
| [docs/repository-overview.md](repository-overview.md) | High-level repository summary |
| [docs/repository-structure.md](repository-structure.md) | File tree with descriptions |
| [docs/architecture.md](architecture.md) | Technical architecture deep-dive |

---

## Components

| File | Description |
|------|-------------|
| [docs/components/presentation.md](components/presentation.md) | UI components: card, words, buttons, links |
| [docs/components/host-and-composition.md](components/host-and-composition.md) | Application bootstrap, DOM composition |
| [docs/components/application-services.md](components/application-services.md) | Core logic: `selectRandomCard()`, query building |
| [docs/components/browser-state-and-localisation.md](components/browser-state-and-localisation.md) | Client-side state, no persistence, i18n |
| [docs/components/integration-models.md](components/integration-models.md) | External integration patterns |

---

## Flows

| File | Description |
|------|-------------|
| [docs/flows/startup-and-rendering.md](flows/startup-and-rendering.md) | Page load → first card draw |
| [docs/flows/calendar-search.md](flows/calendar-search.md) | Word click → NuciSearch navigation |
| [docs/flows/detail-mutation.md](flows/detail-mutation.md) | Button click → new card render |

---

## Behaviour

| File | Description |
|------|-------------|
| [docs/behaviour/browse-and-search.md](behaviour/browse-and-search.md) | User browsing, word lookup |
| [docs/behaviour/inspect-edit-delete.md](behaviour/inspect-edit-delete.md) | N/A (no CRUD) — placeholder |

---

## Core Documentation

| File | Description |
|------|-------------|
| [docs/data-model.md](data-model.md) | Card structure, word types, query logic |
| [docs/configuration.md](configuration.md) | Configurable parameters |
| [docs/dependencies.md](dependencies.md) | External dependencies (jQuery, Font Awesome, CDNs) |
| [docs/build-and-deployment.md](build-and-deployment.md) | GitHub Pages deployment, no build step |
| [docs/testing.md](testing.md) | Test strategy (currently manual) |
| [docs/security.md](security.md) | Security measures, XSS prevention, headers |
| [docs/error-handling.md](error-handling.md) | Error scenarios, graceful degradation |
| [docs/logging.md](logging.md) | No logging — rationale |
| [docs/state-and-persistence.md](state-and-persistence.md) | No persistent state |
| [docs/concurrency-and-scheduling.md](concurrency-and-scheduling.md) | Single-threaded, no scheduling |
| [docs/design-decisions.md](design-decisions.md) | Architectural Decision Records |
| [docs/invariants.md](invariants.md) | System invariants (82 verified properties) |
| [docs/integrations.md](integrations.md) | External integrations (NuciSearch, GitHub, Ko-fi, CDNs) |
| [docs/change-guide.md](change-guide.md) | How to make common changes safely |
| [docs/troubleshooting.md](troubleshooting.md) | Common issues and solutions |
| [docs/faq.md](faq.md) | Frequently asked questions |
| [docs/quick-start.md](quick-start.md) | Getting started for users, devs, deployers |
| [docs/documentation-maintenance.md](documentation-maintenance.md) | Docs update procedures |
| [docs/ambiguities-and-open-questions.md](ambiguities-and-open-questions.md) | Unresolved items, decision tracking |
| [docs/api-usage-examples.md](api-usage-examples.md) | Integration usage patterns |

---

## Quick Links by Role

### For Users

- [Quick Start](quick-start.md#for-users)
- [FAQ](faq.md)
- [Troubleshooting](troubleshooting.md)

### For Developers

- [Quick Start](quick-start.md#for-developers)
- [Architecture](architecture.md)
- [Change Guide](change-guide.md)
- [Components](components/)
- [Flows](flows/)

### For Contributors

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Change Guide](change-guide.md#addingmodifying-cards)
- [Data Model](data-model.md)

### For Deployers

- [Quick Start](quick-start.md#for-deployers)
- [Build and Deployment](build-and-deployment.md)
- [Dependencies](dependencies.md)

### For Security

- [SECURITY.md](../SECURITY.md)
- [Security Details](security.md)
- [Invariants](invariants.md#security-invariants)

---

## Documentation Maintenance

- [Documentation Maintenance](documentation-maintenance.md) — Update procedures
- [Ambiguities](ambiguities-and-open-questions.md) — Open questions

---

## Search Tips

- Use GitHub's file finder (`t` key) to search by filename
- Use browser find (`Ctrl+F`) within rendered markdown
- All internal links are relative and work on GitHub

---

## Last Updated

Generated: 2025-01-15
Total files: 33 (7 root + 26 in docs/)