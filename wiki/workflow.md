> **Type:** Reference
> **Source:** `setup-instructions/WORKFLOW.md`
> **Related:** [[wiki/technologies/dna-orchestrator|Orchestrator]], [[.framework/skills/index|Framework Skills]], [[setup-instructions/SETUP_GUIDE|Setup Guide]]

# Project Workflow

Step-by-step guide for building software projects using the Agentic BDD/TDD Development Framework.

---

## Overview

The framework provides a complete development pipeline:

```
Discovery → Design → Scaffold → BDD → TDD → Review → PR
```

The [[wiki/technologies/dna-orchestrator|Orchestrator]] skill detects your current state and routes to the right tool.

## Quick Start

1. **Install skills:** `bash bin/sync-skills.sh`
2. **Initialize project:** Create OKF bundle in `projects/my-project/okf/`
3. **Start building:** `claude /framework:orchestrator --project my-project --feature my-feature`

## Feature Development Example

Building a "User Profile" feature:

| Step | Skill | Output |
|------|-------|--------|
| 1 | `dna-orchestrator` | Detects state, recommends next skill |
| 2 | `dna-bdd-features` | `.feature` files |
| 3 | `dna-bdd-frontend-steps` | Playwright + MSW + Pact |
| 3 | `dna-bdd-backend-steps` | API E2E steps + factories |
| 4 | `dna-domain-entity` | Domain entity + value objects |
| 5 | `dna-api-contracts` | DTOs + frontend API layer |
| 6 | `dna-backend-module` | Handlers + repository + controller |
| 7 | `dna-tdd-frontend` | Vue components + tests |
| 7 | `dna-tdd-backend` | Service + aggregate + tests |
| 8 | `dna-review` | Cleaned code |
| 9 | `dna-pr` | Committed PR |

## Parallel Skills

- **BDD Phase:** Frontend Steps ⟷ Backend Steps (parallel)
- **TDD Phase:** Frontend TDD ⟷ Backend TDD (parallel)

## Greenfield vs Brownfield

| Scenario | Approach |
|----------|----------|
| New project | `dna-orchestrator --greenfield` |
| Existing code | `graphify:index` first, then orchestrator |

## Full Guide

See `setup-instructions/WORKFLOW.md` for the complete workflow with commands, examples, and troubleshooting.
