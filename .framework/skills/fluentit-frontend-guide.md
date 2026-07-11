---
description: Guides frontend feature implementation from specs to delivery. Adapts to Vue/React/Angular.
argument-hint: Provide feature name and project name.
---

# Frontend Development Guide

> Guides frontend feature implementation from requirements to delivery.

## How to Use

```
fluentit-frontend-guide --project hello-world --feature welcome
```

## What This Skill Does

1. Reads the OKF for frontend framework info
2. Reads the feature file
3. Implements pages, components, and composables
4. Runs tests and build

## Step-by-Step

### Step 1: Read Context

- OKF: `projects/{projectName}/okf/index.md`
- Feature: `{codeRoot}/features/{featureName}.feature`

### Step 2: Resolve the Code Path

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

### Step 3: Plan Implementation

Identify what to build:
- Pages needed
- Components needed
- API calls needed
- State management needed

Present plan to user. Wait for confirmation.

### Step 3: Implement

Create files one at a time:
1. Types/interfaces
2. API service/composable
3. Components
4. Pages
5. Tests

After each file, run tests:
```bash
cd {codeRoot}/{frontendPath} && npm test
```

### Step 5: Validate

```bash
cd {codeRoot}/{frontendPath} && npm run build
```

## Error Handling

| Problem | Response |
|---------|----------|
| No feature file | "Run fluentit-bdd-features first." |
| Build fails | Fix TypeScript errors, missing imports |
| Tests fail | Debug component rendering, mock API calls |
