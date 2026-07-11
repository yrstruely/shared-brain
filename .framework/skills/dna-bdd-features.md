---
description: Project-agnostic BDD feature generation from PRDs, specs, and requirements. Generates Gherkin feature files with declarative style. Uses RLM for context loading.
argument-hint: Provide the spec folder path and project name (e.g., specs/frontend/dashboard/ --project ip-hub)
---

# BDD Feature Generator (Project-Agnostic)

> Generates Gherkin feature files from specifications. Ported from playbook to use ProjectContext and RLM. This is the **pipeline entry point**.

---

## Phase 0: Load Project Context

**Goal:** Load project configuration, domain knowledge, and existing features via RLM.

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
     specs: {
       frontend: project.paths.specs?.frontend || `specs/frontend/`,
       backend: project.paths.specs?.backend || `specs/backend/`,
     },
     features: project.paths.features || `features/`,
     docs: project.paths.docs || `documentation/`,
     output: specPath // User-provided spec folder
   };
   ```

4. **Load domain context**

   ```typescript
   const domain = project.domain;
   // domain.assetTypes — e.g., ['patent', 'trademark']
   // domain.jurisdictions — e.g., ['Dubai/GCC', 'PCT']
   // domain.currency — e.g., 'AED'
   // domain.userRoles — e.g., ['Applicant', 'Professional']
   // domain.personas — e.g., ['Alice', 'Bob', 'Carol']
   // domain.components — frontend component catalogue
   ```

5. **Query Graphify for existing features**

   ```typescript
   const existingFeatures = await graphify.query(`
     MATCH (f:Feature) WHERE f.project = $project RETURN f
   `, { project: projectName });

   const existingEntities = await graphify.query(`
     MATCH (e:DomainEntity) WHERE e.project = $project RETURN e
   `, { project: projectName });
   ```

6. **Query Wiki for patterns**

   ```typescript
   const patterns = await wiki.query(`
     Find BDD patterns for: ${project.techStack.frontend.framework}
     Find Gherkin best practices
   `);

   const antiPatterns = await wiki.query(`
     Find anti-patterns for: ${project.type}
   `);
   ```

7. **Discover spec folder contents via RLM**

   ```typescript
   const specContents = await rlm.explore({
     project: projectName,
     query: `List all files in ${specPath} and identify spec types`,
     maxTokens: 4000
   });
   ```

8. **Report to user**
   - Project: `${projectName}` (${project.type})
   - Spec path: `${specPath}`
   - Existing features: `${existingFeatures.length}`
   - Existing entities: `${existingEntities.length}`
   - Confirm before proceeding

---

## Phase 1: Detect Spec Type

**Goal:** Determine the specification type to guide feature generation.

**Actions:**

1. **Auto-detect spec type** by checking folders in `{specPath}`:

   | Found | Spec Type | Description |
   |-------|-----------|-------------|
   | `UI/` + `Architecture/` | `combined` | Visual + technical specs |
   | `Architecture/` only | `technical` | Backend/API focused |
   | `UI/` or `Detailed Specs/` | `ui` | Frontend/user focused |

2. **Detect from ProjectContext if not auto-detected:**

   ```typescript
   const specType = autoDetectSpecType(specPath) || projectType.defaultSpecType;
   ```

3. **For Technical/Combined specs:**
   - Read Architecture Specification from `{specPath}/Architecture/`
   - Extract API contracts, CQRS commands/queries, domain events

4. **Check for centralized API specs:**

   ```typescript
   const apiSpecsPath = `${paths.specs.backend}/api/`;
   // Check if centralized API specs exist
   // Pass to subsequent phases if found
   ```

5. **Report to user:**
   - Detected spec type: `${specType}`
   - Specification files found
   - Confirm before proceeding

---

## Phase 2: Generate Frontend Features

**Goal:** Understand requirements and generate frontend-oriented Gherkin feature files.

**Agent:** `bdd-features-generator`

**Spec Type Consideration:**
- **UI type:** Focus on visual specs, user interactions
- **Technical type:** SKIP this phase (no frontend features)
- **Combined type:** Generate frontend features, reference Architecture for API integration

**Actions:**

1. Create todo list with all phases
2. **Load BDD context from Wiki:**

   ```typescript
   const bddGuidelines = await wiki.query(`
     Find Gherkin best practices
     Find declarative scenario patterns
   `);
   ```

3. **Analyze existing features for consistency:**

   ```typescript
   const relatedFeatures = await graphify.query(`
     MATCH (f:Feature)
     WHERE f.project = $project
     AND f.path CONTAINS $domain
     RETURN f
   `, { project: projectName, domain: extractDomain(specPath) });
   ```

4. **Process specifications based on type:**

   **For UI/Combined:**
   - Review visual specs (screenshots, wireframes, Figma)
   - Extract behavioral requirements from visual designs
   - Identify user interactions, information displays, state changes

   **For all specs:**
   - Read Detailed Specs folder for written requirements
   - Translate into behavior-focused scenarios (WHAT, not HOW)

5. **Generate feature files:**

   ```typescript
   const features = await generateFeatures({
     specs,
     domain,              // From ProjectContext
     patterns,            // From Wiki
     existingFeatures,    // From Graphify
     outputPath: paths.features,
     techStack: project.techStack
   });
   ```

   **Gherkin template:**
   ```gherkin
   @[feature-tag]
   Feature: [Feature Name]
     In order to [business value]
     As a [user role]
     I want to [capability]

     Background:
       Given [common precondition]

     Rule: [Business rule 1]

       @frontend
       Scenario: [Happy path]
         Given [context]
         When [action]
         Then [outcome]

     # Gaps Identified:
     # 1. [Gap description]
   ```

6. **Apply domain-specific language:**
   - Use personas from `domain.personas` (Alice, Bob, Carol)
   - Use currency from `domain.currency` (AED, USD)
   - Use asset types from `domain.assetTypes`
   - Use jurisdictions from `domain.jurisdictions`

7. **Apply project-type tagging:**

   ```typescript
   const tags = projectType.tags || ['frontend', 'backend', 'integration'];
   // Add @frontend for UI scenarios
   // Add @backend for API scenarios
   // Add @architecture-aligned for Combined specs
   ```

8. Summarize understanding and confirm with user
9. **Wait for user review before proceeding**

---

## Phase 3: Refactor Frontend Features

**Goal:** Refactor generated features based on user feedback.

**CRITICAL:** Do not skip. User review is essential.

**Agent:** `bdd-features-refactorer`

**Actions:**

1. Review generated feature files for comments/changes
2. If user comments are unclear, ask for clarification
3. Create todo list with refactoring items
4. Refactor features:
   - Ensure declarative style (90%+ of scenarios)
   - Consistent domain terminology
   - Proper tagging
   - Complete gap documentation
5. Summarize changes and confirm with user
6. **Wait for user review before proceeding**

---

## Phase 4: Generate Non-Functional Features

**Goal:** Write comprehensive non-functional requirements as features.

**Agent:** `bdd-non-functional-requirements-generator`

**Actions:**

1. Review generated feature files
2. Analyze with non-functional focus:
   - Performance requirements
   - Security requirements
   - Accessibility requirements
   - Reliability requirements
3. Create todo list for NFR features
4. Generate NFR features:

   ```gherkin
   @nfr @performance
   Feature: Dashboard Performance
     Rule: Page load meets SLA

       Scenario: Dashboard loads within SLA
         Given 1000 concurrent users
         When the dashboard is accessed
         Then 95% of responses complete within 150ms
   ```

5. Summarize and confirm with user
6. **Wait for user review before proceeding**

---

## Phase 5: Refactor Non-Functional Features

**Goal:** Refactor NFR features based on user feedback.

**CRITICAL:** Do not skip.

**Agent:** `bdd-features-refactorer`

**Actions:**

1. Review NFR feature files
2. Apply improvements or fix regressions
3. Summarize changes and confirm with user
4. **Wait for user review before proceeding**

---

## Phase 6: Generate Backend Features

**Goal:** Generate backend features from Architecture Specification and/or frontend features.

**Agent:** `bdd-backend-features-generator`

**Spec Type Consideration:**
- **UI type:** Generate backend features IMPLIED by frontend features
- **Technical type:** Architecture Specification is PRIMARY source
- **Combined type:** Start with Architecture, cross-reference frontend

**Actions:**

1. **Read Architecture Specification** (for Technical/Combined):
   - Extract API contracts
   - CQRS command/query definitions
   - Domain events
   - Error response formats

2. **Query Graphify for backend entities:**

   ```typescript
   const backendEntities = await graphify.query(`
     MATCH (e:DomainEntity)
     WHERE e.project = $project
     AND e.boundedContext = $context
     RETURN e
   `, { project: projectName, context: extractBoundedContext(specPath) });
   ```

3. Analyze with backend focus:
   - API endpoints implied by frontend scenarios
   - CQRS operations needed
   - Domain events to emit
   - Data validation requirements

4. Generate backend features:

   ```gherkin
   @backend @api @architecture-aligned
   Scenario: GET /api/resource returns architecture-defined schema
     Given the architecture specifies the response schema:
       | field | type | required |
     When the client sends a GET request
     Then the response matches the schema
   ```

5. Summarize and confirm with user
6. **Wait for user review before proceeding**

---

## Phase 7: Refactor Backend Features

**Goal:** Refactor backend features based on user feedback.

**CRITICAL:** Do not skip.

**Agent:** `bdd-features-refactorer`

**Actions:**

1. Review backend feature files
2. Apply improvements:
   - API contract alignment
   - CQRS pattern compliance
   - Domain event completeness
3. Summarize changes and confirm with user
4. **Wait for user review before proceeding**

---

## Phase 8: Summarize and Index

**Goal:** Document what was accomplished and update knowledge graph.

**Actions:**

1. Mark all todos complete
2. Summarize:
   - **Spec Type Used:** `${specType}`
   - **Architecture Spec:** (if used) path and sections
   - **Frontend Features:** count and files
   - **Backend Features:** count and files
   - **NFR Features:** count and files
   - **Key Decisions:** documented assumptions
   - **Gaps Identified:** items needing clarification

3. **Update Graphify**

   ```bash
   /graphify:index --project {projectName}
   ```

4. **Extract concepts to wiki**

   New domain concepts discovered:
   - Create `wiki/concepts/{concept-name}.md`
   - Cross-reference with existing concepts

5. **Extract patterns to wiki**

   New patterns discovered:
   - Create `wiki/patterns/{pattern-name}.md`
   - Link from `.framework/registry/pattern-catalog.md`

6. **Update project OKF**
   - Update `projects/{projectName}/okf/index.md` with new features
   - Add ADRs for architectural decisions

---

## Commands

```bash
# Full workflow
/dna-bdd-features:dna-bdd-features {specPath} --project {projectName}

# Example
/dna-bdd-features:dna-bdd-features specs/frontend/dashboard/ --project ip-hub
```

---

## Changes from Original Playbook

| Aspect | Original | Ported |
|--------|----------|--------|
| Paths | `specs/frontend/`, `documentation/` | `context.project.paths.specs.*` |
| Domain | IP Hub patents/trademarks | `context.project.domain.*` |
| Currency | Hardcoded AED | `context.project.domain.currency` |
| Personas | Hardcoded Alice/Bob | `context.project.domain.personas` |
| Components | IP Hub catalogue | `context.project.domain.components` |
| Spec detection | Manual folder checks | Auto-detect + ProjectContext fallback |
| Feature discovery | Manual grep | `graphify.query()` |
| Patterns | None | `wiki.query()` for cross-project patterns |
| Consistency check | Manual file reading | RLM + Graphify for existing features |
| Indexing | None | Graphify + Wiki updates |

---

## Source

Original: `.framework/agents/playbooks/bdd-feature-agents/commands/dna-bdd-features.md`
