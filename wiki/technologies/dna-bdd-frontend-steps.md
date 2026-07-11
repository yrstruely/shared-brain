> **Type:** Skill
> **Source:** `.framework/skills/dna-bdd-frontend-steps.md`
> **Related:** [[wiki/technologies/dna-bdd-features|BDD Feature Generator]], [[wiki/technologies/dna-tdd-frontend|Frontend TDD]], [[wiki/technologies/rlm|RLM]]

# Frontend BDD Step Definitions

Generates frontend E2E step definitions from Gherkin features. Includes Playwright steps, MSW handlers, and Pact contracts. Project-agnostic skill ported to use [[wiki/technologies/rlm|RLM]].

---

## Purpose

Bridges Gherkin features to frontend E2E tests with API mocking and contract testing.

## Pipeline

```
Phase 0: Load Project Context (via RLM)
Phase 1: Read Feature Files
Phase 2: Identify Step Patterns
Phase 3: Generate Playwright Steps
Phase 4: Generate MSW Handlers
Phase 5: Generate Pact Contracts
Phase 6: Write Step Definition Files
Phase 7: Validate Against Features
Phase 8: Wire to Test Suite
Phase 9: Summarize + Index
Phase 10: Commit
Phase 11: Update Graphify
```

## Key Outputs

- Playwright step definitions
- MSW mock handlers
- Pact contract tests
- E2E test suite wiring

## Usage

```bash
claude /framework:bdd-frontend-steps --project ip-hub --features features/*.feature
```
