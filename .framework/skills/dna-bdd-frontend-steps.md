---
description: Project-agnostic frontend BDD step definition development. Generates Playwright steps, MSW handlers, and Pact contracts from Gherkin features. Uses RLM for context loading.
argument-hint: Provide feature files and project name (e.g., features/dashboard/*.feature --project ip-hub)
---

# Frontend BDD Step Definitions (Project-Agnostic)

> Generates frontend E2E step definitions from Gherkin features. Includes API mocking and contract testing. Ported from playbook to use ProjectContext and RLM.

---

## Phase 0: Load Project Context

**Goal:** Load project configuration, frontend architecture, and existing step definitions via RLM.

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
     features: project.paths.features || `${project.paths.frontend}/features`,
     tests: {
       e2e: project.paths.tests?.e2e || `${project.paths.frontend}/test/e2e`,
       unit: project.paths.tests?.unit || `${project.paths.frontend}/test/unit`,
       integration: project.paths.tests?.integration || `${project.paths.frontend}/test/integration`
     },
     stepDefinitions: `${project.paths.frontend}/features/step-definitions/`,
     msw: {
       handlers: `${project.paths.frontend}/test/msw/handlers/`,
       index: `${project.paths.frontend}/test/msw/handlers/index.ts`
     },
     pact: `${project.paths.frontend}/test/pact/`,
     specs: {
       frontend: project.paths.specs?.frontend || `specs/frontend/`,
       backend: project.paths.specs?.backend || `specs/backend/`,
       api: `${project.paths.specs?.backend || 'specs/backend'}/api/`
     }
   };
   ```

4. **Load tech stack config**

   ```typescript
   const techStack = project.techStack.frontend;
   // techStack.framework — e.g., 'nuxt', 'react'
   // techStack.testing — e.g., 'vitest'
   // techStack.e2e — e.g., 'playwright', 'cypress'
   ```

5. **Discover frontend tooling from project config**

   ```typescript
   const tooling = projectType.tooling?.frontend || {};
   // tooling.msw — true if Mock Service Worker is used
   // tooling.pact — true if Pact contract testing is used
   // tooling.testIdHelper — e.g., 'toTestId'
   ```

6. **Query Graphify for existing steps**

   ```typescript
   const existingSteps = await graphify.query(`
     MATCH (s:StepDefinition) WHERE s.project = $project RETURN s
   `, { project: projectName });
   ```

7. **Query Wiki for frontend testing patterns**

   ```typescript
   const patterns = await wiki.query(`
     Find E2E patterns for: ${techStack.e2e}
     Find API mocking patterns
   `);
   ```

8. **Report to user**
   - Project: `${projectName}`
   - E2E framework: `${techStack.e2e}`
   - MSW: `${tooling.msw ? 'enabled' : 'disabled'}`
   - Pact: `${tooling.pact ? 'enabled' : 'disabled'}`
   - Confirm before proceeding

---

## Phase 1: Detect Spec Type and Load Architecture

**Goal:** Determine if Architecture Specification should be referenced.

**Actions:**

1. **Check for Architecture Specification** in `{paths.specs.frontend}/{feature-folder}/`:
   - Look for `Architecture/` or `cqrs-contract/` folder
   - If found → **Combined** spec type
   - If not found → **UI** spec type

2. **For Combined specs:**
   - Read Architecture Specification
   - Extract API contracts that mock handlers must match

3. **Check for centralized API specs:**

   ```typescript
   const hasCentralizedSpecs = await checkPathExists(paths.specs.api);
   if (hasCentralizedSpecs) {
     // List available .yaml files
     // Identify relevant specs for this feature
     // Create discrepancy report folder if needed
   }
   ```

4. Report detected spec type and confirm

---

## Phase 2: Analyze API Requirements

**Goal:** Extract API requirements from Gherkin scenarios and cross-reference with specs.

**Agent:** `api-requirements-analyzer`

**Actions:**

1. Create todo list with all phases
2. If feature files or spec location unclear, ask user:
   - Which feature files to analyze?
   - Where is the API/BFFE specification?
3. **Discover API requirements via RLM:**

   ```typescript
   const apiRequirements = await rlm.analyze({
     project: projectName,
     featureFiles,
     query: "Extract all API endpoints, methods, request/response schemas"
   });
   ```

4. Cross-reference with centralized API specs (if available)
5. Save analysis to temp directory
6. Summarize and confirm with user
7. **Wait for review before proceeding**

---

## Phase 3: Generate API Mock Handlers

**Goal:** Create mock API handlers from requirements analysis.

**CRITICAL:** Do not skip. Mock handlers are required for step definitions.

**Agent:** `mock-handler-generator`

**Actions:**

1. If requirements analysis doesn't exist, return to Phase 2
2. **Generate handlers based on project tooling:**

   ```typescript
   if (tooling.msw) {
     // Generate MSW handlers
     // Save to {paths.msw.handlers}/
     // Register in {paths.msw.index}
   } else {
     // Generate appropriate mocks for project's mocking library
     // e.g., MirageJS, json-server, or custom mock server
   }
   ```

3. Verify handlers match API spec contracts
4. Run TypeScript compiler to verify no type errors
5. Summarize created handlers
6. **Wait for review before proceeding**

---

## Phase 4: Scaffold Step Definitions

**Goal:** Generate step definition scaffolds from feature files.

**Agent:** `step-definition-scaffolder`

**Actions:**

1. Run E2E framework dry-run to identify undefined steps:

   ```bash
   {context.project.commands.testE2eDry} {featureFiles}
   ```

2. Generate scaffold files with placeholder implementations:

   ```typescript
   `${paths.stepDefinitions}/{domain}-steps.ts`
   ```

3. Group scaffolds by domain appropriately
4. Run TypeScript compiler to verify scaffolds compile
5. Summarize scaffolds
6. **Wait for review before proceeding**

---

## Phase 5: Implement Step Definitions

**Goal:** Implement step definitions with E2E framework using mocked APIs.

**CRITICAL:** Do not skip. Implementation is core of BDD automation.

**Agent:** `step-definition-implementer`

**Actions:**

1. If scaffolds don't exist, return to Phase 4
2. **Implement using project-specific E2E framework:**

   ```typescript
   const e2eFramework = techStack.e2e;
   // For Playwright:
   // - @playwright/test expect
   // - page.locator() with data-testid
   // - page.goto() for navigation
   //
   // For Cypress:
   // - cy.get() with data-testid
   // - cy.visit() for navigation
   ```

3. Ensure proper use of:
   - **Test framework expect** (from `techStack.testing`)
   - **Test ID helper** (from `tooling.testIdHelper`, e.g., `toTestId()`)
   - **Mocked APIs** (from Phase 3)
   - **TypeScript types** (no `any`)

4. **Use component catalogue from domain context:**

   ```typescript
   const components = context.project.domain.components || [];
   // Generate step definitions aware of available components
   // e.g., TextField, SelectField, Accordion, Button
   ```

5. Run TypeScript compiler to verify
6. Summarize implementations
7. **Wait for review before proceeding**

---

## Phase 6: Review Step Definitions

**Goal:** Review and improve step definitions.

**CRITICAL:** Do not skip.

**Agent:** `step-definition-reviewer`

**Actions:**

1. Review step definition files for:
   - TypeScript type safety
   - E2E framework best practices
   - BDD alignment
   - API spec compliance
2. Create todo list with issues
3. Apply improvements or fix regressions
4. Summarize findings
5. **Wait for review before proceeding**

---

## Phase 7: Validate BDD Red Phase

**Goal:** Verify step definitions fail before application code exists.

**Agent:** `bdd-red-phase-validator`

**Actions:**

1. Run E2E tests expecting failures:

   ```bash
   {context.project.commands.testE2e} {featureFiles}
   ```

2. Analyze failure categories:
   - **Expected:** Missing application code (good)
   - **Unexpected:** Test issues needing fix
   - **Unexpected Passes:** Tests passing without implementation
3. Fix unexpected failures
4. Generate implementation roadmap
5. Summarize validation
6. **Wait for confirmation before proceeding**

---

## Phase 8: Generate Pact Contracts (Optional)

**Goal:** Generate consumer-driven contracts from mock handlers.

**Skipped if `!tooling.pact`.**

**Agent:** `pact-contract-generator`

**Actions:**

1. Verify mock handlers exist
2. Generate contracts:

   ```typescript
   `${paths.pact}/pacts/{consumer}-{provider}.json`
   ```

3. Cross-check against API spec
4. Summarize contracts
5. **Wait for review before proceeding**

---

## Phase 9: Validate Contract Sync (Optional)

**Goal:** Validate mocks and contracts are in sync.

**Skipped if `!tooling.pact`.**

**Agent:** `contract-sync-validator`

**Actions:**

1. Validate mock handlers match contracts
2. Cross-validate with API spec
3. If mismatches found:
   - Fix mock handlers
   - Regenerate contracts
   - Re-validate
4. On success:
   - Version management guidance
   - Publication instructions
5. Summarize validation
6. **Wait for confirmation before proceeding**

---

## Phase 10: Review API Spec Alignment

**Goal:** Resolve discrepancies between API specs, feature specs, and contracts.

**Actions:**

1. Read discrepancy report (if centralized API specs exist)
2. Present findings categorized:
   - Mock handlers to update
   - Centralized API specs to update
   - Feature specs to update
3. Ask user to confirm resolution
4. If updates needed:
   - Return to Phase 3 (update mocks)
   - Regenerate contracts (Phase 8)
   - Re-validate (Phase 9)
5. Document final decisions
6. **Wait for confirmation before proceeding**

---

## Phase 11: Summarize and Index

**Goal:** Document what was accomplished and update knowledge graph.

**Actions:**

1. Mark all todos complete
2. Summarize:
   - Mock handlers created
   - Step definitions implemented
   - Pact contracts generated (if applicable)
   - Files created/modified
   - API spec discrepancies documented
   - Implementation roadmap

3. **Update Graphify**

   ```bash
   /graphify:index --project {projectName}
   ```

4. **Update project OKF**
   - Update `projects/{projectName}/okf/index.md`

---

## Commands

```bash
# Full workflow
/dna-bdd-frontend-steps:dna-bdd-frontend-features {featureFiles} --project {projectName}

# Example
/dna-bdd-frontend-steps:dna-bdd-frontend-features features/dashboard/*.feature --project ip-hub
```

---

## Tooling Detection

The skill automatically detects and adapts to project tooling:

| Tooling | Detected From | Behavior |
|---------|--------------|----------|
| MSW | `test/msw/` exists | Generate MSW handlers |
| Pact | `test/pact/` exists | Generate Pact contracts |
| Playwright | `playwright.config.*` exists | Use Playwright syntax |
| Cypress | `cypress.config.*` exists | Use Cypress syntax |

If tooling is not auto-detected, it falls back to `projectType.tooling.frontend` config.

---

## Changes from Original Playbook

| Aspect | Original | Ported |
|--------|----------|--------|
| Paths | `apps/ip-hub-frontend/` | `context.project.paths.frontend` |
| E2E framework | Hardcoded Playwright | `techStack.e2e` (Playwright/Cypress) |
| Mock library | Hardcoded MSW | Auto-detected or `projectType.tooling.msw` |
| Contracts | Hardcoded Pact | Optional, auto-detected |
| `toTestId()` | Hardcoded | `tooling.testIdHelper` from config |
| Commands | `pnpm nx test ip-hub-frontend` | `context.project.commands.*` |
| Component catalogue | IP Hub specific | `context.project.domain.components` |
| API discovery | Manual file reading | `rlm.analyze()` |
| Indexing | None | Graphify reindex |

---

## Source

Original: `.framework/agents/playbooks/bdd-frontend-agents/commands/dna-bdd-frontend-features.md`
