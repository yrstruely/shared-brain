# Pattern Catalog

> Registry of all framework patterns with cross-project usage tracking.

---

## Patterns

| ID | Pattern | Category | Projects | Status |
|----|---------|----------|----------|--------|
| P1 | [[.framework/patterns/repository-pattern\|Repository with Unit of Work]] | Data Access | IP Hub | ✅ Active |
| P2 | [[.framework/patterns/cqrs-pattern\|CQRS Command/Query Separation]] | Architecture | IP Hub | ✅ Active |
| P3 | [[.framework/patterns/aggregate-root\|Aggregate Root]] | Domain | IP Hub | ✅ Active |
| P4 | [[.framework/patterns/domain-events\|Domain Events]] | Communication | IP Hub | ✅ Active |
| P5 | [[.framework/patterns/pact-contract-testing\|Pact Contract Testing]] | Testing | IP Hub | ✅ Active |

---

## By Category

### Data Access
- [[.framework/patterns/repository-pattern\|P1: Repository with Unit of Work]]

### Architecture
- [[.framework/patterns/cqrs-pattern\|P2: CQRS Command/Query Separation]]

### Domain
- [[.framework/patterns/aggregate-root\|P3: Aggregate Root]]
- [[.framework/patterns/domain-events\|P4: Domain Events]]

### Testing
- [[.framework/patterns/pact-contract-testing\|P5: Pact Contract Testing]]

---

## By Project

### [[projects/ip-hub/okf/index\|IP Hub]]
Uses: P1, P2, P3, P4, P5

---

## Cross-Project Reuse

| Pattern | Project Count | Reuse % |
|---------|---------------|---------|
| Repository with Unit of Work | 1 | — |
| CQRS Command/Query Separation | 1 | — |
| Aggregate Root | 1 | — |
| Domain Events | 1 | — |
| Pact Contract Testing | 1 | — |

*Reuse percentage will grow as more projects are added. Target: 40% within 3 months.*

---

## Adding Patterns

1. Create pattern file in `.framework/patterns/`
2. Add entry to this catalog
3. Link from [[wiki/patterns/index\|Wiki Patterns]]
4. Ingest via `/wiki:ingest .framework/patterns/`
