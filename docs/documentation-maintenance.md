# Documentation Maintenance

## Overview

Procedures for keeping documentation accurate, current, and useful.

---

## Documentation Inventory

| File | Purpose | Update Trigger |
|------|---------|----------------|
| `README.md` | Project overview | Major features, links |
| `ARCHITECTURE.md` | System architecture | Structural changes |
| `SECURITY.md` | Security policy | Vulnerabilities, policy changes |
| `PRIVACY.md` | Data handling | Data practice changes |
| `ROADMAP.md` | Future plans | Quarterly / milestone |
| `CODE_OF_CONDUCT.md` | Community standards | Policy updates |
| `CONTRIBUTING.md` | Contribution guide | Process changes |
| `LICENSE` | Legal | License change |
| `docs/repository-overview.md` | Repo summary | Structural changes |
| `docs/repository-structure.md` | File tree | File add/remove/move |
| `docs/architecture.md` | Technical architecture | Component changes |
| `docs/components/*.md` | Component deep-dives | Component changes |
| `docs/flows/*.md` | User/system flows | Flow changes |
| `docs/behaviour/*.md` | Behaviour specs | Behaviour changes |
| `docs/data-model.md` | Data structures | Data changes |
| `docs/configuration.md` | Config options | Config changes |
| `docs/dependencies.md` | External deps | Dependency changes |
| `docs/build-and-deployment.md` | Build/deploy | Pipeline changes |
| `docs/testing.md` | Test strategy | Test changes |
| `docs/security.md` | Security details | Security changes |
| `docs/error-handling.md` | Error handling | Error logic changes |
| `docs/logging.md` | Logging | Logging changes |
| `docs/state-and-persistence.md` | State management | State changes |
| `docs/concurrency-and-scheduling.md` | Concurrency | Scheduling changes |
| `docs/design-decisions.md` | ADRs | New decisions |
| `docs/invariants.md` | System invariants | Invariant changes |
| `docs/integrations.md` | External integrations | Integration changes |
| `docs/change-guide.md` | How to make changes | Process changes |
| `docs/troubleshooting.md` | Common issues | New issues/solutions |
| `docs/faq.md` | User questions | New questions |
| `docs/quick-start.md` | Getting started | Setup changes |
| `docs/documentation-maintenance.md` | This file | Process changes |
| `docs/ambiguities-and-open-questions.md` | Open items | Resolution/new items |
| `docs/api-usage-examples.md` | API examples | API changes |
| `docs/INDEX.md` | Master navigation | Any doc change |

---

## Maintenance Principles

1. **Documentation lives with code** — Update docs in same PR as code
2. **Single source of truth** — Don't duplicate; reference
3. **Template fidelity** — Follow GitHub markdown templates exactly
4. **Verify links** — All internal links must resolve
5. **Version awareness** — Note when docs apply to which version

---

## Update Workflow

### For Code Changes

```bash
# 1. Make code change
# 2. Identify affected docs (see inventory table)
# 3. Update each affected doc
# 4. Verify links: ./verify-links.sh
# 5. Commit together
git add -A
git commit -m "feat: description (code + docs)"
git push
```

### For Documentation-Only Changes

```bash
# 1. Edit docs
# 2. Verify links
# 3. Commit
git add docs/
git commit -m "docs: update X for Y"
git push
```

---

## Link Verification

### Automated Check (Recommended)

```bash
#!/bin/bash
# verify-links.sh
# Check all markdown links resolve

find docs -name "*.md" -exec grep -hE '\[.*\]\([^)]+\)' {} \; | \
  grep -oE '\([^)]+\)' | \
  tr -d '()' | \
  while read url; do
    if [[ $url == http* ]]; then
      curl -sfI "$url" > /dev/null || echo "BROKEN: $url"
    elif [[ $url == /* ]]; then
      # Absolute path in repo
      test -f ".${url}" || echo "MISSING: $url"
    else
      # Relative path - would need context
      echo "RELATIVE: $url"
    fi
  done
```

### Manual Check

- Click all links in rendered GitHub view
- Verify anchor links (`#section`) exist
- Check external URLs return 200

---

## Review Schedule

| Frequency | Activity |
|-----------|----------|
| Per PR | Update affected docs |
| Monthly | Link check, stale content review |
| Quarterly | Full audit: accuracy, completeness, template fidelity |
| Per Release | Version-specific updates, changelog |

---

## Template Compliance

### GitHub Standard Files

These must match templates exactly (fixed prose + placeholders):

- `README.md` → `github.readme.template`
- `ARCHITECTURE.md` → `github.architecture.template`
- `SECURITY.md` → `github.security.template`
- `PRIVACY.md` → `github.privacy.template`
- `ROADMAP.md` → `github.roadmap.template`
- `CODE_OF_CONDUCT.md` → `github.code-of-conduct.template`
- `CONTRIBUTING.md` → `github.contributing.template`

**Rule**: When template changes, update all instances.

### Docs Directory Files

Follow the structure defined in the original documentation request. Each file has a defined purpose and sections.

---

## Quality Checklist

Per documentation update:

- [ ] Follows applicable template
- [ ] No broken internal links
- [ ] No broken external links (or documented as known)
- [ ] Code snippets tested / compile
- [ ] Terminology consistent with codebase
- [ ] No duplicate content (reference instead)
- [ ] Version/date noted if applicable
- [ ] Spelling/grammar checked
- [ ] Rendered view checked on GitHub

---

## Stale Content Detection

### Heuristics

| Signal | Action |
|--------|--------|
| File not touched in 6+ months | Review for accuracy |
| References deleted file/function | Update or remove |
| Screenshots don't match UI | Update or remove |
| Version numbers outdated | Update |
| "TODO" or "FIXME" in docs | Resolve or create issue |

### Automation (Future)

```yaml
# .github/workflows/docs-freshness.yml
name: Docs Freshness
on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check stale docs
        run: |
          find docs -name "*.md" -mtime +180 -exec echo "STALE: {}" \;
```

---

## Migration Guide

### When Restructuring Docs

1. Plan new structure
2. Create migration mapping (old → new)
3. Move content, update links
4. Add redirects if needed (GitHub Pages: 404.html)
5. Update `docs/INDEX.md`
6. Announce in PR/Release notes

### When Template Changes

1. Update template source
2. Regenerate affected files
3. Review diffs
4. Commit as "chore: sync templates"

---

## Ownership

| Area | Owner |
|------|-------|
| Root GitHub files | Repository admin |
| `docs/architecture.md` | Architecture maintainer |
| `docs/components/*` | Component owners |
| `docs/flows/*` | Feature owners |
| `docs/behaviour/*` | Product/UX |
| `docs/data-model.md` | Data owner |
| `docs/security.md` | Security owner |
| `docs/testing.md` | QA lead |
| `docs/*-maintenance.md` | Docs maintainer |

---

## Tools

| Task | Tool |
|------|------|
| Link check | `markdown-link-check`, `lychee` |
| Spell check | `cspell`, `markdownlint` |
| Style check | `markdownlint` |
| TOC generation | `markdown-toc` |
| Render preview | VS Code Markdown Preview, GitHub |
| Template sync | Manual / script |

---

## Emergency Procedures

### Docs Deploy Broken

1. Revert last docs commit
2. Fix locally
3. Re-deploy

### Major Inaccuracy Found

1. Add warning banner to affected page
2. Create issue with `docs` label
3. Fix ASAP
4. Remove banner

---

## Metrics (Optional)

| Metric | Target |
|--------|--------|
| Broken links | 0 |
| Stale files (>6mo) | < 10% |
| Template compliance | 100% |
| PRs with doc updates | 100% (when applicable) |
| Time to doc update | < 1 day |