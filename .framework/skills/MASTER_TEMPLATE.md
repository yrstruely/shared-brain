---
description: Master template for porting project-specific playbook skills to project-agnostic, RLM-aware framework skills
argument-hint: Use this template as a reference when porting any playbook skill
---

# Skill Porting Master Template

> How to convert any project-specific playbook skill into a project-agnostic, RLM-aware framework skill.

---

## The Porting Formula

Every ported skill follows this structure:

```
Phase 0: Load ProjectContext (NEW — replaces manual file reading)
Phase 1-N: Original phases (with paths/commands abstracted)
Phase N+1: Summarize + Update Graphify/Wiki (NEW — indexes what was created)
```

---

## Phase 0: Load ProjectContext (REQUIRED for ALL skills)

This phase is **added to every ported skill**. It replaces scattered file reads with a single RLM context load.

```markdown
## Phase 0: Load Project Context

**Goal:** Load project configuration, tech stack, and relevant codebase context via RLM.

**Actions:**

1. **Load ProjectContext via RLM**

   ```typescript
   const context = await loadProjectContext(projectName);
   // context.project.name, .type, .paths, .techStack, .domain, .commands
   // context.wiki.patterns, .antiPatterns
   // context.graph.entities, .features
   ```

2. **Validate project is initialized**
   - Check `projects/{name}/okf/index.md` exists
   - If not, prompt: `/framework:init-project --name {name} --type {type}`

3. **Load project-type configuration**
   - Read `.framework/templates/project-types/{type}.md`
   - Extract: default paths, test commands, architecture validations

4. **Query Graphify for existing code**
   - Find existing entities: `MATCH (e:DomainEntity) WHERE e.project = $project`
   - Find existing features: `MATCH (f:Feature) WHERE f.project = $project`
   - Find related patterns from wiki

5. **Report to user**
   - Project name, type, tech stack
   - Existing entities/features found
   - Confirm before proceeding
```

---

## Path Abstraction Cheat Sheet

Replace these hardcoded patterns with ProjectContext variables:

| Original (IP Hub) | ProjectContext Variable | Description |
|-------------------|------------------------|-------------|
| `apps/ip-hub-frontend/` | `context.project.paths.frontend` | Frontend app root |
| `apps/ip-hub-backend/` | `context.project.paths.backend` | Backend app root |
| `libs/domain/src/` | `context.project.paths.domain` | Domain library root |
| `specs/frontend/` | `context.project.paths.specs.frontend` | Frontend specs |
| `specs/backend/` | `context.project.paths.specs.backend` | Backend specs |
| `features/` | `context.project.paths.features` | Feature files |
| `test/unit/` | `context.project.paths.tests.unit` | Unit tests |
| `test/integration/` | `context.project.paths.tests.integration` | Integration tests |
| `test/e2e/` | `context.project.paths.tests.e2e` | E2E tests |
| `documentation/` | `context.project.paths.docs` | Documentation |
| `context/` | `context.project.paths.agentsContext` | Agent context files |

---

## Command Abstraction Cheat Sheet

Replace hardcoded commands with ProjectContext commands:

| Original | ProjectContext Variable |
|----------|------------------------|
| `pnpm nx test ip-hub-backend` | `context.project.commands.test` |
| `pnpm nx test:integration ip-hub-backend` | `context.project.commands.testIntegration` |
| `pnpm nx test:e2e ip-hub-backend` | `context.project.commands.testE2e` |
| `pnpm nx lint ip-hub-backend` | `context.project.commands.lint` |
| `npx tsc --noEmit -p apps/ip-hub-backend/tsconfig.app.json` | `context.project.commands.typecheck` |
| `pnpm nx build ip-hub-backend` | `context.project.commands.build` |

---

## RLM Integration Hooks

Add these hooks at strategic points in each skill:

### Hook 1: Before File Discovery

**Before (manual):**
```markdown
Read existing features in `specs/frontend/` to understand patterns.
```

**After (RLM):**
```markdown
Query Graphify for existing features:
```typescript
const existingFeatures = await graphify.query(`
  MATCH (f:Feature) WHERE f.project = $project RETURN f
`, { project: projectName });
```
```

### Hook 2: Before Pattern Reference

**Before (manual):**
```markdown
Read `documentation/Technical Project Context/Domain Model/` for entity definitions.
```

**After (RLM + Wiki):**
```markdown
Query Wiki for domain patterns:
```typescript
const domainPatterns = await wiki.query(`
  Find domain patterns for: ${context.project.type}
  Find entity definitions for: ${featureDomain}
`);
```

### Hook 3: Before Implementation

**Before (manual):**
```markdown
Review existing codebase patterns in `apps/ip-hub-frontend/app/components/`.
```

**After (RLM):**
```typescript
const codePatterns = await rlm.explore({
  project: projectName,
  query: "Find existing component patterns for this feature domain",
  maxTokens: 8000
});
```

### Hook 4: After Completion (NEW)

**Add to every skill:**
```markdown
## Final Phase: Index and Update

**Goal:** Update Graphify and Wiki with what was created.

**Actions:**

1. **Reindex project code**
   ```bash
   /graphify:index --project {projectName}
   ```

2. **Extract patterns to wiki**
   - Identify new patterns discovered during implementation
   - Create/update `wiki/patterns/{pattern-name}.md`

3. **Update project OKF**
   - Add ADRs for architectural decisions
   - Update `projects/{name}/okf/index.md` with new features
```

---

## Tech Stack Abstraction

Replace framework-specific instructions with tech-stack-agnostic ones:

### Before (Vue/Nuxt specific):
```markdown
- All components use `<script setup lang="ts">`
- Props defined with `defineProps<Props>()`
- Emits defined with `defineEmits<{...}>()`
```

### After (project-type driven):
```markdown
Validate frontend architecture:
```typescript
const validations = context.projectType.validations.frontend;
// e.g., for Nuxt/Vue: script setup, typed props/emits
// e.g., for React: functional components, typed hooks
// e.g., for Angular: standalone components, typed inputs
```
Apply each validation from the project-type config.
```

---

## Domain Context Abstraction

Replace IP Hub domain with dynamic domain loading:

### Before (hardcoded):
```markdown
**Asset Types:** Patents, Trademarks, Copyrights
**Currency:** AED
**Jurisdictions:** Dubai/GCC, PCT, USPTO
```

### After (dynamic):
```markdown
**Domain Context:**
```typescript
const domain = context.project.domain;
// domain.assetTypes — e.g., ['patent', 'trademark', 'copyright']
// domain.currency — e.g., 'AED'
// domain.jurisdictions — e.g., ['Dubai/GCC', 'PCT', 'USPTO']
// domain.userRoles — e.g., ['Applicant', 'IP Professional']
```
Use domain terminology from project config, not hardcoded values.
```

---

## Ported Skill Checklist

For each skill you port, verify:

- [ ] Phase 0 added: `loadProjectContext(projectName)`
- [ ] No hardcoded project names (ip-hub, etc.)
- [ ] No hardcoded paths — all use `context.project.paths.*`
- [ ] No hardcoded commands — all use `context.project.commands.*`
- [ ] No hardcoded domain terms — all use `context.project.domain.*`
- [ ] Graphify queries replace file grepping
- [ ] Wiki queries replace manual pattern docs
- [ ] RLM context loading replaces manual file reading
- [ ] Final phase added: reindex + update wiki
- [ ] Tested on IP Hub to verify it still works

---

## Example: Before vs After

### Before (Project-Specific)
```markdown
## Phase 3: Implement Step Definitions

Verify scaffolds are created in `apps/ip-hub-frontend/features/step-definitions/`.
Ensure proper use of `@playwright/test` expect and `toTestId()` helper.
```

### After (Project-Agnostic)
```markdown
## Phase 3: Implement Step Definitions

```typescript
const paths = context.project.paths;
const stepDefPath = `${paths.frontend}/${paths.tests.e2e}/step-definitions/`;
```

Verify scaffolds are created in `{stepDefPath}`.

Ensure proper use of:
- `{context.project.techStack.frontend.testing}` expect (from project test framework)
- `toTestId()` helper (if available in project test utils)
- Proper TypeScript types (no `any`)
```

---

## Next Steps

1. Use this template to port `dna-tdd-backend` (the most complex skill)
2. Test the ported skill on IP Hub
3. Use the TDD backend port as a pattern for the remaining skills
4. Ingest all ported skills into the wiki

---

*See [[.framework/skills/dna-tdd-backend|Ported TDD Backend Skill]] for the concrete implementation of this template.*
