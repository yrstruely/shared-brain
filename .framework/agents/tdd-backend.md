# TDD Backend Agent (Project-Agnostic)

> Implements backend services/handlers using TDD: **Red → Green → Validate → Clean**. Ported from playbook.

---

## Status

✅ **Ported Template** — 7-phase workflow with DDD + CQRS + ProjectContext.

## Source

Original: `.framework/agents/playbooks/tdd-backend-agents/README.md`

---

## Input

```typescript
interface BackendTDDInput {
  projectName: string;
  featurePath: string;        // Path to .feature file
  scenarioName: string;       // Specific scenario
  shortcut?: 'full' | 'implement' | 'validate' | 'refactor';
  context: ProjectContext;
}
```

---

## 7-Phase Workflow

```
┌─────────────────────────────────────────────┐
│  Phase 1: Red — Generate Failing Tests      │
│  └─→ Unit + integration tests that fail     │
├─────────────────────────────────────────────┤
│  Phase 2: Review Generated Tests            │
│  └─→ User feedback on coverage              │
├─────────────────────────────────────────────┤
│  Phase 3: Green — Implement Code            │
│  └─→ Domain → Infra → App → API layers      │
├─────────────────────────────────────────────┤
│  Phase 4: Validate — Confirm Green          │
│  └─→ DDD validation, regression check       │
├─────────────────────────────────────────────┤
│  Phase 5: Clean — Refactor Code             │
│  └─→ Extract value objects, domain events   │
├─────────────────────────────────────────────┤
│  Phase 6: Validate After Refactoring        │
│  └─→ Full test suite, no regressions        │
├─────────────────────────────────────────────┤
│  Phase 7: Summarize                         │
│  └─→ Report, decisions, next steps          │
└─────────────────────────────────────────────┘
```

---

## Execution

### Phase 0: Load Context

```typescript
const context = await loadProjectContext(projectName);
const { techStack, paths, domain } = context.project;

// Query Graphify for domain entities
const entities = await graphify.query(`
  MATCH (e:DomainEntity)
  WHERE e.project = $project
  RETURN e
`, { project: projectName });

// Query Wiki for backend patterns
const patterns = await wiki.query(`
  Find patterns for: ${techStack.backend.framework} ${techStack.backend.architecture}
`);
```

### Phase 1: Red — Generate Failing Tests

Generate tests per layer:

| Layer | Test Type | Target |
|-------|-----------|--------|
| Domain | Unit | Value objects, entities, domain events |
| Infrastructure | Unit | ORM entities, mappers, repositories |
| Application | Unit | Command/query handlers, DTOs |
| API | Integration | Controllers, endpoints |

### Phase 2: Review Tests

User review for:
- Edge case coverage
- DDD compliance (value objects, entities)
- CQRS separation (commands vs queries)

### Phase 3: Green — Implement Code

Layer-by-layer implementation:

```
Domain Layer
  └─→ Value objects, entities, repository interfaces, events
Infrastructure Layer
  └─→ ORM entities, mappers, repository implementations
Application Layer
  └─→ Commands, queries, handlers, DTO mappers
API Layer
  └─→ Controllers, module registration
```

Architecture depends on `context.project.techStack.backend.architecture`:

| Architecture | Patterns |
|--------------|----------|
| CQRS | Commands, queries, event bus, read/write separation |
| MVC | Controllers, services, repositories |
| Hexagonal | Ports, adapters, domain-centric |

### Phase 4: Validate

DDD compliance checks:
- ✅ Handlers use `@Inject(IRepository)` not `@InjectRepository`
- ✅ Value objects for all status/type fields
- ✅ Domain entities have behavior (not anemic)
- ✅ No imports from `test/` in production code
- ✅ UUID identifiers (not numeric/string)

### Phase 5: Clean — Refactor

Refactoring targets:
- Primitive obsession → value objects
- Anemic → rich domain model
- Domain event extraction
- Specification pattern for complex queries
- Handler simplification (extract domain services)

### Phase 6: Validate After Refactoring

Full test suite + regression check.

### Phase 7: Summarize

Report: files created, decisions, coverage, next steps.

---

## Stack Support

| Framework | Architecture | Testing | Status |
|-----------|--------------|---------|--------|
| NestJS | CQRS | Jest | ✅ Target |
| NestJS | MVC | Jest | ⏳ Future |
| Django | — | pytest | ⏳ Future |
| Express | MVC | Jest | ⏳ Future |

---

## Commands

```bash
# Full workflow
/fluentit-tdd-backend:fluentit-tdd-backend apps/backend-e2e/features/<feature>.feature "<scenario>" --project ip-hub

# Shortcuts
/fluentit-tdd-backend:fluentit-tdd-backend ... --shortcut=implement --project ip-hub
/fluentit-tdd-backend:fluentit-tdd-backend ... --shortcut=validate --project ip-hub
/fluentit-tdd-backend:fluentit-tdd-backend ... --shortcut=refactor --project ip-hub
```

---

## Changes from Original Playbook

| Aspect | Original | Ported |
|--------|----------|--------|
| Paths | `apps/ip-hub-backend/` | `context.project.paths.backend` |
| Framework | Hardcoded NestJS/CQRS | `context.project.techStack.backend` |
| Domain | IP Hub bounded contexts | `context.project.domain` |
| Entities | Patent/Trademark/Copyright | Loaded from Graphify |
| DDD rules | Hardcoded | `context.project.patterns.ddd` |
| Test runner | Jest | `context.project.techStack.backend.testing` |
| Context loading | Manual file reads | RLM `loadProjectContext()` |
| Entity discovery | File grepping | Graphify queries |

---

## Output

- Domain: `libs/domain/src/` or `src/domain/`
- Infrastructure: `app/{domain}/infrastructure/` or `src/infrastructure/`
- Application: `app/{domain}/` or `src/application/`
- API: `bffe/` or `src/api/`
- Tests: `*.spec.ts`, `*.integration.spec.ts`
