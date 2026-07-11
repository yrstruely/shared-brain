---
description: Project-agnostic TDD implementation for backend features with CQRS and DDD. Uses RLM for context loading and Graphify for code discovery.
argument-hint: Provide the feature file path, scenario name, and project name
---

# Backend TDD Implementation (Project-Agnostic)

> Red → Green → Validate → Clean cycle for backend features. Ported from playbook to use ProjectContext and RLM.

---

## Phase 0: Load Project Context

**Goal:** Load project configuration, tech stack, domain context, and existing code via RLM.

**Actions:**

1. **Load ProjectContext via RLM**

   ```typescript
   const context = await loadProjectContext(projectName);
   const { project, projectType, graph, wiki } = context;
   ```

2. **Validate project is initialized**

   Check `projects/${projectName}/okf/index.md` exists.
   If not: prompt user to run `/framework:init-project --name ${projectName}`.

3. **Resolve paths from ProjectContext**

   ```typescript
   const paths = {
     backend: project.paths.backend,
     domain: project.paths.domain,
     features: project.paths.features,
     specs: project.paths.specs.backend,
     tests: {
       unit: project.paths.tests?.unit || `${project.paths.backend}/test/unit`,
       integration: project.paths.tests?.integration || `${project.paths.backend}/test/integration`,
       e2e: project.paths.tests?.e2e || `${project.paths.backend}/test/e2e`
     }
   };
   ```

4. **Load tech stack config**

   ```typescript
   const techStack = project.techStack.backend;
   // techStack.framework — e.g., 'nestjs'
   // techStack.architecture — e.g., 'cqrs'
   // techStack.database — e.g., 'postgresql'
   // techStack.testing — e.g., 'jest'
   ```

5. **Query Graphify for existing entities**

   ```typescript
   const existingEntities = await graphify.query(`
     MATCH (e:DomainEntity) WHERE e.project = $project RETURN e
   `, { project: projectName });

   const existingFeatures = await graphify.query(`
     MATCH (f:Feature) WHERE f.project = $project RETURN f
   `, { project: projectName });
   ```

6. **Query Wiki for backend patterns**

   ```typescript
   const patterns = await wiki.query(`
     Find backend patterns for: ${techStack.framework} ${techStack.architecture}
     Find DDD patterns for: ${project.type}
   `);
   ```

7. **Load domain context**

   ```typescript
   const domain = project.domain;
   // domain.assetTypes, .jurisdictions, .currency, .userRoles, etc.
   ```

8. **Report to user**

   - Project: `${projectName}` (${project.type})
   - Tech: `${techStack.framework}` + `${techStack.architecture}`
   - Existing entities: `${existingEntities.length}`
   - Existing features: `${existingFeatures.length}`
   - Confirm before proceeding

---

## Phase 1: Red — Generate Failing Tests

**Goal:** Analyze the BDD scenario and generate comprehensive tests that fail.

**Agent:** `tdd-red-test-generator`

**Actions:**

1. Create todo list with all phases
2. Read the feature file from `{paths.tests.e2e}/features/`
3. Analyze the scenario
4. If requirements unclear, ask user:
   - What backend components are needed?
   - What API endpoints?
   - What domain entities are involved?
5. Generate unit tests for:
   - Value objects (validation, equality)
   - Domain entities (business logic)
   - Handlers (with interface mocks)
   - Mappers (Domain↔ORM, Domain→DTO)
6. Generate integration tests for:
   - API endpoints with real database
   - Authentication/authorization
   - Validation errors
7. Generate/update test factories
8. Run tests to confirm Red state

**Stack-agnostic test locations:**
```typescript
// Unit tests
`${paths.tests.unit}/<<domain>>/<<entity>>.handler.spec.ts`

// Integration tests  
`${paths.tests.integration}/<<feature>>.integration.spec.ts`

// Factories
`${paths.tests.e2e}/support/factories/<<entity>>.factory.ts`
```

9. Summarize generated tests and confirm with user
10. **Wait for user review before proceeding**

---

## Phase 2: Review Generated Tests

**Goal:** Refine tests based on user feedback.

**CRITICAL:** Do not skip. Test quality is essential.

**Actions:**

1. Review generated test files with user
2. Incorporate feedback, clarify ambiguities
3. Identify missing edge cases
4. Confirm final test suite
5. **Wait for approval before proceeding**

---

## Phase 3: Green — Implement Code

**Goal:** Implement minimal code to make all failing tests pass.

**Agent:** `tdd-green-implementer`

**Actions:**

1. Create todo list for implementation
2. Implement in strict DDD layer order:

   **Domain Layer** (`{paths.domain}/`):
   - Value objects (type, status)
   - Domain entity
   - Repository interface with Symbol token
   - Domain events (if needed)
   - Export from index.ts

   **Infrastructure Layer** (`{paths.backend}/<<domain>>/infrastructure/`):
   - ORM entity
   - Domain↔ORM mapper
   - Repository implementation
   - Add entity to test-database.ts

   **Application Layer** (`{paths.backend}/<<domain>>/`):
   - Command/Query classes
   - Handlers (using `@Inject(IRepository)`)
   - Domain→DTO mapper

   **API Layer** (`{paths.backend}/bffe/` or controller path):
   - Controller endpoints
   - Module registration
   - AppModule import

3. **Architecture compliance** (stack-specific):

   ```typescript
   const validations = projectType.validations.backend;
   // For NestJS/CQRS:
   // - Handlers use @Inject(IRepository) NOT @InjectRepository
   // - Value objects for all status/type fields
   // - Domain entities have behavior (not anemic)
   // - No imports from test/ in production code
   // - UUID identifiers (not numeric/string)
   ```

4. Run unit tests after each layer — fix failures before proceeding
5. Run integration tests after API layer complete
6. Summarize implementation and confirm with user
7. **Wait for approval before proceeding**

---

## Phase 4: Validate — Confirm Green Status

**Goal:** Validate all tests pass and DDD architecture is correct.

**Agent:** `tdd-green-validator`

**Actions:**

1. Pre-validation checks:

   ```bash
   {context.project.commands.typecheck}
   {context.project.commands.lint}
   ```

2. Validate DDD architecture:
   - Domain entities have no framework dependencies
   - Value objects have validation in constructors
   - Handlers use `@Inject(IRepository)` NOT `@InjectRepository`
   - No imports from `test/` in production code

3. Run all test suites:

   ```bash
   {context.project.commands.test} --testPathPattern="<<DOMAIN>>"
   {context.project.commands.testIntegration} --testPathPattern="<<FEATURE>>"
   {context.project.commands.testE2e} -- --name "<<SCENARIO>>"
   ```

4. Run regression tests:

   ```bash
   {context.project.commands.test}
   {context.project.commands.testIntegration}
   ```

5. Generate validation report
6. If failures: return to Phase 3
7. **Wait for user decision:**
   - Proceed to Phase 5 (refactoring)
   - Skip to Phase 7 (summarize)

---

## Phase 5: Clean — Refactor Code (Optional)

**Goal:** Improve code quality while maintaining test compliance.

**CRITICAL:** Only proceed if user approved. All tests must pass.

**Agent:** `tdd-clean-refactorer`

**Actions:**

1. Establish pre-refactor baseline (all tests passing)
2. Analyze code for refactoring opportunities:
   - Handler simplification (extract to domain services)
   - Primitive obsession → value objects
   - Anemic → rich domain model
   - Extract domain events
   - Specification pattern for complex queries
   - Repository query extraction
3. Generate refactoring plan with risk/impact assessment
4. Present plan to user for approval
5. Execute approved refactorings incrementally:
   - Make one change
   - Run tests immediately
   - If tests pass: continue
   - If tests fail: revert immediately
6. Document suggested tests for future Red phases
7. **Wait for user review before proceeding**

---

## Phase 6: Validate After Refactoring

**Goal:** Confirm all tests still pass after refactoring.

**Agent:** `tdd-green-validator`

**Actions:**

1. Run full test suite:

   ```bash
   {context.project.commands.test}
   {context.project.commands.testIntegration}
   {context.project.commands.testE2e}
   ```

2. Verify test counts match pre-refactor baseline
3. Check TypeScript compilation and lint
4. Generate comparison report (before vs after)
5. If regressions: revert problematic changes, re-run
6. **Wait for user confirmation before proceeding**

---

## Phase 7: Summarize and Index

**Goal:** Document what was accomplished and update knowledge graph.

**Actions:**

1. Mark all todos complete
2. Generate summary report:

   ```markdown
   ## TDD Implementation Summary: <<SCENARIO_NAME>>

   ### Test Results
   | Phase | Test Type | Count | Status |
   |-------|-----------|-------|--------|
   | Red | Unit tests generated | X | FAIL (expected) |
   | Red | Integration tests generated | Y | FAIL (expected) |
   | Green | Unit tests | X | PASS |
   | Green | Integration tests | Y | PASS |
   | Green | E2E scenarios | Z | PASS |
   | Clean | After refactoring | X+Y+Z | PASS |

   ### Files Created
   **Domain Layer** (`{paths.domain}/`):
   - `entities/<<entity>>.entity.ts`
   - `value-objects/<<domain>>/<<entity>>-status.vo.ts`
   - `repositories/<<entity>>.repository.interface.ts`

   **Infrastructure Layer** (`{paths.backend}/<<domain>>/infrastructure/`):
   - `<<entity>>.orm-entity.ts`
   - `<<entity>>.mapper.ts`
   - `<<entity>>.repository.ts`

   **Application Layer** (`{paths.backend}/<<domain>>/`):
   - `queries/<<query>>.query.ts`
   - `queries/<<query>>.handler.ts`
   - `queries/<<entity>>-dto.mapper.ts`

   **Tests**:
   - `<<handler>>.handler.spec.ts`
   - `test/integration/<<feature>>.integration.spec.ts`
   ```

3. **Update Graphify**

   ```bash
   /graphify:index --project {projectName}
   ```

4. **Extract patterns to wiki**

   If new patterns discovered during implementation:
   - Create `wiki/patterns/{pattern-name}.md`
   - Link from `.framework/registry/pattern-catalog.md`

5. **Update project OKF**

   - Add ADRs for architectural decisions to `projects/{projectName}/okf/adr/`
   - Update `projects/{projectName}/okf/index.md` with new features

---

## Workflow Shortcuts

| Shortcut | Description | Phases |
|----------|-------------|--------|
| `full` | Complete TDD cycle | 0-7 |
| `implement` | Tests exist, implement only | 3-4, 7 |
| `validate` | Just run validation | 4 only |
| `refactor` | Tests pass, refactor only | 5-6, 7 |

Usage: `{command} {featurePath} "{scenario}" --project {projectName} --shortcut=implement`

---

## Commands

```bash
# Full workflow
/dna-tdd-backend:dna-tdd-backend {featurePath} "{scenario}" --project {projectName}

# Shortcuts
/dna-tdd-backend:dna-tdd-backend ... --shortcut=implement --project {projectName}
/dna-tdd-backend:dna-tdd-backend ... --shortcut=validate --project {projectName}
/dna-tdd-backend:dna-tdd-backend ... --shortcut=refactor --project {projectName}
```

---

## Changes from Original Playbook

| Aspect | Original | Ported |
|--------|----------|--------|
| Paths | `apps/ip-hub-backend/` | `context.project.paths.backend` |
| Domain | IP Hub bounded contexts | `context.project.domain` |
| Commands | `pnpm nx test ip-hub-backend` | `context.project.commands.test` |
| Context loading | Manual file reads | `loadProjectContext()` via RLM |
| Entity discovery | File grepping | `graphify.query()` |
| Patterns | None | `wiki.query()` for cross-project patterns |
| Indexing | None | Graphify reindex after completion |

---

## Source

Original: `.framework/agents/playbooks/tdd-backend-agents/commands/dna-tdd-backend.md`
