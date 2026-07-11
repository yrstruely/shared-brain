---
name: fluentit-review
description: Cleans up AI-generated code to look human-written
---

# FluentIT Code Review

Cleans up AI artifacts, improves naming, ensures consistency.

## Usage

```
fluentit-review --project PROJECT_NAME
```

## What It Does

1. Checks git status for uncommitted changes
2. Reads each modified file
3. Removes verbose comments, console.logs, `any` types
4. Standardizes naming and formatting

## Example

```
fluentit-review --project hello-world
```

## Next Step

```
fluentit-pr --project hello-world --ticket TICKET-123
```
