---
description: Pull request workflow. Commits changes, pushes, and creates a PR.
argument-hint: Provide project name and optional ticket number.
---

# Pull Request Workflow

> Commits changes, pushes to remote, and creates a pull request.

## How to Use

```
fluentit-pr --project hello-world --ticket PROJ-123
```

## What This Skill Does

1. Checks git status
2. Stages and commits changes
3. Pushes to remote
4. Creates a PR (if configured)

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

### Step 1: Check Status

```bash
cd {codeRoot} && git status --short
```

If no changes, tell user: "Nothing to commit."

### Step 2: Stage Changes

```bash
cd {codeRoot} && git add -A
```

### Step 3: Commit

```bash
cd {codeRoot} && git commit -m "feat: {featureName}

- {change 1}
- {change 2}

Ticket: {ticket}"
```

### Step 4: Push

```bash
cd {codeRoot} && git push origin $(git branch --show-current)
```

### Step 5: Report

```
✅ PR Workflow Complete

Commit: {hash}
Branch: {branch}
Remote: pushed

If GitHub CLI is configured, run: gh pr create --title "feat: {featureName}"
```

## Error Handling

| Problem | Response |
|---------|----------|
| No git remote | "Add a remote: git remote add origin {url}" |
| Merge conflicts | "Resolve conflicts before committing." |
| Pre-commit hooks fail | Fix the issues (lint, tests) and retry. |
