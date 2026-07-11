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

### Step 1: Detect Scope

```bash
cd projects/{projectName} && git status --short
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
cd projects/{projectName} && npm run lint 2>&1
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
