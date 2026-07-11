> **Type:** Skill
> **Source:** `.framework/skills/dna-orchestrator.md`
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
| No specs/features | `dna-bdd-features` | BDD |
| Features exist, no steps | `dna-bdd-frontend-steps` + `dna-bdd-backend-steps` | BDD |
| Steps exist, no implementation | `dna-tdd-frontend` + `dna-tdd-backend` | TDD |
| Implementation exists, raw | `dna-review` | Review |
| Code clean, uncommitted | `dna-pr` | PR |
| New domain concept | `dna-domain-entity` | Discovery |
| New API surface | `dna-api-contracts` | Discovery |

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
| [[technologies/dna-domain-entity|dna-domain-entity]] | Discovery | No | — |
| [[technologies/dna-api-contracts|dna-api-contracts]] | Discovery | No | Domain Entity |
| [[technologies/dna-backend-module|dna-backend-module]] | Scaffold | No | API Contracts |
| [[technologies/dna-frontend-guide|dna-frontend-guide]] | Scaffold | No | API Contracts |
| [[technologies/dna-bdd-features|dna-bdd-features]] | BDD | No | — |
| [[technologies/dna-bdd-frontend-steps|dna-bdd-frontend-steps]] | BDD | Yes | BDD Features |
| [[technologies/dna-bdd-backend-steps|dna-bdd-backend-steps]] | BDD | Yes | BDD Features |
| [[technologies/dna-tdd-frontend|dna-tdd-frontend]] | TDD | Yes | BDD Frontend Steps |
| [[technologies/dna-tdd-backend|dna-tdd-backend]] | TDD | Yes | BDD Backend Steps |
| [[technologies/dna-review|dna-review]] | Review | No | TDD Frontend + Backend |
| [[technologies/dna-pr|dna-pr]] | PR | No | Code Review |
