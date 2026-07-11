---
description: Guided TDD implementation for NestJS backend with CQRS and DDD patterns
argument-hint: Provide the feature file path and scenario name (e.g., apps/ip-hub-backend/test/e2e/features/dashboard.feature "View dashboard summary")
---

# Backend TDD Implementation

See context/monorepo-context.md for mono-repo structure and commands.

You are helping a backend developer implement features using Test-Driven Development (TDD) with the Red-Green-Clean cycle. Follow a systematic approach: generate failing tests first, implement minimal code to pass, validate thoroughly, then refactor for quality.

## Core Principles

- **Red-Green-Clean cycle**: Always follow TDD discipline - tests first, implementation second, refactoring third
- **Ask clarifying questions**: Identify ambiguities in requirements before generating tests. Wait for user answers before proceeding.
- **Understand before acting**: Read existing patterns in the codebase first
- **Architecture Specification as Primary Source**: For Technical/Combined specs, architecture defines contracts
- **DDD architecture**: All implementations must follow Domain-Driven Design patterns (value objects, domain entities, repository interfaces)
- **Incremental progress**: One test/implementation at a time with validation between
- **Use TodoWrite**: Track all progress throughout
- **BDD-First priority**: When BDD scenarios conflict with DDD patterns, BDD acceptance criteria take precedence
- **No auth endpoints**: Authentication is handled by oauth2-proxy at ingress. Backend code MUST NOT implement login/logout/register endpoints.

---

## Phase 0: Detect Spec Type and Load Architecture

**Goal**: Determine spec type and load Architecture Specification if available

**Actions**:

1. **Read BDD/TDD Testing Boundary Guidelines**:

   - Read `documentation/technical-project-context/backend-testing/BDD-GUIDELINES.md` — Understand what BDD tests cover (API E2E) vs what TDD unit tests cover (handler internals, domain logic)
   - This ensures generated unit tests complement BDD E2E tests without duplication

2. **Detect Spec Type**:

   - Check if feature files have `@architecture-aligned` tag
   - Check for `specs/backend/<FEATURE-FOLDER>/(Architecture/cqrs-contract/)` folder
   - Determine: UI, Technical, or Combined

3. **For Technical/Combined Specs**:

   - **Read Architecture Specification FIRST**
   - Extract API contracts, CQRS definitions, domain events
   - Tests and implementations must match architecture EXACTLY

4. **Report to User**:
   - Display detected spec type
   - Confirm Architecture Specification reference if applicable

---

## Phase 1: Red - Generate Failing Tests

**Goal**: Analyze the BDD scenario and generate comprehensive unit and integration tests that will fail (Red state)

**User Prompt**: Feature file and scenario: $ARGUMENTS

**Agent**: Use the **TDD Red Test Generator Agent** (`tdd-red-test-generator.md`)

**Actions**:

1. Create todo list with all phases
2. Read the feature file and analyze the scenario
3. If requirements are unclear, ask user for:
   - What backend components are needed?
   - What API endpoints should be created?
   - What domain entities are involved?
4. Generate unit tests for:
   - Value objects (validation, equality)
   - Domain entities (business logic)
   - Handlers (with interface mocks)
   - Mappers (Domain↔ORM, Domain→DTO)
5. Generate integration tests for:
   - API endpoints with real database
   - Authentication/authorization
   - Validation errors
6. Generate/update test factories if needed
7. Run tests to confirm Red state (all tests fail for correct reasons)
8. Summarize generated tests and confirm with user
9. **Wait for user review before proceeding to Phase 2**

---

## Phase 2: Review Generated Tests

**Goal**: Review and refine generated tests based on user feedback

**CRITICAL**: DO NOT SKIP this phase. User review ensures tests match actual requirements.

**User Prompt**: Review comments on generated test files (if any): $ARGUMENTS

**Actions**:

1. If user provided feedback:
   - Review their comments on test files
   - Ask clarifying questions if feedback is unclear
   - Update tests as requested
   - Re-run tests to confirm still in Red state
2. If no feedback provided:
   - Review tests yourself for completeness
   - Identify any missing edge cases
   - Propose additions and get explicit confirmation
3. Confirm final test suite with user
4. **Wait for approval before proceeding to Phase 3**

If the user says "looks good" or "proceed", move to Phase 3.

---

## Phase 3: Green - Implement Code

**Goal**: Implement the minimal backend code necessary to make all failing tests pass

**User Prompt**: Confirmed test files from Phase 2: $ARGUMENTS

**Agent**: Use the **TDD Green Implementer Agent** (`tdd-green-implementer.md`)

**Actions**:

1. Create todo list for implementation (following DDD layer order)
2. Implement in strict order:

   **Domain Layer** (`libs/domain/src/`) -- **Note**: this path is at the mono-repo root, not inside `apps/ip-hub-backend/`:

   - Value objects (type, status)
   - Domain entity
   - Repository interface with Symbol token
   - Domain events (if needed)
   - Export from index.ts

   **Infrastructure Layer** (`app/{domain}/infrastructure/`):

   - ORM entity
   - Domain↔ORM mapper
   - Repository implementation
   - Add entity to test-database.ts

   **Application Layer** (`app/{domain}/`):

   - Command/Query classes
   - Handlers (using `@Inject(IRepository)`)
   - Domain→DTO mapper

   **API Layer**:

   - Controller endpoints
   - Module registration
   - AppModule import

3. Run unit tests after each layer - fix failures before proceeding
4. Run integration tests after API layer complete
5. Summarize implementation and confirm with user
6. **Wait for approval before proceeding to Phase 4**

---

## Phase 4: Validate - Confirm Green Status

**Goal**: Comprehensively validate that all tests pass and DDD architecture is correct

**User Prompt**: Implementation files from Phase 3: $ARGUMENTS

**Agent**: Use the **TDD Green Validator Agent** (`tdd-green-validator.md`)

**Actions**:

1. Pre-validation checks:

   ```bash
   npx tsc --noEmit -p apps/<<APP>>/tsconfig.app.json
   pnpm nx lint <<APP>>
   ```

2. Validate DDD architecture:

   - Domain entities have no framework dependencies
   - Value objects have validation in constructors
   - Handlers use `@Inject(IRepository)` NOT `@InjectRepository`
   - No imports from `test/` in production code

3. Run all test suites:

   ```bash
   pnpm nx test <<APP>> --testPathPattern="<<DOMAIN>>"
   pnpm nx test:integration <<APP>> --testPathPattern="<<FEATURE>>"
   pnpm nx test:e2e <<APP>> -- --name "<<SCENARIO>>"
   ```

4. Run regression tests (existing features still pass):

   ```bash
   pnpm nx test <<APP>>
   pnpm nx test:integration <<APP>>
   ```

5. Generate validation report
6. If any failures:
   - Document failure details
   - Return to Phase 3 to fix implementation
7. **Wait for user decision before proceeding to Phase 5**

User can choose:

- Proceed to Phase 5 (refactoring) - if code quality improvements needed
- Skip to Phase 7 (summarize) - if implementation is satisfactory

---

## Phase 5: Clean - Refactor Code (Optional)

**Goal**: Improve code quality while maintaining test compliance

**CRITICAL**: Only proceed if user approved refactoring. All tests must continue to pass.

**User Prompt**: Refactoring focus (all | extraction | types | ddd | performance): $ARGUMENTS

**Agent**: Use the **TDD Clean Refactorer Agent** (`tdd-clean-refactorer.md`)

**Actions**:

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
7. **Wait for user review before proceeding to Phase 6**

---

## Phase 6: Validate After Refactoring

**Goal**: Confirm all tests still pass after refactoring

**User Prompt**: Refactored files from Phase 5: $ARGUMENTS

**Agent**: Use the **TDD Green Validator Agent** (`tdd-green-validator.md`)

**Actions**:

1. Run full test suite:

   ```bash
   pnpm nx test <<APP>>
   pnpm nx test:integration <<APP>>
   pnpm nx test:e2e <<APP>>
   ```

2. Verify test counts match pre-refactor baseline
3. Check TypeScript compilation and lint
4. Generate comparison report (before vs after refactoring)
5. If any regressions:
   - Identify which refactoring caused the issue
   - Revert problematic changes
   - Re-run validation
6. **Wait for user confirmation before proceeding to Phase 7**

---

## Phase 7: Summarize

**Goal**: Document what was accomplished

**Actions**:

1. Mark all todos complete
2. Generate summary report:

```markdown
## TDD Implementation Summary: <<SCENARIO_NAME>>

### Test Results

| Phase | Test Type                   | Count | Status          |
| ----- | --------------------------- | ----- | --------------- |
| Red   | Unit tests generated        | X     | FAIL (expected) |
| Red   | Integration tests generated | Y     | FAIL (expected) |
| Green | Unit tests                  | X     | PASS            |
| Green | Integration tests           | Y     | PASS            |
| Green | E2E scenarios               | Z     | PASS            |
| Clean | After refactoring           | X+Y+Z | PASS            |

### Files Created

**Domain Layer** (`libs/domain/src/`):

- `entities/<<entity>>.entity.ts`
- `value-objects/<<domain>>/<<entity>>-status.vo.ts`
- `repositories/<<entity>>.repository.interface.ts`

**Infrastructure Layer** (`app/<<domain>>/infrastructure/`):

- `<<entity>>.orm-entity.ts`
- `<<entity>>.mapper.ts`
- `<<entity>>.repository.ts`

**Application Layer** (`app/<<domain>>/`):

- `queries/<<query>>.query.ts`
- `queries/<<query>>.handler.ts`
- `queries/<<entity>>-dto.mapper.ts`

**Tests**:

- `<<handler>>.handler.spec.ts`
- `test/integration/<<feature>>.integration.spec.ts`

### Refactorings Applied (if any)

- [x] Extracted `<<Service>>` from handler
- [x] Created `<<ValueObject>>` value object
- [ ] Skipped: <<reason>>

### Key Decisions

1. <<Decision 1>>
2. <<Decision 2>>

### Suggested Next Steps

1. Implement next scenario: "<<NEXT_SCENARIO>>"
2. Add edge case tests for <<COMPONENT>>
3. Consider extracting <<PATTERN>> for reuse
```

---

## Quick Reference: Test Commands

```bash
# Unit tests
pnpm nx test <<APP>> --testPathPattern="pattern"

# Integration tests (Testcontainers)
pnpm nx test:integration <<APP>> --testPathPattern="pattern"

# E2E tests (Cucumber) - note -- separator
pnpm nx test:e2e <<APP>> -- --name "scenario name"
pnpm nx test:e2e <<APP>> -- --tags "@tag"

# TypeScript compilation
npx tsc --noEmit -p apps/<<APP>>/tsconfig.app.json

# Lint
pnpm nx lint <<APP>>
```

---

## Workflow Shortcuts

For experienced users, these shortcuts are available:

| Shortcut    | Description                 | Phases |
| ----------- | --------------------------- | ------ |
| `full`      | Complete TDD cycle          | 1-7    |
| `implement` | Tests exist, implement only | 3-4, 7 |
| `validate`  | Just run validation         | 4 only |
| `refactor`  | Tests pass, refactor only   | 5-6, 7 |

Usage: Include shortcut in arguments, e.g., `apps/ip-hub-backend/test/e2e/features/dashboard.feature "View summary" --shortcut=implement`
