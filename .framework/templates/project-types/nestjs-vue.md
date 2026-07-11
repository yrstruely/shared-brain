# Project Type: NestJS + Vue (Nuxt 4)

> Full-stack project type: NestJS (CQRS) backend + Nuxt 4 frontend + PostgreSQL.

---

## Stack

### Frontend

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Nuxt | 4.x |
| UI | Vue | 3.x |
| State | Pinia | 2.x |
| Testing | Vitest | latest |
| E2E | Playwright | latest |

### Backend

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | NestJS | 10.x |
| Architecture | CQRS | — |
| Database | PostgreSQL | 15+ |
| ORM | TypeORM | latest |
| Testing | Jest | latest |
| E2E | Cucumber + Jest | latest |

### Infrastructure

| Layer | Technology |
|-------|------------|
| API | REST + GraphQL |
| Events | Domain Events + Event Bus |
| Contracts | Pact |
| CI/CD | GitHub Actions |

---

## Directory Structure

```
project-name/
├── apps/
│   ├── web/                 # Nuxt 4 frontend
│   │   ├── components/
│   │   ├── composables/
│   │   ├── pages/
│   │   ├── stores/
│   │   └── tests/
│   ├── backend/             # NestJS API
│   │   ├── src/
│   │   │   ├── bounded-contexts/
│   │   │   ├── shared/
│   │   │   └── main.ts
│   │   └── test/
│   └── backend-e2e/         # BDD e2e tests
│       ├── features/
│       └── steps/
├── libs/
│   └── shared/              # Shared types, DTOs
├── features/                # BDD feature files
└── okf/                     # OKF bundle (see template)
```

---

## Patterns Used

- [[.framework/patterns/repository-pattern\|Repository with Unit of Work]]
- [[.framework/patterns/cqrs-pattern\|CQRS Command/Query Separation]]
- [[.framework/patterns/aggregate-root\|Aggregate Root]]
- [[.framework/patterns/domain-events\|Domain Events]]
- [[.framework/patterns/pact-contract-testing\|Pact Contract Testing]]

---

## Agents

| Stage | Agent | Input | Output |
|-------|-------|-------|--------|
| 1 | [[.framework/agents/bdd-feature-generator\|BDD Feature Generator]] | PRDs | `.feature` files |
| 2a | [[.framework/agents/bdd-frontend-steps\|BDD Frontend Steps]] | Features | Playwright steps |
| 2b | [[.framework/agents/bdd-backend-steps\|BDD Backend Steps]] | Features | NestJS steps |
| 3a | [[.framework/agents/tdd-frontend\|TDD Frontend]] | Steps | Components + tests |
| 3b | [[.framework/agents/tdd-backend\|TDD Backend]] | Steps | Handlers + tests |

---

## OKF Bundle Template

See [[.framework/templates/okf-bundle/nestjs-vue/index\|OKF Bundle: NestJS-Vue]] for the full template.

---

## Commands

```bash
# Initialize project
/framework:init-project --name <name> --type nestjs-vue

# Run BDD pipeline
/dna-bdd-features:dna-bdd-features @specs/<feature>/ --project <name>
/dna-bdd-frontend-features:dna-bdd-frontend-features features/<feature>/*.feature --project <name>
/dna-bdd-backend-features:dna-bdd-backend-features apps/backend-e2e/features/<feature>/*.feature --project <name>

# Run TDD pipeline
/dna-tdd-frontend:dna-tdd-implement specs/<feature>/*.feature --project <name>
/dna-tdd-backend:dna-tdd-backend apps/backend-e2e/features/<feature>.feature "<scenario>" --project <name>
```
