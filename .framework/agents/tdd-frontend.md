# TDD Frontend Agent (Project-Agnostic)

> Implements frontend components using TDD: **Red → Green → Validate → Clean**. Ported from playbook.

---

## Status

✅ **Ported Template** — 8-phase workflow with ProjectContext integration.

## Source

Original: `.framework/agents/playbooks/tdd-frontend-agents/README.md`

---

## Input

```typescript
interface FrontendTDDInput {
  projectName: string;
  featurePath: string;        // Path to .feature files
  scenarioName?: string;      // Specific scenario (optional)
  shortcut?: 'full' | 'implement' | 'validate' | 'refactor' | 'e2e-only';
  context: ProjectContext;
}
```

---

## 8-Phase Workflow

```
┌─────────────────────────────────────────────┐
│  Phase 1: Generate Tests (Red)              │
│  └─→ Tests fail (implementation missing)    │
├─────────────────────────────────────────────┤
│  Phase 2: Review Tests                      │
│  └─→ User confirms coverage and quality     │
├─────────────────────────────────────────────┤
│  Phase 3: Implement Code (Green)            │
│  └─→ Minimal code to make tests pass        │
├─────────────────────────────────────────────┤
│  Phase 4: Validate Green Status             │
│  └─→ Architecture, a11y, regression checks  │
├─────────────────────────────────────────────┤
│  Phase 5: BDD E2E Validation                │
│  └─→ End-to-end scenarios pass              │
├─────────────────────────────────────────────┤
│  Phase 6: Refactor (Clean)                  │
│  └─→ Improve code without changing behavior │
├─────────────────────────────────────────────┤
│  Phase 7: Validate After Refactoring        │
│  └─→ Confirm no regressions                 │
├─────────────────────────────────────────────┤
│  Phase 8: Summarize                         │
│  └─→ Document what was accomplished         │
└─────────────────────────────────────────────┘
```

---

## Execution

### Phase 0: Load Context

```typescript
const context = await loadProjectContext(projectName);
const { techStack, paths, domain } = context.project;

// Query Graphify for related components
const relatedComponents = await graphify.query(`
  MATCH (c:Component)
  WHERE c.project = $project
  RETURN c.name, c.path
`, { project: projectName });

// Query Wiki for frontend patterns
const patterns = await wiki.query(`
  Find patterns for: ${techStack.frontend.framework}
`);
```

### Phase 1: Generate Tests (Red)

Generate tests based on tech stack:

| Stack | Unit Tests | Integration Tests |
|-------|-----------|-------------------|
| Nuxt/Vue | Vitest + @vue/test-utils | @nuxt/test-utils |
| React/Next | Vitest + @testing-library/react | Playwright |
| Angular | Jasmine + TestBed | Cypress |

**Test targets:**
- `test/unit/` — Component logic tests
- `test/integration/` — Page/route tests
- `test/e2e/` — Cucumber scenarios

### Phase 2: Review Tests

User reviews generated tests for:
- Coverage completeness
- Assertion quality
- Edge case handling

### Phase 3: Implement Code (Green)

Generate minimal implementation:

```typescript
// Stack-agnostic component generation
const component = await generateComponent({
  framework: techStack.frontend.framework,  // 'nuxt' | 'react' | 'angular'
  testExpectations,
  relatedComponents,
  patterns
});
```

### Phase 4: Validate Green Status

Architecture compliance checks (framework-dependent):

| Framework | Validations |
|-----------|-------------|
| Nuxt/Vue | `<script setup lang="ts">`, typed props/emits, no `any` |
| React | Functional components, typed hooks, no `any` |
| Angular | Standalone components, typed inputs/outputs |

Accessibility checks:
- `data-testid` on interactive elements
- ARIA attributes on custom controls
- Semantic HTML
- Keyboard navigation

### Phase 5: BDD E2E Validation

Run Cucumber E2E tests against implementation.

### Phase 6: Refactor (Clean)

Refactoring opportunities:
- Component extraction
- Composable/hook extraction
- Type improvements
- Performance optimization

### Phase 7: Validate After Refactoring

Full test suite + regression check.

### Phase 8: Summarize

Document: tests generated, implementation completed, decisions made, next steps.

---

## Stack Support

| Framework | State | Testing | E2E | Status |
|-----------|-------|---------|-----|--------|
| Nuxt 4 / Vue 3 | Pinia | Vitest | Playwright | ✅ Target |
| React / Next.js | Zustand | Vitest | Playwright | ⏳ Future |
| Angular | NgRx | Jasmine | Cypress | ⏳ Future |

---

## Commands

```bash
# Full workflow
/fluentit-tdd-frontend:fluentit-tdd-implement specs/<feature>/*.feature --project ip-hub

# Shortcuts
/fluentit-tdd-frontend:fluentit-tdd-implement specs/<feature>/*.feature --shortcut=implement --project ip-hub
/fluentit-tdd-frontend:fluentit-tdd-implement specs/<feature>/*.feature --shortcut=validate --project ip-hub
/fluentit-tdd-frontend:fluentit-tdd-implement specs/<feature>/*.feature --shortcut=refactor --project ip-hub
```

---

## Changes from Original Playbook

| Aspect | Original | Ported |
|--------|----------|--------|
| Paths | `apps/ip-hub-frontend/` | `context.project.paths.frontend` |
| Framework | Hardcoded Nuxt/Vue | `context.project.techStack.frontend.framework` |
| Domain | IP Hub domain model | `context.project.domain` |
| Components | IP Hub component catalogue | `context.project.domain.components` |
| State | Pinia | `context.project.techStack.frontend.state` |
| Tests | Vitest | `context.project.techStack.frontend.testing` |
| Context loading | Manual file reads | RLM `loadProjectContext()` |
| Related code | File grepping | Graphify queries |

---

## Output

- Unit tests: `test/unit/*.spec.ts`
- Integration tests: `test/integration/*.spec.ts`
- Components: `components/**/*.vue` (or .tsx/.jsx)
- Composables: `composables/**/*.ts`
- Types: `types/**/*.ts`
