---
description: Project-agnostic backend BDD step definition development. Generates E2E step definitions with API testing, database factories, and DDD compliance. Uses RLM for context loading.
argument-hint: Provide feature file path and project name (e.g., test/e2e/features/dashboard.feature --project ip-hub)
---

# Backend BDD Step Definitions (Project-Agnostic)

> Generates backend E2E step definitions from Gherkin features. Uses API testing, database factories, and DDD patterns. Ported from playbook to use ProjectContext and RLM.

---

## Phase 0: Load Project Context

**Goal:** Load project configuration, backend architecture, testing patterns, and existing step definitions via RLM.

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
     features: project.paths.features || `${project.paths.backend}/test/e2e/features`,
     tests: {
       e2e: project.paths.tests?.e2e || `${project.paths.backend}/test/e2e`,
       unit: project.paths.tests?.unit || `${project.paths.backend}/test/unit`,
       integration: project.paths.tests?.integration || `${project.paths.backend}/test/integration`
     },
     stepDefinitions: `${project.paths.backend}/test/e2e/step-definitions/`,
     support: `${project.paths.backend}/test/e2e/support/`,
     factories: `${project.paths.backend}/test/e2e/support/factories/`,
     specs: {
       backend: project.paths.specs?.backend || `specs/backend/`,
       api: `${project.paths.specs?.backend || 'specs/backend'}/api/`
     }
   };
   ```

4. **Load tech stack config**

   ```typescript
   const techStack = project.techStack.backend;
   // techStack.framework — e.g., 'nestjs'
   // techStack.architecture — e.g., 'cqrs', 'mvc'
   // techStack.database — e.g., 'postgresql'
   // techStack.testing — e.g., 'jest'
   ```

5. **Load backend testing config**

   ```typescript
   const testing = projectType.testing?.backend || {};
   // testing.databaseFactories — true if using factory pattern
   // testing.testcontainers — true if using Testcontainers
   // testing.authHeader — e.g., 'x-forwarded-access-token'
   // testing.worldClass — custom Cucumber World class
   ```

6. **Query Graphify for backend entities**

   ```typescript
   const existingEntities = await graphify.query(`
     MATCH (e:DomainEntity) WHERE e.project = $project RETURN e
   `, { project: projectName });

   const existingHandlers = await graphify.query(`
     MATCH (h:Function) WHERE h.project = $project AND h.type = 'handler' RETURN h
   `, { project: projectName });
   ```

7. **Query Wiki for backend patterns**

   ```typescript
   const patterns = await wiki.query(`
     Find backend testing patterns for: ${techStack.framework}
     Find DDD testing patterns
   `);
   ```

8. **Report to user**
   - Project: `${projectName}` (${techStack.framework} + ${techStack.architecture})
   - Database: `${techStack.database}`
   - Testing: `${techStack.testing}`
   - Factories: `${testing.databaseFactories ? 'enabled' : 'disabled'}`
   - Confirm before proceeding

---

## Phase 1: Detect Spec Type and Load Architecture

**Goal:** Determine spec type and load Architecture Specification.

**Actions:**

1. **Read BDD guidelines from project config:**

   ```typescript
   const bddGuidelines = await rlm.read({
     project: projectName,
     paths: [`${paths.backend}/BDD-GUIDELINES.md`, `${paths.backend}/bdd_feature_writing_guidelines.md`]
   });
   ```

2. **Detect spec type** by checking `{paths.specs.backend}/{feature-folder}/`:
   - `Architecture/` or `cqrs-contract/` exists → **Technical** or **Combined**
   - `UI/` exists → **UI** or **Combined**

3. **For Technical/Combined specs:**
   - Read Architecture Specification FIRST
   - Extract API contracts, CQRS commands/queries, domain events

4. **Check for centralized API specs:**

   ```typescript
   const hasCentralizedSpecs = await checkPathExists(paths.specs.api);
   if (hasCentralizedSpecs) {
     // List .yaml files
     // Check for existing discrepancy report
   }
   ```

5. Report detected spec type and confirm

---

## Phase 2: Generate Step Definition Scaffolds

**Goal:** Run Cucumber dry-run to identify undefined steps and generate scaffolds.

**Agent:** `step-definition-scaffolder`

**Actions:**

1. Create todo list with all phases
2. If feature path unclear, ask user:
   - Which feature file(s)?
   - Which app's E2E directory?
   - What domain name for step files?
3. Run Cucumber dry-run:

   ```bash
   {context.project.commands.testE2eDry}
   ```

4. Generate scaffold files:

   ```typescript
   `${paths.stepDefinitions}/{domain}-steps.ts`
   `${paths.stepDefinitions}/common-steps.ts`
   ```

5. Save scaffolds to temp directory
6. Summarize and confirm with user
7. **Wait for confirmation before proceeding**

---

## Phase 3: Implement Step Definitions

**Goal:** Transform scaffolds into complete implementations.

**Agent:** `step-definition-implementer`

**Actions:**

1. Read specifications in priority order:
   1. Centralized API Specs (`{paths.specs.api}/*.yaml`)
   2. Frontend Pact Contracts (if available)
   3. Feature BFFE Spec
   4. CQRS Contract
   5. Frontend discrepancy report (if exists)

2. If specs missing, ask user:
   - Where is the BFFE spec?
   - What API base URL?
   - Authentication requirements?

3. **Implement each step using project testing config:**

   **Given steps — Database seeding:**
   ```typescript
   if (testing.databaseFactories) {
     // Use factory pattern for seeding
     // e.g., await UserFactory.create({ name: 'Alice' })
   } else {
     // Use ORM/repository directly
     // e.g., await userRepository.save(new User('Alice'))
   }
   ```

   **When steps — API calls:**
   ```typescript
   // Using project's HTTP client (Axios, fetch, etc.)
   const response = await apiClient.post('/endpoint', payload, {
     headers: {
       [testing.authHeader]: 'mock-token' // if auth required
     }
   });
   ```

   **Then steps — Assertions:**
   ```typescript
   // Using project's assertion library (Jest, Vitest, etc.)
   expect(response.status).toBe(200);
   expect(response.data).toMatchObject(expected);
   ```

4. Create/update TypeScript interfaces in `{paths.support}/types.ts`
5. Summarize implementations
6. **Wait for confirmation before proceeding**

---

## Phase 4: Review Step Definitions

**Goal:** Review for quality, type safety, and BDD compliance.

**CRITICAL:** Do not skip.

**Agent:** `step-definition-reviewer`

**Actions:**

1. Review for:
   - TypeScript type safety (no `any`)
   - API client best practices
   - BDD alignment (real assertions, not stubs)
   - API spec compliance
   - Factory usage (if enabled)
2. Create todo list with issues
3. Fix issues or provide recommendations
4. Summarize
5. **Wait for confirmation before proceeding**

---

## Phase 5: Validate Red Phase

**Goal:** Verify step definitions fail before backend implementation.

**Agent:** `bdd-red-phase-validator`

**Actions:**

1. Ensure prerequisites:

   ```bash
   {context.project.commands.typecheck}
   ```

   If using Testcontainers:
   - Docker must be running

2. Run Cucumber tests:

   ```bash
   {context.project.commands.testE2e}
   ```

3. Analyze failures:
   - **Expected:** 404, empty data, assertion mismatches
   - **Unexpected:** TypeError, 401, 500
4. Fix unexpected failures
5. Generate HTML report
6. Summarize
7. **Wait for confirmation before proceeding**

---

## Phase 6: Review API Spec Alignment

**Goal:** Ensure backend aligns with centralized API specs.

**Actions:**

1. Read discrepancy report (if exists)
2. Verify implementations align with resolution decisions
3. If new discrepancies found:
   - Append to discrepancy report
   - Document proposed spec updates
4. Present complete report:
   - Endpoints aligned
   - Endpoints diverging (with reasons)
   - Proposed spec updates
5. Ask user to confirm
6. **Wait for confirmation before proceeding**

---

## Phase 7: Summarize and Index

**Goal:** Document accomplishments and update knowledge graph.

**Actions:**

1. Mark all todos complete
2. Summarize:
   - Step definition files created
   - Key decisions
   - Files modified
   - Test status (Red phase validated)
   - API spec alignment status

3. Prepare handoff:
   - Failing scenarios (backend roadmap)
   - API endpoints needed
   - Domain events to emit
   - Test report location

4. **Update Graphify**

   ```bash
   /graphify:index --project {projectName}
   ```

5. **Update project OKF**
   - Update `projects/{projectName}/okf/index.md`

---

## Commands

```bash
# Full workflow
/dna-bdd-backend-steps:dna-bdd-backend-features {featureFile} --project {projectName}

# Example
/dna-bdd-backend-steps:dna-bdd-backend-features test/e2e/features/dashboard.feature --project ip-hub
```

---

## Backend Architecture Adaptation

The skill adapts to the project's backend architecture:

| Architecture | Step Implementation |
|-------------|---------------------|
| **CQRS** | Given = command setup, When = command dispatch, Then = read model query |
| **MVC** | Given = model setup, When = controller action, Then = response assertion |
| **Hexagonal** | Given = port setup, When = use case execution, Then = port verification |

---

## Changes from Original Playbook

| Aspect | Original | Ported |
|--------|----------|--------|
| Paths | `apps/ip-hub-backend/` | `context.project.paths.backend` |
| Framework | Hardcoded NestJS/CQRS | `techStack.framework` + `techStack.architecture` |
| Commands | `pnpm nx test ip-hub-backend` | `context.project.commands.*` |
| Factories | Hardcoded Testcontainers | `testing.databaseFactories` (configurable) |
| Auth header | `x-forwarded-access-token` | `testing.authHeader` (configurable) |
| Domain layer | `libs/domain/src/` | `context.project.paths.domain` |
| API discovery | Manual file reading | `rlm.read()` + Graphify queries |
| Indexing | None | Graphify reindex |

---

## Source

Original: `.framework/agents/playbooks/bdd-backend-agents/commands/dna-bdd-backend-features.md`
