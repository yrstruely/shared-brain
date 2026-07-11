---
aliases:
  - "Project Context"
  - "project context object"
  - "context abstraction"
  - "project metadata"
  - "project configuration object"
generation_complete: true
---


> **Type:** Concept
> **Source:** `.framework/skills/` — Framework skills ported from playbooks
> **Related:** [[wiki/patterns/bdd-pipeline|BDD Pipeline]], [[wiki/patterns/tdd-red-green-clean|TDD Red-Green-Clean]], [[wiki/technologies/rlm|RLM]]

# ProjectContext

**ProjectContext** is the central abstraction that makes all framework skills project-agnostic. Instead of hardcoded paths, domain terms, and commands, every skill receives a `ProjectContext` object loaded dynamically via RLM.

---

## Structure

```typescript
interface ProjectContext {
  project: {
    name: string;
    type: string;
    paths: {
      root: string;
      frontend: string;
      backend: string;
      domain: string;
      features: string;
      specs: { frontend: string; backend: string };
      tests: { unit: string; integration: string; e2e: string };
      docs: string;
    };
    techStack: {
      frontend: { framework: string; state: string; testing: string; e2e: string };
      backend: { framework: string; architecture: string; database: string; testing: string };
    };
    domain: {
      assetTypes: string[];
      jurisdictions: string[];
      currency: string;
      userRoles: string[];
      personas: string[];
      components: Component[];
    };
    commands: {
      test: string;
      testIntegration: string;
      testE2e: string;
      lint: string;
      typecheck: string;
      build: string;
    };
  };
  projectType: {
    patterns: Pattern[];
    validations: { frontend: Validation[]; backend: Validation[] };
    tooling: { frontend: Tooling; backend: Tooling };
  };
  wiki: {
    patterns: Pattern[];
    antiPatterns: AntiPattern[];
  };
  graph: {
    entities: DomainEntity[];
    features: Feature[];
  };
}
```

---

## How It Works

### Phase 0 of Every Skill

Every ported skill starts with:

```typescript
const context = await loadProjectContext(projectName);
```

This single call replaces dozens of hardcoded paths and conventions.

### Path Resolution Example

**Before (IP Hub-specific):**
```typescript
const stepDefPath = 'apps/ip-hub-frontend/features/step-definitions/';
```

**After (ProjectContext):**
```typescript
const stepDefPath = `${context.project.paths.frontend}/features/step-definitions/`;
```

### Command Resolution Example

**Before:**
```bash
pnpm nx test ip-hub-backend
```

**After:**
```bash
${context.project.commands.test}
```

---

## Loading Process

1. **Read OKF index** — `projects/{name}/okf/index.md`
2. **Load project-type config** — `.framework/templates/project-types/{type}.md`
3. **Query Graphify** — existing entities, features, components
4. **Query Wiki** — patterns, anti-patterns for this tech stack
5. **Return structured context** — ~15k tokens of highly relevant context

---

## Skills Using ProjectContext

All 11 ported skills use ProjectContext:

| Skill | What It Loads |
|-------|--------------|
| BDD Feature Generator | Domain terms, personas, existing features |
| BDD Frontend Steps | Component catalogue, E2E framework, mock tooling |
| BDD Backend Steps | Database factories, auth headers, API specs |
| TDD Frontend | Test framework, component patterns, a11y rules |
| TDD Backend | DDD validations, CQRS patterns, test commands |
| Domain Entity | Existing entity conventions, value object patterns |
| API Contracts | DTO conventions, frontend API layer patterns |
| Backend Module | Module conventions, ORM patterns, controller patterns |
| Frontend Guide | Styling conventions, component library, a11y checklist |
| Pull Request | Git provider, reviewers, CI checks |
| Code Review | Project coding conventions |

---

## Benefits

| Benefit | Description |
|---------|-------------|
| **Project-agnostic** | Same skill works for IP Hub, billing-service, any future project |
| **Consistent** | All skills use the same paths, commands, domain terms |
| **Discoverable** | RLM explores codebase instead of hardcoding |
| **Maintainable** | Change project structure in one place (OKF index) |
| **Testable** | Load context for any project, verify skill works |

---

## Related

- [[wiki/technologies/rlm|RLM]] — Loads ProjectContext recursively
- [[wiki/patterns/bdd-pipeline|BDD Pipeline]] — First skill to use ProjectContext
- [[concepts/rlm-context-loader|rlm-context-loader]]
- [[projects/ip-hub/okf/index|IP Hub OKF]] — Example project configuration


## Related Pages
- Domain Entity skill loads project context as its first phase to inform entity design. [[concepts/domain-entity|domain-entity]]
- The RLM engine loads ProjectContext data for recursive exploration. [[concepts/rlm-context-loader|rlm-context-loader]]
- The Project Orchestrator detects the project state by analyzing the existing project context (specs, features, steps, implementation) to decide the next skill to run. [[entities/project-orchestrator|Project Orchestrator]]
- The Backend Module pipeline begins by loading project context via RLM, enabling adaptation to architectures like CQRS, MVC, or Hexagonal. [[technologies/fluentit-backend-module|fluentit-backend-module]]
- The Skill Porting Master Template includes a path abstraction cheat sheet that maps hardcoded paths to Project Context properties. [[concepts/skill-porting-master-template]]
- Phase 0 of the BDD Pipeline loads ProjectContext to drive feature generation [[patterns/bdd-pipeline|BDD Pipeline]]