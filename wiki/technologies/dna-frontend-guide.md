> **Type:** Skill
> **Source:** `.framework/skills/dna-frontend-guide.md`
> **Related:** [[wiki/technologies/dna-tdd-frontend|Frontend TDD]], [[wiki/technologies/dna-api-contracts|API Contracts]], [[wiki/technologies/rlm|RLM]]

# Frontend Development Guide

Guides frontend feature implementation from requirements to delivery. Adapts to project's frontend framework and conventions. Uses [[wiki/technologies/rlm|RLM]] for context loading.

---

## Purpose

Orchestrates the full frontend development cycle: from BDD features to component implementation to styling.

## Pipeline

```
Phase 0: Load Project Context (via RLM)
Phase 1: Read Feature + Design
Phase 2: Plan Component Hierarchy
Phase 3: Implement Core Components
Phase 4: Implement State Management
Phase 5: Wire API Contracts
Phase 6: Accessibility Check
Phase 7: Style + Polish
Phase 8: Write Tests
Phase 9: Summarize + Index
```

## Key Outputs

- Component hierarchy
- Store / composable implementation
- Styled UI components
- Accessibility compliance
- Unit + integration tests

## Usage

```bash
claude /framework:frontend-guide --project ip-hub --feature features/dashboard.feature
```
