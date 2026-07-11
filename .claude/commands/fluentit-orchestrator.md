---
name: fluentit-orchestrator
description: Detects project state and recommends the next FluentIT skill to run
---

# FluentIT Orchestrator

Detects what exists in a project and tells you which skill to run next.

## Usage

```
fluentit-orchestrator --project PROJECT_NAME --feature FEATURE_NAME
```

## What It Does

1. Reads `projects/{name}/okf/index.md`
2. Checks for specs, features, step definitions, tests, and code
3. Recommends the next skill to run

## Example

```
fluentit-orchestrator --project hello-world --feature welcome
```

## Pipeline

```
fluentit-bdd-features
    ↓
fluentit-bdd-frontend-steps + fluentit-bdd-backend-steps (parallel)
    ↓
fluentit-tdd-frontend + fluentit-tdd-backend (parallel)
    ↓
fluentit-review
    ↓
fluentit-pr
```

## Error Handling

| Problem | Fix |
|---------|-----|
| OKF not found | Create `projects/{name}/okf/index.md` |
| No feature name | Add `--feature {name}` |
