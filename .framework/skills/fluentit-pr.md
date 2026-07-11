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

### Step 1: Check Status

```bash
cd projects/{projectName} && git status --short
```

If no changes, tell user: "Nothing to commit."

### Step 2: Stage Changes

```bash
cd projects/{projectName} && git add -A
```

### Step 3: Commit

```bash
cd projects/{projectName} && git commit -m "feat: {featureName}

- {change 1}
- {change 2}

Ticket: {ticket}"
```

### Step 4: Push

```bash
cd projects/{projectName} && git push origin $(git branch --show-current)
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
