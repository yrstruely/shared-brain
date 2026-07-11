> **Type:** Skill
> **Source:** `.framework/skills/fluentit-review.md`
> **Related:** [[wiki/technologies/fluentit-pr|Pull Request]], [[wiki/technologies/fluentit-tdd-frontend|Frontend TDD]], [[wiki/technologies/fluentit-tdd-backend|Backend TDD]]

# Code Review

Cleans up AI-generated code to look human-written while preserving functionality.

---

## Purpose

Removes AI artifacts, improves readability, and ensures code follows project conventions.

## Pipeline

```
Phase 0: Detect Scope (git status / git diff)
Phase 1: Load Project Context (Optional)
Phase 2: Identify AI Artifacts
Phase 3: Improve Naming + Structure
Phase 4: Add Missing Comments
Phase 5: Verify Tests Pass
Phase 6: Commit Cleanup
```

## Key Checks

- Remove verbose/robotic comments
- Simplify over-engineered patterns
- Add natural variable names
- Ensure consistent style
- Verify no functionality lost

## Usage

```bash
claude /framework:review --project ip-hub
# Or review specific files
claude /framework:review --files src/components/UserForm.vue
```
