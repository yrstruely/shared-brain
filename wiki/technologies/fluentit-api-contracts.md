> **Type:** Skill
> **Source:** `.framework/skills/fluentit-api-contracts.md`
> **Related:** [[wiki/technologies/fluentit-backend-module|Backend Module]], [[wiki/technologies/fluentit-frontend-guide|Frontend Guide]], [[wiki/technologies/rlm|RLM]]

# API Contracts

Creates API contract types (DTOs, response types) and frontend API layer for a feature. Pure TypeScript interfaces — no framework dependencies. Uses [[wiki/technologies/rlm|RLM]] for convention discovery.

---

## Purpose

Defines the contract between frontend and backend: request DTOs, response types, and frontend API wiring.

## Pipeline

```
Phase 0: Load Project Context (via RLM)
Phase 1: Read Feature + Domain Design
Phase 2: Identify Endpoints + Operations
Phase 3: Design Request DTOs
Phase 4: Design Response Types
Phase 5: Generate Frontend API Layer
Phase 6: Validate Type Safety
Phase 7: Write Files
Phase 8: Summarize + Index
```

## Key Outputs

- Request/response DTOs
- Frontend API service layer
- Type-safe contract boundaries

## Usage

```bash
claude /framework:api-contracts --project ip-hub --feature user-profile
```
