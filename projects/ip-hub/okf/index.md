---
type: Project
title: "IP Hub"
description: "Intellectual Property Management Platform"
project-type: nestjs-vue
tech-stack:
  frontend:
    framework: nuxt
    version: "4"
    state: pinia
    testing: vitest
  backend:
    framework: nestjs
    architecture: cqrs
    database: postgresql
    testing: jest
repo-url: "https://github.com/org/ip-hub"
ci-url: "https://ci.ip-hub.internal"
---

# IP Hub

> Intellectual Property Management Platform with 12 bounded contexts.

---

## Overview

IP Hub is an Intellectual Property Management Platform built with NestJS (CQRS) backend and Nuxt 4 frontend. It manages patents, trademarks, copyrights, and related workflows across multiple jurisdictions.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Nuxt 4 + Vue 3 + Pinia |
| Backend | NestJS + CQRS |
| Database | PostgreSQL |
| ORM | TypeORM |
| Testing | Vitest (frontend), Jest (backend) |
| E2E | Playwright + Cucumber |
| Contracts | Pact |

---

## Bounded Contexts

See [bounded-contexts/index.md](bounded-contexts/index.md) for the full context map.

| Context | Responsibility | Status |
|---------|---------------|--------|
| Cart | IP asset selection and pricing | 🚧 In Progress |
| Order | License/purchase processing | ⏳ Planned |
| Catalog | IP asset catalog and search | ⏳ Planned |
| Fulfillment | License delivery and activation | ⏳ Planned |
| User Management | Authentication and profiles | ⏳ Planned |
| Billing | Invoicing and payments | ⏳ Planned |
| Search | Full-text and faceted search | ⏳ Planned |
| Notifications | Email, SMS, in-app alerts | ⏳ Planned |
| Analytics | Usage metrics and reporting | ⏳ Planned |
| Compliance | Regulatory requirements | ⏳ Planned |
| Audit | Change tracking and logs | ⏳ Planned |
| Integration | Third-party connectors | ⏳ Planned |

---

## Architecture Decision Records

See [adr/README.md](adr/README.md).

---

## Patterns Used

- [[.framework/patterns/repository-pattern\|P1: Repository with Unit of Work]]
- [[.framework/patterns/cqrs-pattern\|P2: CQRS Command/Query Separation]]
- [[.framework/patterns/aggregate-root\|P3: Aggregate Root]]
- [[.framework/patterns/domain-events\|P4: Domain Events]]
- [[.framework/patterns/pact-contract-testing\|P5: Pact Contract Testing]]

---

## Quick Links

See [[projects/ip-hub/links\|IP Hub Links]] for all external references.

---

## Agents

Run the BDD/TDD pipeline for this project:

```bash
# Stage 1: Requirements → BDD Features
/fluentit-bdd-features:fluentit-bdd-features @specs/<feature>/ --project ip-hub

# Stage 2a: Frontend Step Definitions
/fluentit-bdd-frontend-features:fluentit-bdd-frontend-features features/<feature>/*.feature --project ip-hub

# Stage 2b: Backend Step Definitions
/fluentit-bdd-backend-features:fluentit-bdd-backend-features apps/backend-e2e/features/<feature>/*.feature --project ip-hub

# Stage 3a: Frontend TDD
/fluentit-tdd-frontend:fluentit-tdd-implement specs/<feature>/*.feature --project ip-hub

# Stage 3b: Backend TDD
/fluentit-tdd-backend:fluentit-tdd-backend apps/backend-e2e/features/<feature>.feature "<scenario>" --project ip-hub
```

---

## Sources

- PRDs: `projects/ip-hub/sources/prds/`
- RFCs: `projects/ip-hub/sources/rfcs/`
- Meeting Notes: `projects/ip-hub/sources/meeting-notes/`

---

## Maintenance

```bash
# Reindex code relationships
/graphify:index --project ip-hub

# Ingest new sources
/wiki:ingest projects/ip-hub/sources/

# Sync wiki
/wiki:sync --project ip-hub
```
