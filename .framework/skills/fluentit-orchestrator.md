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

Check code-side artifacts (implementation):
```bash
# Check for Gherkin features
ls {codeRoot}/features/ 2>/dev/null || echo "No features"

# Check for step definitions
find {codeRoot} -name "*.steps.ts" 2>/dev/null | head -5

# Check for implementation files
find {codeRoot}/{frontendPath} -name "*.vue" 2>/dev/null | head -5
find {codeRoot}/{backendPath} -name "*.controller.ts" 2>/dev/null | head -5

# Check for test files
find {codeRoot} -name "*.spec.ts" 2>/dev/null | head -5
```

Note: `{frontendPath}` and `{backendPath}` come from the OKF `paths` map.

**Step 4: Recommend the Next Skill**

Recommend the next skill based on state:

| State Detected | Recommended Skill | Why |
|---|---|---|
| No specs, no features | `fluentit-bdd-features` | Start with BDD feature generation from PRDs |
| Specs exist, no features | `fluentit-bdd-features` | Convert specs to Gherkin |
| Features exist, no steps | `fluentit-bdd-frontend-steps` + `fluentit-bdd-backend-steps` | Generate step definitions |
| Steps exist, no tests | `fluentit-tdd-frontend` + `fluentit-tdd-backend` | Implement the code |
| Tests fail | `fluentit-tdd-frontend` + `fluentit-tdd-backend` | Fix implementation |
| Code exists, unreviewed | `fluentit-review` | Clean up AI artifacts |
| Code clean, uncommitted | `fluentit-pr` | Create PR |

**Step 5: Output the Recommendation**

Output a clear recommendation:

```
📋 Project: {projectName} | Feature: {featureName}
📂 Code Directory: {codeRoot}
🗄️  Vault OKF: projects/{projectName}/okf/index.md

Detected State:
  ✅ OKF exists
  ❌ No specs found
  ❌ No features found
  ❌ No step definitions
  ❌ No implementation

Next Skill: fluentit-bdd-features
  → Reads specs/PRDs and generates Gherkin .feature files
  → Writes features to: {codeRoot}/features/
  → Command: fluentit-bdd-features --project {projectName} --specs specs/

Dependencies: None (starting from scratch)
```

## Error Handling

| Problem | Response |
|---------|----------|
| OKF file missing | "Create projects/{name}/okf/index.md first. See setup-instructions/WORKFLOW.md for the template." |
| Project directory missing | "Run: mkdir -p projects/{name}/okf && create the index.md" |
| Feature name not provided | "Please provide a feature name: fluentit-orchestrator --project {name} --feature {feature}" |
| Multiple missing phases | List them in order and recommend starting with the first |
| No matching codePaths entry | "No code path configured for machine '{id}'. Provide the path or add it to the OKF." |

## Skill Registry

| Skill | Phase | Can Parallel |
|---|---|---|
| `fluentit-bdd-features` | BDD | No |
| `fluentit-bdd-frontend-steps` | BDD | Yes (with backend steps) |
| `fluentit-bdd-backend-steps` | BDD | Yes (with frontend steps) |
| `fluentit-tdd-frontend` | TDD | Yes (with backend TDD) |
| `fluentit-tdd-backend` | TDD | Yes (with frontend TDD) |
| `fluentit-domain-entity` | Discovery | No |
| `fluentit-api-contracts` | Discovery | No |
| `fluentit-backend-module` | Scaffold | No |
| `fluentit-frontend-guide` | Scaffold | No |
| `fluentit-review` | Review | No |
| `fluentit-pr` | PR | No |

## Important Notes

- This skill **reads files** and **makes recommendations**. It does not write code.
- The user must manually run the recommended skill next.
- Skills are in `~/.claude/skills/` and loaded when Claude Code starts.
