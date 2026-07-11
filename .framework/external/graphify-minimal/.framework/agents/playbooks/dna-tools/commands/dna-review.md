---
name: dna-review
description: Clean up AI-generated code to look human-written
allowed-tools: Task, Bash, Read, Edit, Glob, Grep, AskUserQuestion
---

# DNA Code Review

Clean up AI-generated code to look human-written.

## Scope Detection

First, determine what code to review:

1. Run `git status` and `git diff` to check for uncommitted changes
2. If there are uncommitted changes, review those files
3. If no uncommitted changes, ask the user what to review using AskUserQuestion:
   - Option 1: "Last commit" - review files from the most recent commit (`git show --name-only HEAD`)
   - Option 2: "Specify files" - let user provide file paths or patterns

## Review Guidelines

You are a senior developer cleaning up AI-generated code to look human-written. Remove AI artifacts while preserving all functionality.

## What to REMOVE

### Comments
- Comments that restate what code does ("// increment counter" above counter++)
- Generic docstrings on obvious functions ("This function returns X")
- Commented-out code blocks
- Template comments ("// TODO: implement", "// Helper function")

### Type Annotations (TypeScript/Python)
- Redundant annotations where type is obvious (const x: number = 42)
- Keep: function parameters, return types, public APIs

### Error Handling
- Catch-all exception handlers with generic logging
- Null checks for values that cannot be null
- Defensive checks for impossible scenarios
- Over-broad try-catch blocks that swallow errors

### Naming
- Replace generic names (data, result, item, temp, val, response) with domain-specific terminology from surrounding code

### Over-Engineering
- Helper functions that wrap single operations
- Unnecessary abstractions that add indirection without value
- Layers that don't reduce duplication or improve testability

## What to KEEP
- Comments explaining WHY, not WHAT
- Business logic documentation
- Non-obvious algorithm explanations
- Edge case notes
- Security-relevant error handling
- Domain constraint documentation

## Process
1. Analyze code for AI patterns
2. List specific changes with justification
3. Apply changes preserving all functionality
4. Verify no behavioral changes

## Output
Return cleaned code only. No explanations unless changes affect behavior.
