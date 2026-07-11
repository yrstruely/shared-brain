> **Type:** Skill
> **Source:** `.framework/skills/dna-tdd-frontend.md`
> **Related:** [[wiki/technologies/dna-bdd-frontend-steps|BDD Frontend Steps]], [[wiki/technologies/rlm|RLM]], [[wiki/patterns/tdd-red-green-clean|TDD Red-Green-Clean]]

# Frontend TDD Implementation

**Red → Green → Validate → Clean** cycle for frontend features. Project-agnostic skill ported to use [[wiki/technologies/rlm|RLM]] for context loading.

---

## Purpose

Implements frontend features from BDD specs using strict TDD cycles with accessibility-first approach.

## Pipeline

```
Phase 0: Load Project Context (via RLM)
Phase 1: Read Feature + Steps
Phase 2: Identify Component Scope
Phase 3: Write Failing Tests (RED)
Phase 4: Implement Minimal Code (GREEN)
Phase 5: Accessibility Validation
Phase 6: Refactor (CLEAN)
Phase 7: Update Step Definitions
Phase 8: Summarize + Index
```

## Key Outputs

- Component implementation
- Unit + integration tests
- Accessibility audit results
- Updated step definitions

## Usage

```bash
# Within a project with initialized OKF
claude /framework:tdd-frontend --project ip-hub --feature features/dashboard.feature
```

---

## Agent Architecture

```typescript
interface FrontendTDDInput {
  feature: Feature;           // Gherkin feature
  steps: StepDefinition[];    // Generated step definitions
  context: ProjectContext;    // From RLM loader
  componentPath: string;      // Where to write component
  testPath: string;           // Where to write tests
}

async function implementFrontend(input: FrontendTDDInput): Promise<Implementation> {
  // 1. Query graph for related components
  const related = await graphify.query(`
    MATCH (c:Component)<-[:DEPENDS_ON]-(d)
    WHERE c.feature = $feature
    RETURN d
  `, { feature: input.feature.name });

  // 2. Load patterns from wiki
  const patterns = await wiki.query(`
    Find patterns for: ${input.context.project.techStack.frontend.framework}
  `);

  // 3. Generate failing test (RED)
  const test = await generateTest({ feature: input.feature, patterns });

  // 4. Generate implementation (GREEN)
  const impl = await generateImplementation({ test, related, patterns });

  // 5. Refactor (CLEAN)
  const refactored = await refactor({ impl, patterns });

  return { test, implementation: refactored };
}
```

---

## TDD Cycle Verification

After each implementation, verify:

1. **RED** — Test fails with meaningful error
2. **GREEN** — Test passes with minimal implementation
3. **CLEAN** — Refactored, no duplication, follows patterns

```bash
npm test -- --watchAll=false
# Should show: PASS for new tests, no regressions
```
