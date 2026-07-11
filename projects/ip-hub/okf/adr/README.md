# Architecture Decision Records

> Key architectural decisions for IP Hub.

---

## ADR-001: Technology Stack

- **Status:** Accepted
- **Date:** 2026-07-08
- **Context:** Need full-stack framework for IP Hub with complex domain logic
- **Decision:** NestJS (CQRS) + Nuxt 4 + PostgreSQL
- **Consequences:**
  - ✅ Strong TypeScript typing throughout stack
  - ✅ CQRS naturally fits complex IP licensing domain
  - ✅ Vue/Nuxt ecosystem has good IP Hub team familiarity
  - ⚠️ More complex than simple CRUD approach
  - ⚠️ CQRS requires team training

## ADR-002: Database Strategy

- **Status:** Accepted
- **Date:** 2026-07-08
- **Context:** Need transactional consistency for financial/license operations
- **Decision:** PostgreSQL with TypeORM
- **Consequences:**
  - ✅ ACID transactions for critical operations
  - ✅ Good CQRS read model support with materialized views
  - ✅ Team familiarity with PostgreSQL
  - ⚠️ TypeORM can be verbose for complex queries

## ADR-003: Cart Aggregate Design

- **Status:** Proposed
- **Date:** 2026-07-08
- **Context:** Cart is the first bounded context to implement
- **Decision:** Cart as aggregate root with CartItem value objects
- **Consequences:**
  - ✅ Simple boundary to start with
  - ✅ Natural checkout → order flow
  - ⚠️ Pricing rules may need external service

---

## Template

```markdown
## ADR-XXX: Title

- **Status:** Proposed / Accepted / Deprecated / Superseded
- **Date:** YYYY-MM-DD
- **Context:** What is the issue we're deciding?
- **Decision:** What did we decide?
- **Consequences:** What are the trade-offs?
```

---

## Related

- [[projects/ip-hub/okf/index\|IP Hub Overview]]
- [[projects/ip-hub/okf/bounded-contexts/index\|Bounded Contexts]]
- [[.framework/patterns/cqrs-pattern\|CQRS Pattern]]
