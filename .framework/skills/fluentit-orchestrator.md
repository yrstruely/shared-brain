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

**Step 1:** The user provides a project name and optionally a feature name.

**Step 2:** Read the OKF file:
- Use the Read tool to open `projects/{projectName}/okf/index.md`
- If this file doesn't exist, STOP and tell the user: "Project '{projectName}' not found. Create projects/{projectName}/okf/index.md first."

**Step 3:** Detect the current state by checking which files exist. Use the Bash tool to list directories:

```bash
# Check for specs (PRDs, requirements)
ls projects/{projectName}/specs/ 2>/dev/null || echo "No specs"

# Check for Gherkin features
ls projects/{projectName}/features/ 2>/dev/null || echo "No features"

# Check for step definitions
find projects/{projectName} -name "*.steps.ts" 2>/dev/null | head -5

# Check for implementation files
find projects/{projectName}/frontend/src -name "*.vue" 2>/dev/null | head -5
find projects/{projectName}/backend/src -name "*.controller.ts" 2>/dev/null | head -5

# Check for test files
find projects/{projectName} -name "*.spec.ts" 2>/dev/null | head -5
```

**Step 4:** Recommend the next skill based on state:

| State Detected | Recommended Skill | Why |
|---|---|---|
| No specs, no features | `fluentit-bdd-features` | Start with BDD feature generation from PRDs |
| Specs exist, no features | `fluentit-bdd-features` | Convert specs to Gherkin |
| Features exist, no steps | `fluentit-bdd-frontend-steps` + `fluentit-bdd-backend-steps` | Generate step definitions |
| Steps exist, no tests | `fluentit-tdd-frontend` + `fluentit-tdd-backend` | Implement the code |
| Tests fail | `fluentit-tdd-frontend` + `fluentit-tdd-backend` | Fix implementation |
| Code exists, unreviewed | `fluentit-review` | Clean up AI artifacts |
| Code clean, uncommitted | `fluentit-pr` | Create PR |

**Step 5:** Output a clear recommendation:

```
📋 Project: {projectName} | Feature: {featureName}

Detected State:
  ✅ OKF exists
  ❌ No specs found
  ❌ No features found
  ❌ No step definitions
  ❌ No implementation

Next Skill: fluentit-bdd-features
  → Reads specs/PRDs and generates Gherkin .feature files
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
