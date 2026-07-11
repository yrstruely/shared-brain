---
description: Project-agnostic frontend development guide. Orchestrates feature implementation from specs to production. Adapts to frontend framework.
argument-hint: Provide BDD feature files, design URLs, or component paths
---

# Frontend Development Guide (Project-Agnostic)

> Guides frontend feature implementation from requirements to delivery. Adapts to project's frontend framework and conventions.

---

## Phase 0: Load Project Context

**Goal:** Load frontend config, conventions, and existing components.

**Actions:**

1. **Load ProjectContext via RLM**

   ```typescript
   const context = await loadProjectContext(projectName);
   const { project, projectType } = context;
   ```

2. **Resolve paths**

   ```typescript
   const paths = {
     frontend: project.paths.frontend,
     components: `${project.paths.frontend}/components`,
     composables: `${project.paths.frontend}/composables`,
     pages: `${project.paths.frontend}/pages`,
     stores: `${project.paths.frontend}/stores`,
     types: `${project.paths.frontend}/types`,
     styles: `${project.paths.frontend}/styles`,
     tests: {
       unit: `${project.paths.frontend}/test/unit`,
       e2e: `${project.paths.frontend}/test/e2e`
     }
   };
   ```

3. **Load tech stack**

   ```typescript
   const techStack = project.techStack.frontend;
   // framework: 'nuxt', 'react', 'angular'
   // state: 'pinia', 'zustand', 'redux'
   // styling: 'tailwind', 'css-modules', 'styled-components'
   ```

4. **Discover existing components via RLM**

   ```typescript
   const existingComponents = await rlm.explore({
     project: projectName,
     path: paths.components,
     query: "List all existing components with their purposes"
   });
   ```

5. **Load frontend conventions**

   ```typescript
   const conventions = projectType.conventions?.frontend || {};
   // conventions.imports — auto-imports vs explicit
   // conventions.props — spread pattern, withDefaults, etc.
   // conventions.types — .d.ts files, inline types
   // conventions.styling — CSS variables, no hardcoded values
   ```

---

## Phase 1: Understand Requirements

**Goal:** Build complete picture of what needs implementing.

**Actions:**

1. Read BDD feature file for scenarios and acceptance criteria
2. If design URLs provided, fetch design context
3. Read existing step definitions for test IDs and UI behavior
4. Check mock API handlers for available endpoints
5. Summarize requirements and confirm with user

---

## Phase 2: Gap Analysis

**Goal:** Identify what exists vs what needs building.

**Actions:**

1. Discover existing components:
   ```typescript
   const components = await graphify.query(`
     MATCH (c:Component) WHERE c.project = $project RETURN c
   `, { project: projectName });
   ```

2. Discover existing composables:
   ```typescript
   const composables = await graphify.query(`
     MATCH (c:Function) WHERE c.project = $project AND c.type = 'composable' RETURN c
   `, { project: projectName });
   ```

3. Check API plugin methods
4. Check existing unit tests
5. Present gap analysis: done, missing, suggested order

**Wait for user confirmation.**

---

## Phase 3: Plan Implementation

**Goal:** Design the implementation approach.

**Actions:**

1. Identify components to create/modify
2. Plan prop interfaces and emit contracts (framework-specific):

   ```typescript
   // Vue/Nuxt:
   // const { myProp = 'default' } = defineProps<Props>();
   //
   // React:
   // interface Props { myProp?: string }
   // function Component({ myProp = 'default' }: Props)
   //
   // Angular:
   // @Input() myProp = 'default';
   ```

3. Identify API endpoints to wire up
4. Plan test coverage (unit + integration)
5. Present plan for approval

**Wait for user approval.**

---

## Phase 4: Implement

**Goal:** Build feature incrementally.

**Actions:**

1. Implement one scenario at a time
2. After each scenario:
   - Run unit tests: `{context.project.commands.test} --testPathPattern="{feature}"`
   - Run lint: `{context.project.commands.lint}`
   - Confirm with user before next scenario
3. Track progress with tasks

**Framework-specific implementation:**

```typescript
const framework = techStack.framework;
// Apply project-type specific patterns:
// - Vue: script setup, composables, Pinia
// - React: hooks, context, functional components
// - Angular: services, standalone components, signals
```

---

## Phase 5: Review

**Goal:** Ensure code quality and consistency.

**Actions:**

1. Review all created/modified files
2. Check TypeScript readability
3. Verify styling uses project conventions (CSS variables, no hardcoded values)
4. Confirm accessibility:
   - `data-testid` attributes
   - ARIA labels
   - Semantic HTML
   - Keyboard navigation
5. Suggest refactoring if needed

---

## Phase 6: Validate

**Goal:** Comprehensive validation.

**Actions:**

1. Run all unit tests: `{context.project.commands.test}`
2. Run lint: `{context.project.commands.lint}`
3. Run build: `{context.project.commands.build}`
4. If E2E tests exist: `{context.project.commands.testE2e} -- {featurePath}`
5. Summarize results

---

## Phase 7: Document and Index

**Goal:** Record what was done.

**Actions:**

1. Update or create implementation doc
2. Summarize: scenarios implemented, files created, tests passing
3. Note remaining gaps or follow-up work
4. **Update Graphify**

   ```bash
   /graphify:index --project {projectName}
   ```

---

## Accessibility Requirements

All implementations MUST meet:

1. **Semantic HTML first** — Use native elements before ARIA
2. **Keyboard accessible** — All interactive elements operable via keyboard
3. **ARIA as enhancement** — Only when native HTML insufficient

### Checklist

- [ ] Interactive elements use semantic HTML
- [ ] All interactive elements have `data-testid`
- [ ] Logical tab order follows visual layout
- [ ] Visible focus indicators (3:1 contrast minimum)
- [ ] All images have `alt` text
- [ ] Form inputs have associated labels
- [ ] Error messages use `aria-describedby`
- [ ] Custom widgets have ARIA roles
- [ ] Dynamic states use ARIA attributes

---

## Framework Adaptation

| Aspect | Vue/Nuxt | React/Next | Angular |
|--------|----------|------------|---------|
| Component | `<script setup>` | Functional | Standalone |
| State | Pinia/composables | Hooks/Zustand | Signals/services |
| Tests | Vitest + test-utils | Testing Library | Jasmine + TestBed |
| Styling | Scoped CSS / Tailwind | CSS Modules / Styled | Component CSS |

---

## Source

Original: `.framework/agents/playbooks/frontend-guide/commands/dna-frontend-guide.md`
