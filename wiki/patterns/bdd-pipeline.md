> **Type:** Pattern
> **Source:** `.framework/skills/dna-bdd-features.md`
> **Related:** [[wiki/patterns/tdd-red-green-clean|TDD Red-Green-Clean]], [[wiki/concepts/project-context|ProjectContext]]

# BDD Pipeline

The **BDD Pipeline** is a structured workflow for transforming requirements into executable specifications (Gherkin feature files). It is the **entry point** of the full BDD→TDD development cycle.

---

## Overview

```
PRDs / Specs / Requirements
    ↓
BDD Feature Generator (8 phases)
    ↓
Gherkin .feature files
    ↓
BDD Frontend Steps → Playwright step definitions + MSW mocks
BDD Backend Steps  → NestJS/Axios step definitions + factories
    ↓
TDD Frontend → Vue/React components (Red→Green→Clean)
TDD Backend  → CQRS handlers (Red→Green→Clean)
    ↓
Graphify Index → Code relationships stored
```

---

## The 8 Phases

### Phase 0: Load ProjectContext
Load project config, domain knowledge, existing features via RLM.

### Phase 1: Detect Spec Type
Auto-detect from folder contents:

| Spec Type | Folders Found | Output |
|-----------|--------------|--------|
| **UI** | `UI/` or `Detailed Specs/` | Frontend-only features |
| **Technical** | `Architecture/` only | Backend-only features |
| **Combined** | `UI/` + `Architecture/` | Full-stack features |

### Phase 2: Generate Frontend Features
Convert visual/written specs into declarative Gherkin scenarios.

### Phase 3: Refactor Frontend Features
User review and refinement.

### Phase 4: Generate Non-Functional Features
Performance, security, accessibility requirements.

### Phase 5: Refactor Non-Functional Features
User review and refinement.

### Phase 6: Generate Backend Features
Convert architecture specs into API-focused Gherkin scenarios.

### Phase 7: Refactor Backend Features
User review and refinement.

### Phase 8: Summarize and Index
Document + update Graphify + extract patterns to wiki.

---

## Gherkin Best Practices

### Declarative Style

❌ **Imperative (avoid):**
```gherkin
When I type "user@example.com" in the email field
And I type "password" in the password field
And I press "Submit"
```

✅ **Declarative (prefer):**
```gherkin
When Alice logs in with her valid credentials
```

### Feature Structure

```gherkin
@[feature-tag]
Feature: Feature Name
  In order to business value
  As a user role
  I want to capability

  Background:
    Given common precondition

  Rule: Business rule 1
    @frontend
    Scenario: Happy path
      Given context
      When action
      Then outcome

  Rule: Business rule 2
    ...

# Gaps Identified:
# 1. [Gap description]
```

---

## Tag Strategy

| Tag | Usage |
|-----|-------|
| `@frontend` | UI/UX scenarios |
| `@backend` | API/business logic |
| `@integration` | End-to-end |
| `@architecture-aligned` | Matches architecture spec |
| `@nfr` | Non-functional requirements |
| `@wip` | Work in progress |

---

## Spec Type Detection

```
specs/frontend/my-feature/
├── UI/                    → UI spec detected
│   ├── screenshot.png
│   └── figma.fig
├── Detailed Specs/        → Detailed specs detected
│   └── requirements.md
└── Architecture/          → Architecture spec detected
    └── cqrs-contract.md
```

| UI | Architecture | Result |
|----|-------------|--------|
| ✅ | ✅ | Combined |
| ❌ | ✅ | Technical |
| ✅ | ❌ | UI |

---

## Related

- [[wiki/patterns/tdd-red-green-clean|TDD Red-Green-Clean]] — What happens after features are generated
- [[technologies/dna-bdd-features|dna-bdd-features]]
- [[technologies/dna-bdd-frontend-steps|dna-bdd-frontend-steps]]
- [[technologies/dna-bdd-backend-steps|dna-bdd-backend-steps]]
