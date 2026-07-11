---
description: Detects project state and recommends the next FluentIT skill to run. Start here when you don't know what to do next.
argument-hint: Provide project name (required). Optionally provide feature name.
---

# Project Orchestrator

> Detects what exists in a project and tells you which skill to run next.

## Quick Start

```
fluentit-orchestrator --project hello-world --feature welcome
```

## What This Skill Does

1. **Reads the project OKF** to understand the project structure
2. **Checks what files already exist** (specs, features, steps, tests, code)
3. **Tells you the next skill to run** and why

## How to Use

The user provides a project name and optionally a feature name.

**Step 1: Read the OKF**

Use the Read tool to open `projects/{projectName}/okf/index.md`.

If this file doesn't exist, STOP and tell the user: "Project '{projectName}' not found. Create projects/{projectName}/okf/index.md first."

**Step 2: Resolve the Code Path**

Check if the OKF has a `codePaths` field.

**If `codePaths` is present:**
1. Determine the machine identifier in this priority:
   - Environment variable `FLUENTIT_MACHINE`
   - Local config file `~/.fluentit/machine.json` (read with Bash: `cat ~/.fluentit/machine.json 2>/dev/null || echo "{}"`)
   - Hostname: `hostname` command
2. Find the entry in `codePaths` where `machine` matches the identifier.
3. If found, set `{codeRoot}` to that entry's `path`.
4. If not found, STOP and tell the user:
   > "No code path configured for machine '{machineId}' in project '{projectName}'. Please provide the path, or add this to the OKF:\n> codePaths:\n>   - machine: '{machineId}'\n>     path: '<your path here>'"

**If `codePaths` is absent:**
- The project is vault-local. Set `{codeRoot}` = `projects/{projectName}/`.

**From now on, use:**
- `projects/{projectName}/` for OKF, specs, and documentation (vault side)
- `{codeRoot}/` for features, code, tests, and git operations (code side)

**⚠️ CRITICAL — Two-Root Rule:**
- Code files (features, tests, components, controllers) **MUST** go to `{codeRoot}/`
- **NEVER** write code files to `projects/{projectName}/` — that directory is for vault documentation only
- If you are unsure which path to use, STOP and ask the user

**Step 3: Detect the Current State**

Check vault-side artifacts (documentation):
```bash
# Check for specs (PRDs, requirements)
ls projects/{projectName}/specs/ 2>/dev/null || echo "No specs"
```

Check code-side artifacts — in dependency order:

**Scaffolding (must exist before implementation):**
```bash
# Check for domain entities
echo "=== Domain Entities ==="
find {codeRoot}/{domainPath} -name "*.entity.ts" 2>/dev/null | head -5 || echo "No entities"

# Check for API contracts (DTOs)
echo "=== API Contracts ==="
find {codeRoot}/{backendPath} -name "*.dto.ts" 2>/dev/null | head -5 || echo "No DTOs"
find {codeRoot}/{frontendPath} -name "*.api.ts" 2>/dev/null | head -5 || echo "No API services"

# Check for backend module scaffold
echo "=== Backend Modules ==="
find {codeRoot}/{backendPath} -name "*.module.ts" 2>/dev/null | head -5 || echo "No modules"

# Check for frontend structure
echo "=== Frontend Structure ==="
find {codeRoot}/{frontendPath} -name "*.vue" -o -name "*.tsx" 2>/dev/null | head -5 || echo "No frontend components"
```

**BDD artifacts:**
```bash
# Check for Gherkin features
echo "=== Features ==="
ls {codeRoot}/features/ 2>/dev/null || echo "No features"

# Check for step definitions
echo "=== Step Definitions ==="
find {codeRoot} -name "*.steps.ts" 2>/dev/null | head -5 || echo "No steps"
```

**TDD artifacts:**
```bash
# Check for test files
echo "=== Tests ==="
find {codeRoot} -name "*.spec.ts" 2>/dev/null | head -5 || echo "No tests"

# Check for implementation files
echo "=== Implementation ==="
find {codeRoot}/{backendPath} -name "*.controller.ts" 2>/dev/null | head -5 || echo "No controllers"
find {codeRoot}/{frontendPath} -name "*.vue" 2>/dev/null | head -5 || echo "No Vue components"
```

Note: `{frontendPath}`, `{backendPath}`, `{domainPath}` come from the OKF `paths` map.

**Step 4: Recommend the Next Skill**

Recommend the next skill based on state, in pipeline order:

**Pipeline Order:** Discovery → Scaffold → BDD → TDD → Review → PR

| State Detected | Recommended Skill | Phase | Why |
|---|---|---|---|
| No domain entities | `fluentit-domain-entity` | Discovery | Design the domain model first |
| No API contracts (DTOs) | `fluentit-api-contracts` | Discovery | Define contracts before implementation |
| No backend module scaffold | `fluentit-backend-module` | Scaffold | Scaffold module structure |
| No frontend structure | `fluentit-frontend-guide` | Scaffold | Set up frontend architecture |
| No specs, no features | `fluentit-bdd-features` | BDD | Start with BDD feature generation from PRDs |
| Specs exist, no features | `fluentit-bdd-features` | BDD | Convert specs to Gherkin |
| Features exist, no steps | `fluentit-bdd-frontend-steps` + `fluentit-bdd-backend-steps` | BDD | Generate step definitions |
| Steps exist, no tests | `fluentit-tdd-frontend` + `fluentit-tdd-backend` | TDD | Implement the code |
| Tests fail | `fluentit-tdd-frontend` + `fluentit-tdd-backend` | TDD | Fix implementation |
| Code exists, unreviewed | `fluentit-review` | Review | Clean up AI artifacts |
| Code clean, uncommitted | `fluentit-pr` | PR | Create PR |

**Important:** Always check scaffolding BEFORE BDD. If entities, DTOs, or module structure are missing, do Discovery/Scaffold first.

**Step 5: Output the Recommendation**

Output a clear recommendation:

```
📋 Project: {projectName} | Feature: {featureName}
📂 Code Directory: {codeRoot}
🗄️  Vault OKF: projects/{projectName}/okf/index.md

Detected State:
  ✅ OKF exists
  [Scaffolding]
    ❌/✅ Domain entities
    ❌/✅ API contracts (DTOs)
    ❌/✅ Backend modules
    ❌/✅ Frontend structure
  [BDD]
    ❌/✅ Specs/PRDs
    ❌/✅ Gherkin features
    ❌/✅ Step definitions
  [TDD]
    ❌/✅ Tests
    ❌/✅ Implementation
  [Review]
    ❌/✅ Code reviewed
    ❌/✅ Committed

Next Skill: {recommendedSkill}
  → {description}
  → Writes to: {outputPath}
  → Command: {recommendedSkill} --project {projectName} --feature {featureName}

Dependencies: {dependencies}
```

## Error Handling

| Problem | Response |
|---------|----------|
| OKF file missing | "Create projects/{name}/okf/index.md first. See setup-instructions/WORKFLOW.md for the template." |
| Project directory missing | "Run: mkdir -p projects/{name}/okf && create the index.md" |
| Feature name not provided | "Please provide a feature name: fluentit-orchestrator --project {name} --feature {feature}" |
| Multiple missing phases | List them in pipeline order and recommend starting with the first |
| Scaffolding missing (no entities/DTOs/modules) | "Run scaffolding first: fluentit-domain-entity, fluentit-api-contracts, fluentit-backend-module, fluentit-frontend-guide" |
| No matching codePaths entry | "No code path configured for machine '{id}'. Provide the path or add it to the OKF." |

## Skill Registry

| Skill | Phase | Order | Can Parallel |
|---|---|---|---|
| `fluentit-domain-entity` | Discovery | 1 | No |
| `fluentit-api-contracts` | Discovery | 2 | No |
| `fluentit-backend-module` | Scaffold | 3 | No |
| `fluentit-frontend-guide` | Scaffold | 4 | No |
| `fluentit-bdd-features` | BDD | 5 | No |
| `fluentit-bdd-frontend-steps` | BDD | 6 | Yes (with backend steps) |
| `fluentit-bdd-backend-steps` | BDD | 6 | Yes (with frontend steps) |
| `fluentit-tdd-frontend` | TDD | 7 | Yes (with backend TDD) |
| `fluentit-tdd-backend` | TDD | 7 | Yes (with frontend TDD) |
| `fluentit-review` | Review | 8 | No |
| `fluentit-pr` | PR | 9 | No |

## Important Notes

- This skill **reads files** and **makes recommendations**. It does not write code.
- The user must manually run the recommended skill next.
- **Scaffolding comes before BDD.** If domain entities, API contracts, or module structure are missing, the orchestrator recommends Discovery/Scaffold skills first.
- Skills are in `~/.claude/skills/` and loaded when Claude Code starts.
