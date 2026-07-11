> **Type:** Skill
> **Source:** `.framework/skills/dna-tdd-backend.md`
> **Related:** [[wiki/technologies/dna-bdd-backend-steps|BDD Backend Steps]], [[wiki/technologies/rlm|RLM]], [[wiki/patterns/tdd-red-green-clean|TDD Red-Green-Clean]]

# Backend TDD Implementation

**Red → Green → Validate → Clean** cycle for backend features with CQRS and DDD. Project-agnostic skill ported to use [[wiki/technologies/rlm|RLM]] for context loading.

---

## Purpose

Implements backend features from BDD specs using TDD cycles within CQRS/DDD architecture.

## Pipeline

```
Phase 0: Load Project Context (via RLM)
Phase 1: Read Feature + Backend Steps
Phase 2: Identify Aggregate/Service Scope
Phase 3: Write Failing Tests (RED)
Phase 4: Implement Minimal Code (GREEN)
Phase 5: CQRS + DDD Validation
Phase 6: Refactor (CLEAN)
Phase 7: Update Backend Step Definitions
```

## Key Outputs

- Aggregate / service implementation
- Unit + integration tests
- Command/query handlers
- Updated backend step definitions

## Usage

```bash
claude /framework:tdd-backend --project ip-hub --feature features/dashboard.feature
```

---

## Agent Architecture

```typescript
interface BackendTDDInput {
  feature: Feature;
  steps: StepDefinition[];
  context: ProjectContext;
  servicePath: string;
  testPath: string;
}

async function implementBackend(input: BackendTDDInput): Promise<Implementation> {
  // 1. Query graph for domain entities
  const entities = await graphify.query(`
    MATCH (e:DomainEntity)
    WHERE e.project = $project
    AND e.feature = $feature
    RETURN e
  `, { project: input.context.project.name, feature: input.feature.name });

  // 2. Load CQRS patterns from wiki
  const patterns = await wiki.query(`
    Find patterns for: NestJS CQRS
  `);

  // 3. Generate failing test (RED)
  const test = await generateTest({ feature: input.feature, entities, patterns });

  // 4. Generate command/query handler (GREEN)
  const handler = await generateHandler({ test, entities, patterns });

  // 5. Refactor (CLEAN)
  const refactored = await refactor({ handler, patterns });

  return { test, implementation: refactored };
}
```

---

## TDD Cycle Verification

After each implementation, verify:

1. **RED** — Test fails with meaningful error
2. **GREEN** — Test passes with minimal implementation
3. **CLEAN** — Refactored, no duplication, follows patterns

```bash
npm test -- --watchAll=false
# Should show: PASS for new tests, no regressions
```
