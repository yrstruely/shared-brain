---
name: fluentit-pr
description: Commits changes and creates a pull request
---

# FluentIT Pull Request

Commits changes, pushes, and creates a PR.

## Usage

```
fluentit-pr --project PROJECT_NAME --ticket TICKET_NUMBER
```

## What It Does

1. Checks git status
2. Stages all changes
3. Commits with conventional message
4. Pushes to remote

## Example

```
fluentit-pr --project hello-world --ticket PROJ-123
```

## Output

```
✅ Commit: abc1234
✅ Branch: main
✅ Remote: pushed
```
