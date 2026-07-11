> **Type:** Skill
> **Source:** `.framework/skills/dna-pr.md`
> **Related:** [[wiki/technologies/dna-review|Code Review]], [[wiki/technologies/dna-frontend-guide|Frontend Guide]], [[wiki/technologies/dna-backend-module|Backend Module]]

# Pull Request Workflow

Executes a complete PR cycle: checks, commit, version bump, push, create PR, update ticket. Adapts to project's git provider and ticket system.

---

## Purpose

Automates the end-to-end PR workflow from local changes to merged code.

## Pipeline

```
Phase 0: Load Project Context (via RLM)
Phase 1: Detect Scope of Changes
Phase 2: Run Pre-Commit Checks
Phase 3: Commit with Conventional Message
Phase 4: Version Bump (if configured)
Phase 5: Push to Remote
Phase 6: Create Pull Request
Phase 7: Update Ticket / Issue
Phase 8: Request Reviews
```

## Key Outputs

- Committed changes
- Version bump
- Opened PR
- Updated ticket
- Reviewer assignments

## Usage

```bash
claude /framework:pr --project ip-hub --ticket PROJ-123
```
