---
description: Step-by-step workflow for building projects using the Agentic BDD/TDD Development Framework.
---

# Project Workflow

> How to use the framework to build software projects from scratch using AI-augmented BDD/TDD.

---

## Overview

This framework provides a **complete development pipeline** from requirements to production:

```
Discovery → Design → Scaffold → BDD → TDD → Review → PR
```

Each phase has dedicated skills. The [[wiki/technologies/fluentit-orchestrator|Orchestrator]] skill detects where you are and routes to the right tool.

---

## Prerequisites

Before starting a project, ensure:

1. **Claude Code skills installed:**
   ```bash
   bash bin/sync-skills.sh
   ```

2. **Obsidian CLI available:**
   ```bash
   Obsidian.com --version
   ```

3. **Graphify built:**
   ```bash
   cd .framework/external/graphify-minimal
   npm install && npm run build
   ```

---

## Phase 1: Project Setup

### 1.1 Initialize Project OKF

Every project needs an **OKF (Obsidian Knowledge Format)** bundle:

```bash
# Create project structure
mkdir -p projects/my-project/okf
mkdir -p projects/my-project/sources/prds
mkdir -p projects/my-project/src/frontend
mkdir -p projects/my-project/src/backend
```

### 1.2 Write Project Config

Create `projects/my-project/okf/index.md`:

```markdown
---
name: my-project
type: nestjs-vue
techStack:
  frontend: vue3
  backend: nestjs
  database: postgresql
  orm: typeorm
paths:
  frontend: src/frontend
  backend: src/backend
  domain: src/domain
  features: features/
  specs:
    frontend: specs/frontend
    backend: specs/backend
  tests:
    unit: test/unit
    integration: test/integration
    e2e: test/e2e
---

# My Project

Brief description of the project.
```

### 1.3 Index the Project

```bash
# Index code relationships
claude /graphify:index --project my-project
```

---

## Phase 2: Feature Development (End-to-End Example)

Let's build a **"User Profile"** feature.

### Step 1: Start with the Orchestrator

```bash
claude /framework:orchestrator --project my-project --feature user-profile
```

The orchestrator detects nothing exists yet and recommends:

```
📋 Detected State:
  ❌ No specs
  ❌ No features
  ❌ No steps
  ❌ No implementation

Recommended: fluentit-bdd-features
```

### Step 2: Generate BDD Features

```bash
claude /framework:bdd-features --project my-project --specs specs/frontend/user-profile/
```

**Output:**
- `features/user-profile.feature` — Gherkin scenarios
- `features/step-definitions/user-profile.steps.ts` — Stubs

### Step 3: Generate Step Definitions (Parallel)

```bash
# Terminal 1 — Frontend
claude /framework:bdd-frontend-steps --project my-project --features features/user-profile.feature

# Terminal 2 — Backend (can run simultaneously)
claude /framework:bdd-backend-steps --project my-project --features features/user-profile.feature
```

**Output:**
- Frontend: Playwright steps + MSW handlers + Pact contracts
- Backend: API E2E steps + database factories

### Step 4: Implement Domain Entity

If the feature introduces a new domain concept:

```bash
claude /framework:domain-entity --project my-project --feature "user profile"
```

**Output:**
- `src/domain/entities/user-profile.ts`
- `src/domain/value-objects/...`
- Unit tests

### Step 5: Define API Contracts

```bash
claude /framework:api-contracts --project my-project --feature user-profile
```

**Output:**
- `src/contracts/user-profile.dto.ts`
- Frontend API service layer

### Step 6: Scaffold Backend Module

```bash
claude /framework:backend-module --project my-project --feature user-profile
```

**Output:**
- Command/query handlers
- Repository + ORM mapper
- Controller / resolver

### Step 7: Implement Frontend (Parallel with Backend)

```bash
# Terminal 1 — Frontend TDD
claude /framework:tdd-frontend --project my-project --feature features/user-profile.feature

# Terminal 2 — Backend TDD
claude /framework:tdd-backend --project my-project --feature features/user-profile.feature
```

**Output:**
- Frontend: Vue components, composables, stores, tests
- Backend: Service implementation, aggregate, handlers, tests

### Step 8: Code Review

```bash
claude /framework:review --project my-project
```

**Cleans up:**
- AI artifacts
- Verbose comments
- Over-engineered patterns

### Step 9: Pull Request

```bash
claude /framework:pr --project my-project --ticket PROJ-123
```

**Executes:**
- Commit with conventional message
- Version bump
- Push
- Create PR
- Update ticket

---

## Phase 3: Post-Development

### Index Updated Code

```bash
claude /graphify:index --project my-project
```

### Update Wiki

Log what was built:

```bash
claude /wiki:ingest projects/my-project/sources/prds/user-profile.md
```

---

## Skill Reference by Phase

| Phase | Skill | When to Use |
|-------|-------|-------------|
| **Discovery** | `fluentit-domain-entity` | New domain concept needed |
| **Design** | `fluentit-api-contracts` | API surface changes |
| **Scaffold** | `fluentit-backend-module` | New backend feature |
| **Scaffold** | `fluentit-frontend-guide` | New frontend feature |
| **BDD** | `fluentit-bdd-features` | Convert specs to Gherkin |
| **BDD** | `fluentit-bdd-frontend-steps` | Frontend E2E glue |
| **BDD** | `fluentit-bdd-backend-steps` | Backend E2E glue |
| **TDD** | `fluentit-tdd-frontend` | Implement frontend |
| **TDD** | `fluentit-tdd-backend` | Implement backend |
| **Review** | `fluentit-review` | Clean AI-generated code |
| **PR** | `fluentit-pr` | Commit and create PR |
| **Meta** | `fluentit-orchestrator` | Don't know where to start |

---

## Parallelization Guide

Skills that can run simultaneously:

```
Phase: BDD
├── fluentit-bdd-frontend-steps  ⎫
└── fluentit-bdd-backend-steps   ⎭ Parallel

Phase: TDD
├── fluentit-tdd-frontend        ⎫
└── fluentit-tdd-backend         ⎭ Parallel

Phase: Discovery
├── fluentit-domain-entity       ⎫
└── fluentit-api-contracts       ⎭ Sequential (contracts depend on entity)
```

---

## Greenfield vs Brownfield

### Greenfield (New Project)

```bash
# 1. Set up project OKF
# 2. Run orchestrator with --greenfield flag
claude /framework:orchestrator --project my-project --feature dashboard --greenfield
```

### Brownfield (Existing Project)

```bash
# 1. Index existing code
claude /graphify:index --project my-project

# 2. Let orchestrator detect current state
claude /framework:orchestrator --project my-project --feature dashboard
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Project not initialized" | Run `claude /framework:init-project --name my-project` |
| "OKF not found" | Check `projects/my-project/okf/index.md` exists |
| "Skill not found" | Run `bash bin/sync-skills.sh` |
| "Graphify not built" | `cd .framework/external/graphify-minimal && npm run build` |
| "Tests fail after TDD" | Run `fluentit-review` then re-run tests |

---

## See Also

- [[.framework/skills/index|Framework Skills Registry]] — Full skill documentation
- [[.framework/skills/fluentit-orchestrator|Project Orchestrator]] — Meta-skill that routes to correct tool
- [[wiki/technologies/index|Technologies Index]] — Tech evaluations and comparisons
- [[setup-instructions/SETUP_GUIDE|Setup Guide]] — Initial framework installation
