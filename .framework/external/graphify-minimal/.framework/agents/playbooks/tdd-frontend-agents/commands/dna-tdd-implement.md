---
description: TDD workflow for frontend features - generate failing tests, implement code to pass them, validate with BDD E2E
argument-hint: Provide the BDD feature files or specs to implement
---

See context/monorepo-context.md for mono-repo structure and commands.

# TDD Frontend Implementation

You are helping a frontend developer implement features using Test-Driven Development (TDD). Follow the Red → Green → Validate → Clean cycle: generate failing tests first, implement minimal code to pass them, validate comprehensively, then refactor for quality.

## Core Principles

- **Red first**: Always generate failing tests before any implementation
- **Minimal implementation**: Write only enough code to make tests pass (YAGNI)
- **Never modify tests to pass**: Fix implementation, not tests
- **Ask clarifying questions**: Identify ambiguities before generating tests or code
- **Read files identified by agents**: When launching agents, review the files they identify as important
- **Architecture alignment**: For Combined specs, ensure API interactions match Architecture Specification
- **Use TodoWrite**: Track all progress throughout
- **Accessibility-first**: Include accessibility requirements in tests and implementation
- **Validate before refactoring**: Ensure green state is confirmed before any refactoring

---

## Phase 0: Detect Spec Type

**Goal**: Determine if Architecture Specification should be referenced

**Actions**:

1. Check for `specs/frontend/<FEATURE-FOLDER>/(Architecture/cqrs-contract/)` folder
2. If found → **Combined** spec type (reference architecture for API tests)
3. If not found → **UI** spec type (standard frontend TDD)
4. For Combined specs, note architecture contracts for API-related tests

---

## Phase 1: Generate Unit and Integration Tests (TDD Red)

**Goal**: Generate failing unit and integration tests from BDD feature files

**User Prompt**: BDD feature files or specs to implement: $ARGUMENTS

**Agent**: Use the Frontend TDD Red Agent (tdd-red-test-generator)

**Actions**:

1. Create todo list with all phases
2. If feature files or requirements are unclear, ask user for:
   - Which feature/scenario to implement?
   - What components/pages are involved?
   - Any specific test patterns to follow?
3. Analyze the BDD feature files to understand expected behavior
4. Generate unit tests in `test/unit/` for component logic
5. Generate integration tests in `test/integration/` for page/route logic
6. Run tests to confirm they fail (TDD Red phase)
7. Summarize generated tests and confirm with user
8. **Wait for user review before proceeding to Phase 2**

---

## Phase 2: Review and Refine Tests

**Goal**: User reviews generated tests and provides feedback for refinement

**CRITICAL**: DO NOT SKIP this phase. Test quality is essential for TDD success.

**Actions**:

1. Review the generated test files with the user
2. If user has comments/changes:
   - Clarify any ambiguous feedback
   - Update tests to match user expectations
   - Re-run tests to confirm they still fail appropriately
3. If user has no changes, confirm tests are ready for implementation
4. Summarize test coverage:
   - Unit tests: what components/composables are covered
   - Integration tests: what pages/routes are covered
5. **Wait for user confirmation before proceeding to Phase 3**

If the user says "looks good" or similar, confirm the test count and coverage before proceeding.

---

## Phase 3: Implement Code to Pass Tests (TDD Green)

**Goal**: Implement Vue components, Nuxt pages, and composables to make all failing tests pass

**Agent**: Use the Frontend TDD Green Agent (tdd-green-implementer)

**Actions**:

1. Analyze failing tests to understand implementation requirements
2. Review existing codebase patterns:
   - Existing components in `apps/ip-hub-frontend/app/components/`
   - Existing composables in `apps/ip-hub-frontend/app/composables/`
   - Type definitions in `apps/ip-hub-frontend/app/types/`
3. Implement minimal code to pass each test:
   - Create Vue components with required `data-testid` attributes
   - Implement props interfaces matching test expectations
   - Add accessibility attributes (ARIA labels, semantic HTML)
4. Run unit tests iteratively until all pass
5. Run integration tests until all pass
6. Summarize implementation and confirm with user
7. **Wait for user review before proceeding to Phase 4**

---

## Phase 4: Validate Green Status

**Goal**: Comprehensively validate that all tests pass and Vue/Nuxt architecture is correct

**Agent**: Use the Frontend TDD Green Validator Agent (tdd-green-validator)

**Actions**:

1. Pre-validation checks:

   ```bash
   npx tsc --noEmit
   pnpm nx lint ip-hub-frontend
   ```

2. Validate Vue/Nuxt architecture:

   - All components use `<script setup lang="ts">`
   - Props defined with `defineProps<Props>()` using TypeScript interface
   - Emits defined with `defineEmits<{...}>()` with typed events
   - No `any` types in component code
   - Composables follow patterns (useXxx naming, return object)

3. Validate accessibility compliance:

   - All interactive elements have `data-testid` attributes
   - ARIA attributes on custom controls
   - Semantic HTML structure
   - Keyboard navigation support

4. Run all test suites:

   ```bash
   pnpm nx test ip-hub-frontend -- --testPathPattern="<<FEATURE>>"
   ```

5. Run regression tests (existing features still pass):

   ```bash
   pnpm nx test ip-hub-frontend
   ```

6. Generate validation report
7. If any failures:
   - Document failure details
   - Return to Phase 3 to fix implementation
8. **Wait for user decision before proceeding to Phase 5**

---

## Phase 5: BDD E2E Validation

**Goal**: Run Cucumber E2E tests to validate the full implementation works end-to-end

**Actions**:

1. Identify relevant BDD feature files for the implemented feature
2. Run Cucumber E2E tests:
   ```bash
   pnpm nx test:e2e ip-hub-frontend -- specs/<<FEATURE>>/*.feature
   ```
3. If E2E tests fail:
   - Identify which scenarios/steps fail
   - Analyze if the issue is in implementation or step definitions
   - Fix implementation issues (not tests)
   - Re-run until all scenarios pass
4. If E2E tests pass, summarize:
   - Scenarios validated
   - User acceptance criteria confirmed
5. **Wait for user confirmation before proceeding to Phase 6**

---

## Phase 6: Refactor (TDD Clean)

**Goal**: Improve code quality without changing behavior

**CRITICAL**: Only proceed if user approved refactoring. All tests must continue to pass.

**Agent**: Use the Frontend TDD Clean Agent (tdd-clean-refactorer)

**Actions**:

1. Verify all tests pass (establish baseline)
2. Analyze code for refactoring opportunities:
   - Large components that should be split
   - Duplicated logic to extract into composables
   - TypeScript `any` types to replace
   - Performance optimizations (computed, memo)
   - Accessibility improvements
3. Present refactoring plan to user for approval
4. Execute approved refactorings one at a time:
   - Make change
   - Run tests immediately
   - If tests fail, revert and document
   - Continue until plan complete
5. Document suggested tests for future Red phase (don't implement)
6. Final verification: all tests must still pass
7. **Wait for user confirmation before proceeding to Phase 7**

If the user says "skip refactoring", proceed to Phase 8.

---

## Phase 7: Validate After Refactoring

**Goal**: Confirm all tests still pass after refactoring

**Agent**: Use the Frontend TDD Green Validator Agent (tdd-green-validator)

**Actions**:

1. Run full test suite:

   ```bash
   pnpm nx test ip-hub-frontend
   pnpm nx test:e2e ip-hub-frontend
   ```

2. Verify test counts match pre-refactor baseline
3. Check TypeScript compilation and lint
4. Generate comparison report (before vs after refactoring)
5. If any regressions:
   - Identify which refactoring caused the issue
   - Revert problematic changes
   - Re-run validation
6. **Wait for user confirmation before proceeding to Phase 8**

---

## Phase 8: Summarize

**Goal**: Document what was accomplished

**Actions**:

1. Mark all todos complete
2. Summarize:
   - **Tests Generated**:
     - Unit tests: count and coverage
     - Integration tests: count and coverage
   - **Implementation**:
     - Components created/modified
     - Pages created/modified
     - Types defined
   - **Validation**:
     - All tests passing (unit, integration, E2E)
     - TypeScript compilation clean
     - Accessibility requirements met
   - **Key Decisions Made**:
     - Architecture choices
     - Pattern selections
   - **Suggested Next Steps**:
     - Additional features to implement
     - Tests to add
     - Improvements to consider

---

## Workflow Shortcuts

For experienced users, these shortcuts are available:

| Shortcut    | Description                 | Phases |
| ----------- | --------------------------- | ------ |
| `full`      | Complete TDD cycle          | 1-8    |
| `implement` | Tests exist, implement only | 3-5, 8 |
| `validate`  | Just run validation         | 4 only |
| `refactor`  | Tests pass, refactor only   | 6-7, 8 |
| `e2e-only`  | Just run E2E validation     | 5 only |

Usage: Include shortcut in arguments, e.g., `specs/dashboard/*.feature --shortcut=implement`

---

## Quick Reference

### Test Commands

```bash
pnpm nx test ip-hub-frontend                                    # Run all tests
pnpm nx test ip-hub-frontend -- test/unit/*.test.ts             # Run unit tests
pnpm nx test ip-hub-frontend -- test/integration/*.ts           # Run integration
pnpm nx test:e2e ip-hub-frontend                                # Run all BDD E2E
pnpm nx test:e2e ip-hub-frontend -- features/X/*.feature        # Specific feature
npx tsc --noEmit                                                # TypeScript check
pnpm nx lint ip-hub-frontend                                    # Lint check
pnpm nx build ip-hub-frontend                                   # Build verification
```

### TDD Workflow Summary

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: Generate Tests (Red)                              │
│  └─→ Tests fail because implementation doesn't exist        │
├─────────────────────────────────────────────────────────────┤
│  Phase 2: Review Tests                                      │
│  └─→ User confirms test coverage and quality                │
├─────────────────────────────────────────────────────────────┤
│  Phase 3: Implement Code (Green)                            │
│  └─→ Minimal code to make tests pass                        │
├─────────────────────────────────────────────────────────────┤
│  Phase 4: Validate Green Status                             │
│  └─→ Architecture, accessibility, regression checks         │
├─────────────────────────────────────────────────────────────┤
│  Phase 5: BDD E2E Validation                                │
│  └─→ End-to-end scenarios pass                              │
├─────────────────────────────────────────────────────────────┤
│  Phase 6: Refactor (TDD Clean)                              │
│  └─→ Improve code without changing behavior                 │
├─────────────────────────────────────────────────────────────┤
│  Phase 7: Validate After Refactoring                        │
│  └─→ Confirm no regressions from refactoring                │
├─────────────────────────────────────────────────────────────┤
│  Phase 8: Summarize                                         │
│  └─→ Document what was accomplished                         │
└─────────────────────────────────────────────────────────────┘
```

### Agents Used

| Phase | Agent                  | Purpose                                         |
| ----- | ---------------------- | ----------------------------------------------- |
| 1     | tdd-red-test-generator | Generate failing tests from BDD specs           |
| 3     | tdd-green-implementer  | Implement code to pass tests                    |
| 4, 7  | tdd-green-validator    | Validate green state and architecture           |
| 6     | tdd-clean-refactorer   | Refactor code while maintaining test compliance |

### Architecture Validations

| Category      | What's Checked                                 |
| ------------- | ---------------------------------------------- |
| Components    | Script setup, typed props/emits, no `any`      |
| Composables   | useXxx naming, return object pattern           |
| Accessibility | data-testid, ARIA, semantic HTML, keyboard nav |
| Stores        | Composition API style, refs/computed/functions |
| Types         | No implicit any, proper interfaces             |
