> **Type:** Skill
> **Source:** `.framework/skills/fluentit-bdd-backend-steps.md`
> **Related:** [[wiki/technologies/fluentit-bdd-features|BDD Feature Generator]], [[wiki/technologies/fluentit-tdd-backend|Backend TDD]], [[wiki/technologies/rlm|RLM]]

# Backend BDD Step Definitions

Generates backend E2E step definitions from Gherkin features. Uses API testing, database factories, and DDD compliance checks. Project-agnostic skill ported to use [[wiki/technologies/rlm|RLM]].

---

## Purpose

Bridges Gherkin features to backend E2E tests with database factories and API validation.

## Pipeline

```
Phase 0: Load Project Context (via RLM)
Phase 1: Read Feature + Backend Steps
Phase 2: Identify API + Database Patterns
Phase 3: Generate Step Definitions
Phase 4: Generate Database Factories
Phase 5: Write Support Files
Phase 6: Validate Against Features
Phase 7: Summarize + Index
```

## Key Outputs

- Backend E2E step definitions
- Database factory fixtures
- API test support files
- DDD compliance validation

## Usage

```bash
claude /framework:bdd-backend-steps --project ip-hub --features test/e2e/features/*.feature
```
