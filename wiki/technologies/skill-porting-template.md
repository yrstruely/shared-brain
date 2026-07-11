> **Type:** Reference
> **Source:** `.framework/skills/MASTER_TEMPLATE.md`
> **Related:** All [[wiki/technologies/index#Framework Skills|framework skills]]

# Skill Porting Master Template

How to convert any project-specific playbook skill into a project-agnostic, RLM-aware framework skill.

---

## The Porting Formula

Every ported skill follows this structure:

```
Phase 0: Load ProjectContext (NEW — replaces manual file reading)
Phase 1-N: Original phases (with paths/commands abstracted)
Phase N+1: Summarize + Update Graphify/Wiki (NEW — indexes what was created)
```

## Phase 0: Load ProjectContext (REQUIRED)

Replaces scattered file reads with a single RLM context load:

```typescript
const context = await loadProjectContext(projectName);
const { project, projectType, graph, wiki } = context;
```

## Path Abstraction Cheat Sheet

| Before (Hardcoded) | After (ProjectContext) |
|---|---|
| `src/frontend/` | `project.paths.frontend` |
| `src/backend/` | `project.paths.backend` |
| `libs/domain/` | `project.paths.domain` |
| `test/unit/` | `project.paths.tests.unit` |
| `test/e2e/` | `project.paths.tests.e2e` |
| `specs/` | `project.paths.specs` |

## When to Use

Apply this template when:
- Porting a playbook skill to the framework
- Creating a new project-agnostic skill
- Refactoring an existing skill for RLM support
