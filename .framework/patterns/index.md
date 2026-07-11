# Framework Patterns

> Reusable design and implementation patterns extracted from projects and sources.

---

## Pattern Catalog

### [[.framework/patterns/repository-pattern\|Repository with Unit of Work]]
Abstract data access with transaction boundary management.

### [[.framework/patterns/cqrs-pattern\|CQRS Command/Query Separation]]
Separate read and write models for complex domains.

### [[.framework/patterns/aggregate-root\|Aggregate Root]]
Consistency boundary for domain entities.

### [[.framework/patterns/domain-events\|Domain Events]]
Decoupled communication between bounded contexts.

### [[.framework/patterns/pact-contract-testing\|Pact Contract Testing]]
Consumer-driven contract testing for microservices.

---

## Pattern Template

Each pattern follows this structure:

```markdown
# Pattern Name

> One-line description

## Context
When to use this pattern.

## Problem
What problem does it solve?

## Solution
How does it solve it?

## Implementation
Code example.

## Consequences
Pros and cons.

## Related Patterns
- [[Pattern A]]
- [[Pattern B]]

## Projects Using This Pattern
- [[projects/ip-hub/okf/index\|IP Hub]]
```

---

## Adding Patterns

1. Create new file in `.framework/patterns/`
2. Follow pattern template
3. Link from [[.framework/registry/pattern-catalog\|Pattern Catalog]]
4. Ingest into wiki via `/wiki:ingest .framework/patterns/`

---

## Cross-Reference

Patterns are linked from:
- [[wiki/patterns/index\|Wiki Patterns]] (auto-generated)
- Project OKF bundles (`projects/{name}/okf/`)
- Agent skill definitions (`.framework/skills/`)
