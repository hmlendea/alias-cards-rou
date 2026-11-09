# Privacy and Personal Data

This document describes how Alias Cards (ROU) at https://github.com/hmlendea/alias-cards-rou manages personal data. It covers the application conduct and verified integrations described below. Where the software is self-hosted, the instance operator may have separate responsibilities described below.

## 📑 Table of Contents

- [What This Document Covers](#what-this-document-covers)
- [Self-Hosted Deployments](#self-hosted-deployments)
- [Data We Handle](#data-we-handle)
- [Processing and Use](#processing-and-use)
- [Storage, Retention, and Deletion](#storage-retention-and-deletion)
- [External Processing and Integrations](#external-processing-and-integrations)
- [Data Protection and Security](#data-protection-and-security)
- [Document Changes](#document-changes)
- [Contact](#contact)

## 🔎 What This Document Covers

This document describes how Alias Cards (ROU) at https://github.com/hmlendea/alias-cards-rou manages personal data. It covers the application conduct and verified integrations described below. Where the software is self-hosted, the instance operator may have separate responsibilities described below.

## 🏠 Self-Hosted Deployments

This document covers the project maintainers' practices for the live instance at https://hmlendea.github.io/alias-cards-rou. Self-hosted instance operators control their instance's configuration, local storage, logs, backups, access controls, preservation, and request handling. The project maintainers do not control self-hosted instances.

The application loads jQuery and jQuery Easing from cdnjs.cloudflare.com. When a user clicks a word, the application sends a search query to search.nucilandia.ro (NuciSearch). Operators who self-host can replace these external dependencies by hosting the libraries locally and configuring an alternative search endpoint.

## 📥 Data We Handle

### Data Provided to the Application

No personal data is requested from users, administrators, or connected systems.

### Data Generated or Collected by the Application

No personal data is generated or collected automatically by the application. The application does not use cookies, local storage, telemetry, analytics, crash reporting, or update checks.

### Data Received from Integrations

No personal data is received from integrations or third parties. Search queries sent to NuciSearch contain only the word or phrase the user clicked.

## 🧭 Processing and Use

The application processes data for these verified functions:
- Displaying random Alias Party game cards — Static card data embedded in the application
- Generating search links for clicked words — Word text from the displayed card

## 🗄️ Storage, Retention, and Deletion

The application stores no personal data. Card data is static JavaScript embedded in `cards.js`. Browser caches may temporarily store static assets. For self-hosted deployments, the instance operator controls any server logs, backups, and cache configuration.

## 🔗 External Processing and Integrations

| Service or integration | Purpose | Data involved | Configuration or documentation |
|-----------------------|---------|---------------|--------------------------------|
| cdnjs.cloudflare.com | Deliver jQuery and jQuery Easing libraries | None (static library files) | https://cdnjs.com/ |
| search.nucilandia.ro (NuciSearch) | Provide dictionary and definition lookups for clicked words | Search query containing the clicked word or phrase | https://search.nucilandia.ro |

The application has no built-in external data transfer beyond the libraries loaded from cdnjs.cloudflare.com and the search queries sent to search.nucilandia.ro when a user clicks a word.

## 🛡️ Data Protection and Security

The application is a static web application with no server-side processing, authentication, or personal data storage. For the live instance, GitHub Pages serves the static files over HTTPS. For self-hosted deployments, the instance operator is responsible for updates, secrets, access controls, backups, network exposure, and log protection. The original maintainers are not responsible for changes, modifications, or privacy issues introduced by downstream forks.

## 🔄 Document Changes

Update this document when application data processes, storage, integrations, or deployment responsibilities change. The current version is published at https://github.com/hmlendea/alias-cards-rou/blob/main/PRIVACY.md.

## 📬 Contact

For questions about application data handling, contact the project maintainers via GitHub issues at https://github.com/hmlendea/alias-cards-rou/issues. For a self-hosted instance, contact the instance operator. Include the instance URL and a description of the concern; do not send passwords, access tokens, or other secrets.