# Security Policy

This project is a client-side web application for displaying random Alias Party cards in Romanian. It runs entirely in the browser with no server-side components, no authentication, no user data collection, and no external API dependencies beyond optional dictionary lookups initiated by the user.

## 📑 Table of Contents

- Supported Versions
- Reporting a Vulnerability
- Scope
- Disclosure Policy
- Safe Harbour
- Recognition

## 🛡️ Supported Versions

Use this table to indicate which project versions currently receive security maintenance.

| Version | Distribution Channel | Supported |
|---------|--------------------|-----------|
| Latest version | GitHub Pages | ✅ |
| Latest version | GitHub Releases | ✅ |
| Preceding versions | Any distribution channel | ❌ |

## 🚨 Reporting a Vulnerability

Please do not disclose suspected vulnerabilities publicly before maintainers have had an opportunity to validate and remediate them.

To report a vulnerability:
- [GitHub Security Advisories](https://github.com/hmlendea/alias-cards-rou/security/advisories)
- Contact the maintainers directly

## 📌 Scope

The subsequent report categories are in scope for this repository:
- Cross-site scripting (XSS) via card data or user interactions
- Content injection through word lookup URLs
- Supply chain vulnerabilities in dependencies (none currently)

The subsequent categories are out of scope unless explicitly stated to the contrary:
- Server-side vulnerabilities (no server component exists)
- Authentication or authorization flaws (no auth system exists)
- Data privacy violations (no personal data is collected or stored)
- Denial of service (static client-side application)

## 📢 Disclosure Policy

This project follows coordinated disclosure:
1. Vulnerabilities are investigated privately.
2. A remediation plan is prepared and validated.
3. Public disclosure is published after a fix, mitigation, or agreed risk decision is available.
4. Credit is attributed in accordance with reporter preference and project policy.

## 🧾 Safe Harbour

If your research is conducted in good faith, confined to authorised scope, and disclosed responsibly, the maintainers will not pursue action for policy-compliant activity.

## 🙏 Recognition

We appreciate responsible disclosure. Reporters who desire public attribution may be acknowledged in release notes, advisories, or a dedicated acknowledgements section.