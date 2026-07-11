---
description: Project-agnostic code review. Cleans up AI-generated code to look human-written while preserving functionality.
argument-hint: Provide files to review, or review uncommitted changes automatically
---

# Code Review — AI Cleanup (Project-Agnostic)

> Clean up AI-generated code to look human-written. Remove AI artifacts while preserving all functionality.

---

## Phase 0: Detect Scope

1. Run `git status` and `git diff` to check for uncommitted changes
2. If uncommitted changes exist → review those files
3. If no uncommitted changes → ask user:
   - Last commit: review files from `git show --name-only HEAD`
   - Specify files: user provides paths

---

## Phase 1: Load Project Context (Optional)

If running within a project:

```typescript
const context = await loadProjectContext(projectName);
const conventions = context.projectType?.codingConventions;
```

Load project-specific conventions if available:
- Naming patterns
- Comment style
- TypeScript strictness level
- Import organization

---

## Phase 2: Analyze for AI Patterns

Review code for these AI artifacts:

### Comments to REMOVE
- Comments that restate what code does (`// increment counter` above `counter++`)
- Generic docstrings on obvious functions
- Commented-out code blocks
- Template comments (`// TODO: implement`, `// Helper function`)

### Comments to KEEP
- WHY comments (business logic reasoning)
- Non-obvious algorithm explanations
- Edge case notes
- Security-relevant explanations

### Type Annotations
- REMOVE: Redundant annotations where type is obvious (`const x: number = 42`)
- KEEP: Function parameters, return types, public APIs

### Error Handling
- REMOVE: Catch-all handlers with generic logging
- REMOVE: Null checks for values that cannot be null
- REMOVE: Defensive checks for impossible scenarios
- KEEP: Security-relevant error handling
- KEEP: Actual edge case handling

### Naming
- REPLACE: Generic names (`data`, `result`, `item`, `temp`, `val`)
  WITH: Domain-specific terminology from surrounding code

### Over-Engineering
- REMOVE: Helper functions that wrap single operations
- REMOVE: Unnecessary abstractions without value
- REMOVE: Layers that don't reduce duplication or improve testability

---

## Phase 3: Apply Changes

1. List specific changes with justification
2. Apply changes preserving all functionality
3. Verify no behavioral changes

---

## Phase 4: Verify

Run project checks if available:

```bash
{context.project.commands.typecheck}
{context.project.commands.test}
{context.project.commands.lint}
```

---

## Output

Return cleaned code. Include summary of changes made.

---

## Source

Original: `.framework/agents/playbooks/dna-tools/commands/dna-review.md`
