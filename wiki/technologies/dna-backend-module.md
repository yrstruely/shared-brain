> **Type:** Skill
> **Source:** `.framework/skills/dna-backend-module.md`
> **Related:** [[wiki/technologies/dna-domain-entity|Domain Entity]], [[wiki/technologies/dna-api-contracts|API Contracts]], [[wiki/technologies/rlm|RLM]]

# Backend Module

Creates the full backend module for a feature based on DESIGN.md Phases 1+2. Adapts to project architecture (CQRS, MVC, Hexagonal). Uses [[wiki/technologies/rlm|RLM]] for convention discovery.

---

## Purpose

Scaffolds application layer (handlers, controllers) and infrastructure layer (ORM, mappers, repositories) from a domain design.

## Pipeline

```
Phase 0: Load Project Context (via RLM)
Phase 1: Read DESIGN.md Phases 1+2
Phase 2: Identify Architecture Pattern
Phase 3: Create Application Layer
Phase 4: Create Infrastructure Layer
Phase 5: Wire Dependency Injection
Phase 6: Write Tests
Phase 7: Validate Against Domain
Phase 8: Summarize + Index
```

## Key Outputs

- Command/query handlers
- Controllers / resolvers
- Repository implementations
- ORM mappers
- Module wiring

## Usage

```bash
claude /framework:backend-module --project ip-hub --feature user-profile
```
