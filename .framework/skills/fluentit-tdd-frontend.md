---
description: Project-agnostic TDD implementation for frontend features. Red → Green → Validate → Clean cycle with accessibility-first approach. Uses RLM for context loading.
argument-hint: Provide the BDD feature files or specs to implement, and project name
---

# Frontend TDD Implementation (Project-Agnostic)

> Red → Green → Validate → Clean cycle for frontend features. Ported from playbook to use ProjectContext and RLM.

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
     frontend: project.paths.frontend,
     features: project.paths.features,
     specs: project.paths.specs.frontend,
     tests: {
       unit: project.paths.tests?.unit || `${project.paths.frontend}/test/unit`,
       integration: project.paths.tests?.integration || `${project.paths.frontend}/test/integration`,
       e2e: project.paths.tests?.e2e || `${project.paths.frontend}/test/e2e`
     },
     components: `${project.paths.frontend}/components`,
     composables: `${project.paths.frontend}/composables`,
     pages: `${project.paths.frontend}/pages`,
     stores: `${project.paths.frontend}/stores`,
     types: `${project.paths.frontend}/types`
   };
   ```

4. **Load tech stack config**

   ```typescript
   const techStack = project.techStack.frontend;
   // techStack.framework — e.g., 'nuxt', 'react', 'angular'
   // techStack.state — e.g., 'pinia', 'zustand', 'redux'
   // techStack.testing — e.g., 'vitest', 'jest'
   // techStack.e2e — e.g., 'playwright', 'cypress'
   ```

5. **Query Graphify for existing components**

   ```typescript
   const existingComponents = await graphify.query(`
     MATCH (c:Component) WHERE c.project = $project RETURN c
   `, { project: projectName });

   const existingFeatures = await graphify.query(`
     MATCH (f:Feature) WHERE f.project = $project RETURN f
   `, { project: projectName });
   ```

6. **Query Wiki for frontend patterns**

   ```typescript
   const patterns = await wiki.query(`
     Find frontend patterns for: ${techStack.framework}
     Find testing patterns for: ${techStack.testing}
   `);
   ```

7. **Load domain context**

   ```typescript
   const domain = project.domain;
   const components = domain.components || [];
   ```

8. **Report to user**

   - Project: `${projectName}` (${project.type})
   - Tech: `${techStack.framework}` + `${techStack.state}`
   - Existing components: `${existingComponents.length}`
   - Existing features: `${existingFeatures.length}`
   - Confirm before proceeding

---

## Phase 1: Generate Tests (TDD Red)

**Goal:** Generate failing unit and integration tests from BDD feature files.

**Agent:** `tdd-red-test-generator`

**Actions:**

1. Create todo list with all phases
2. If feature files or requirements unclear, ask user:
   - Which feature/scenario to implement?
   - What components/pages are involved?
   - Any specific test patterns to follow?
3. Analyze BDD feature files to understand expected behavior
4. Generate unit tests for component logic:

   ```typescript
   `${paths.tests.unit}/<<component>>.spec.ts`
   ```

5. Generate integration tests for page/route logic:

   ```typescript
   `${paths.tests.integration}/<<page>>.spec.ts`
   ```

6. **Stack-specific test setup:**

   ```typescript
   const testConfig = projectType.testConfig.frontend;
   // For Nuxt/Vue + Vitest:
   // - mount() from @vue/test-utils
   // - createPinia() for store tests
   // - happy-dom for DOM environment
   //
   // For React + Vitest:
   // - render() from @testing-library/react
   // - userEvent for interactions
   ```

7. Run tests to confirm they fail (TDD Red phase)
8. Summarize generated tests and confirm with user
9. **Wait for user review before proceeding**

---

## Phase 2: Review and Refine Tests

**Goal:** User reviews generated tests and provides feedback.

**CRITICAL:** Do not skip. Test quality is essential.

**Actions:**

1. Review generated test files with user
2. Clarify ambiguous feedback
3. Update tests to match expectations
4. Re-run tests to confirm still fail appropriately
5. Summarize test coverage:
   - Unit tests: components/composables covered
   - Integration tests: pages/routes covered
6. **Wait for user confirmation before proceeding**

---

## Phase 3: Implement Code (TDD Green)

**Goal:** Implement minimal code to make all failing tests pass.

**Agent:** `tdd-green-implementer`

**Actions:**

1. Analyze failing tests to understand requirements
2. **Discover existing patterns via RLM:**

   ```typescript
   const codePatterns = await rlm.explore({
     project: projectName,
     query: "Find existing component patterns for this feature domain",
     maxTokens: 8000
   });
   ```

3. Implement minimal code:

   **Components** (`{paths.components}/`):
   - Create framework-appropriate components
   - Add `data-testid` attributes for testability
   - Add accessibility attributes (ARIA labels, semantic HTML)

   **Framework-specific component structure:**
   ```typescript
   const componentPattern = projectType.patterns.components;
   // For Vue/Nuxt:
   // - <script setup lang="ts">
   // - defineProps<Props>() with TypeScript interface
   // - defineEmits<{...}>() with typed events
   //
   // For React:
   // - Functional components with typed props
   // - Hooks for state/effects
   //
   // For Angular:
   // - Standalone components
   // - Typed @Input() / @Output()
   ```

   **Composables/Hooks** (`{paths.composables}/`):
   - Extract reusable logic
   - Follow project naming conventions

   **Types** (`{paths.types}/`):
   - Define TypeScript interfaces
   - No `any` types

4. Run unit tests iteratively until all pass
5. Run integration tests until all pass
6. Summarize implementation and confirm with user
7. **Wait for user review before proceeding**

---

## Phase 4: Validate Green Status

**Goal:** Validate all tests pass and architecture is correct.

**Agent:** `tdd-green-validator`

**Actions:**

1. Pre-validation checks:

   ```bash
   {context.project.commands.typecheck}
   {context.project.commands.lint}
   ```

2. **Validate frontend architecture** (project-type driven):

   ```typescript
   const validations = projectType.validations.frontend;
   // Apply each validation from project-type config:
   //
   // For Nuxt/Vue:
   // ✅ Components use <script setup lang="ts">
   // ✅ Props defined with defineProps<Props>()
   // ✅ Emits defined with defineEmits<{...}>()
   // ✅ No `any` types
   // ✅ Composables follow useXxx naming
   //
   // For React:
   // ✅ Functional components
   // ✅ Typed hooks
   // ✅ No `any` types
   ```

3. **Validate accessibility compliance:**
   - All interactive elements have `data-testid` attributes
   - ARIA attributes on custom controls
   - Semantic HTML structure
   - Keyboard navigation support

4. Run all test suites:

   ```bash
   {context.project.commands.test} --testPathPattern="<<FEATURE>>"
   ```

5. Run regression tests:

   ```bash
   {context.project.commands.test}
   ```

6. Generate validation report
7. If failures: return to Phase 3
8. **Wait for user decision before proceeding**

---

## Phase 5: BDD E2E Validation

**Goal:** Run Cucumber E2E tests to validate full implementation.

**Actions:**

1. Identify relevant BDD feature files
2. Run E2E tests:

   ```bash
   {context.project.commands.testE2e} -- <<featurePath>>/*.feature
   ```

3. If E2E tests fail:
   - Identify failing scenarios/steps
   - Analyze if issue is in implementation or step definitions
   - Fix implementation (not tests)
   - Re-run until all pass
4. Summarize validated scenarios
5. **Wait for user confirmation before proceeding**

---

## Phase 6: Refactor (TDD Clean)

**Goal:** Improve code quality without changing behavior.

**CRITICAL:** Only proceed if user approved. All tests must pass.

**Agent:** `tdd-clean-refactorer`

**Actions:**

1. Verify all tests pass (baseline)
2. Analyze code for refactoring:
   - Large components → split into smaller ones
   - Duplicated logic → extract composables/hooks
   - `any` types → proper interfaces
   - Performance: computed/memo, lazy loading
   - Accessibility improvements
3. Present plan to user for approval
4. Execute approved refactorings one at a time:
   - Make change → run tests → verify pass
   - If fail: revert and document
5. Document suggested tests for future Red phases
6. **Wait for user confirmation before proceeding**

---

## Phase 7: Validate After Refactoring

**Goal:** Confirm all tests still pass after refactoring.

**Agent:** `tdd-green-validator`

**Actions:**

1. Run full test suite:

   ```bash
   {context.project.commands.test}
   {context.project.commands.testE2e}
   ```

2. Verify test counts match pre-refactor baseline
3. Check TypeScript compilation and lint
4. Generate comparison report
5. If regressions: revert and re-run
6. **Wait for user confirmation before proceeding**

---

## Phase 8: Summarize and Index

**Goal:** Document what was accomplished and update knowledge graph.

**Actions:**

1. Mark all todos complete
2. Generate summary:

   ```markdown
   ## TDD Frontend Summary: <<FEATURE_NAME>>

   ### Tests
   | Type | Count | Status |
   |------|-------|--------|
   | Unit | X | PASS |
   | Integration | Y | PASS |
   | E2E | Z | PASS |

   ### Implementation
   - Components: [list]
   - Pages: [list]
   - Composables: [list]
   - Types: [list]

   ### Validation
   - TypeScript: clean
   - Accessibility: compliant
   - Regression: none
   ```

3. **Update Graphify**

   ```bash
   /graphify:index --project {projectName}
   ```

4. **Extract patterns to wiki**

   If new component patterns discovered:
   - Create `wiki/patterns/{pattern-name}.md`
   - Link from `.framework/registry/pattern-catalog.md`

5. **Update project OKF**
   - Update `projects/{projectName}/okf/index.md`

---

## Workflow Shortcuts

| Shortcut | Description | Phases |
|----------|-------------|--------|
| `full` | Complete TDD cycle | 0-8 |
| `implement` | Tests exist, implement only | 3-5, 8 |
| `validate` | Just run validation | 4 only |
| `refactor` | Tests pass, refactor only | 6-7, 8 |
| `e2e-only` | Just E2E validation | 5 only |

Usage: `{command} {featurePath} --project {projectName} --shortcut=implement`

---

## Commands

```bash
# Full workflow
/fluentit-tdd-frontend:fluentit-tdd-implement {featurePath} --project {projectName}

# Shortcuts
/fluentit-tdd-frontend:fluentit-tdd-implement ... --shortcut=implement --project {projectName}
/fluentit-tdd-frontend:fluentit-tdd-implement ... --shortcut=validate --project {projectName}
/fluentit-tdd-frontend:fluentit-tdd-implement ... --shortcut=refactor --project {projectName}
```

---

## Changes from Original Playbook

| Aspect | Original | Ported |
|--------|----------|--------|
| Paths | `apps/ip-hub-frontend/` | `context.project.paths.frontend` |
| Framework | Hardcoded Vue/Nuxt | `context.project.techStack.frontend.framework` |
| Commands | `pnpm nx test ip-hub-frontend` | `context.project.commands.test` |
| Validations | Hardcoded Vue rules | `projectType.validations.frontend` |
| Component patterns | IP Hub catalogue | `context.project.domain.components` |
| Context loading | Manual file reads | `loadProjectContext()` + `rlm.explore()` |
| Indexing | None | Graphify reindex after completion |

---

## Source

Original: `.framework/agents/playbooks/tdd-frontend-agents/commands/fluentit-tdd-implement.md`
