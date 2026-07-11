---
description: Cleans up AI-generated code to look human-written. Removes verbose comments and simplifies over-engineered patterns.
argument-hint: Provide project name. Reviews uncommitted changes by default.
---

# Code Review

> Cleans up AI-generated code. Removes artifacts, improves naming, ensures consistency.

## How to Use

```
fluentit-review --project hello-world
```

## What This Skill Does

1. Checks what files changed (git status)
2. Reads each changed file
3. Suggests or applies cleanups

## Step-by-Step

### Pre-step: Read the OKF and Resolve Code Path

Read `projects/{projectName}/okf/index.md`.

If the OKF doesn't exist, STOP and tell the user: "Project '{projectName}' not found. Create the OKF first."

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

### Step 1: Detect Scope

```bash
cd {codeRoot} && git status --short
```

If no uncommitted changes, tell user: "No changes to review. Make some changes first."

### Step 2: Read Changed Files

For each modified file, use the Read tool to see the content.

### Step 3: Check for AI Artifacts

Look for these common patterns:

| Artifact | Fix |
|----------|-----|
| Verbose comments (`// This function does...`) | Remove or simplify |
| `console.log` statements | Remove |
| Overly defensive null checks | Simplify where safe |
| `any` types | Replace with proper types |
| Generated boilerplate comments | Remove |
| Inconsistent naming | Standardize |
| Magic numbers | Extract to constants |
| Duplicate code | Extract to shared function |

### Step 4: Apply Cleanups

Use the Edit tool to make changes. For each file:
1. Show the user what will change
2. Apply the edit
3. Confirm

### Step 5: Run Checks

```bash
cd {codeRoot} && npm run lint 2>&1
```

### Step 6: Report

```
✅ Review Complete

Files reviewed: {count}
Changes made:
  - {file 1}: {changes}
  - {file 2}: {changes}

Next: fluentit-pr --project {name}
```

## Important Notes

- **Preserve functionality** — never change behavior, only style/structure
- **Ask before changing** — show the user what you plan to change
- **Respect project conventions** — follow the existing code style
