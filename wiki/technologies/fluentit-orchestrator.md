> **Type:** Skill
> **Source:** `.framework/skills/fluentit-orchestrator.md`
> **Related:** All [[wiki/technologies/index#Framework Skills|framework skills]], [[wiki/technologies/rlm|RLM]], [[wiki/technologies/graphify|Graphify]]

# Project Orchestrator

Detects project state, determines the next skill to run, and sequences the full development pipeline. The **conductor** of the framework.

---

## Purpose

Instead of manually choosing which skill to run, the orchestrator:
1. Loads project context via [[wiki/technologies/rlm|RLM]]
2. Detects what already exists (specs, features, steps, tests, implementation)
3. Recommends or executes the next appropriate skill(s)
4. Handles dependencies and parallelization

## Pipeline

```
Phase 0: Load Project Context (via RLM)
Phase 1: Determine Pipeline Stage (state detection)
Phase 2: Skill Selection Logic
Phase 3: Execute or Recommend (interactive / autopilot / plan-only)
Phase 4: Dependency Resolution
Phase 5: Post-Skill Update (graphify + wiki)
```

## Development Lifecycle

```
[Goal] → [Discovery] → [Design] → [Scaffold] → [BDD] → [TDD] → [Review] → [PR]

Discovery:    Domain Entity (interview) → API Contracts
Scaffold:     Backend Module → Frontend Guide setup
BDD:          Features → Frontend Steps → Backend Steps
TDD:          Frontend TDD → Backend TDD
Review:       Code Review (AI cleanup)
PR:           Pull Request Workflow
```

## State Detection

| Detected State | Next Skill | Phase |
|---|---|---|
| No specs/features | `fluentit-bdd-features` | BDD |
| Features exist, no steps | `fluentit-bdd-frontend-steps` + `fluentit-bdd-backend-steps` | BDD |
| Steps exist, no implementation | `fluentit-tdd-frontend` + `fluentit-tdd-backend` | TDD |
| Implementation exists, raw | `fluentit-review` | Review |
| Code clean, uncommitted | `fluentit-pr` | PR |
| New domain concept | `fluentit-domain-entity` | Discovery |
| New API surface | `fluentit-api-contracts` | Discovery |

## Usage

```bash
# Interactive — detect and recommend
claude /framework:orchestrator --project ip-hub

# Work on specific feature
claude /framework:orchestrator --project ip-hub --feature user-profile

# Plan only (dry run)
claude /framework:orchestrator --project ip-hub --feature user-profile --plan

# Autopilot (execute without confirmation)
claude /framework:orchestrator --project ip-hub --feature user-profile --auto
```

## Skill Registry

| Skill | Phase | Can Parallel | Depends On |
|-------|-------|-------------|------------|
| [[technologies/fluentit-domain-entity|fluentit-domain-entity]] | Discovery | No | — |
| [[technologies/fluentit-api-contracts|fluentit-api-contracts]] | Discovery | No | Domain Entity |
| [[technologies/fluentit-backend-module|fluentit-backend-module]] | Scaffold | No | API Contracts |
| [[technologies/fluentit-frontend-guide|fluentit-frontend-guide]] | Scaffold | No | API Contracts |
| [[technologies/fluentit-bdd-features|fluentit-bdd-features]] | BDD | No | — |
| [[technologies/fluentit-bdd-frontend-steps|fluentit-bdd-frontend-steps]] | BDD | Yes | BDD Features |
| [[technologies/fluentit-bdd-backend-steps|fluentit-bdd-backend-steps]] | BDD | Yes | BDD Features |
| [[technologies/fluentit-tdd-frontend|fluentit-tdd-frontend]] | TDD | Yes | BDD Frontend Steps |
| [[technologies/fluentit-tdd-backend|fluentit-tdd-backend]] | TDD | Yes | BDD Backend Steps |
| [[technologies/fluentit-review|fluentit-review]] | Review | No | TDD Frontend + Backend |
| [[technologies/fluentit-pr|fluentit-pr]] | PR | No | Code Review |
