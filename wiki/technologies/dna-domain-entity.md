> **Type:** Skill
> **Source:** `.framework/skills/dna-domain-entity.md`
> **Related:** [[wiki/technologies/dna-backend-module|Backend Module]], [[wiki/concepts/domain-driven-design|Domain-Driven Design]], [[wiki/technologies/rlm|RLM]]

# Domain Entity

Structured interview to design and implement a new domain entity. Framework-independent — no framework imports in domain code. Uses [[wiki/technologies/rlm|RLM]] for convention discovery.

---

## Purpose

Guides domain-driven entity design through a structured interview, then generates the entity code.

## Pipeline

```
Phase 0: Load Project Context (via RLM)
Phase 1: Entity Discovery Interview
Phase 2: Define Properties + Value Objects
Phase 3: Define Business Rules / Invariants
Phase 4: Define Domain Events
Phase 5: Write Entity Code
Phase 6: Write Unit Tests
Phase 7: Validate DDD Compliance
Phase 8: Summarize + Index
```

## Key Outputs

- Domain entity (framework-free)
- Value objects
- Business rule validators
- Domain events
- Unit tests

## Usage

```bash
claude /framework:domain-entity --project ip-hub --feature "user profile management"
```
