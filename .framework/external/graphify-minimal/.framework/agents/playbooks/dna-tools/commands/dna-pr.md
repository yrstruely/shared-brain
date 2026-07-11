---
name: dna-pr
description: Commit, bump version, push, and create Azure DevOps PR with appropriate reviewer
disable-model-invocation: true
allowed-tools: Bash(*), Read, Edit, Task, AskUserQuestion, mcp__plugin_linear_linear__create_comment, mcp__plugin_linear_linear__get_issue
---

# DFF Pull Request Workflow

Execute a complete PR cycle for Dubai Future Foundation IP Hub projects.

## Workflow Steps

1. Detect project type (backend/frontend)
2. Check sync with remote develop
3. Ask: stay on current branch or create new from develop
4. If new branch: suggest name, let user customize
5. Ask for Linear ticket ID
6. Ask for reviewer
7. Analyze changes and generate commit message
8. Run project-specific checks
9. Bump version
10. Commit changes (exclude docs/*.md)
11. Push to remote
12. Create Azure DevOps PR
13. Ask for Linear comment text
14. Add comment to Linear ticket
15. Generate Slack message

---

## Step 1: Detect Project Type

This is a **monorepo** containing both backend and frontend apps.

Check project indicators:

```bash
# Monorepo indicators (this is the expected structure)
ls pnpm-workspace.yaml 2>/dev/null && echo "MONOREPO"

# List apps to understand scope
ls apps/
```

Set variables for the monorepo:

| Variable | Value |
|----------|-------|
| `PKG_MANAGER` | pnpm |
| `REPO_NAME` | ip-hub |
| `VERSION_FILE` | package.json (root) |

Determine which app(s) are affected by checking git diff:

```bash
git diff --name-only HEAD~1 | grep -E "^apps/(ip-hub-backend|ip-hub-frontend|payload-cms)/" | cut -d'/' -f2 | sort -u
```

Use this to determine:
- `DEFAULT_REVIEWER`: Ilia Belov (backend changes), Peter Koopman (frontend changes)

---

## Step 2: Check Sync with Remote Develop

Fetch latest and check if current branch is behind develop:

```bash
git fetch origin develop

# Check commits behind
git rev-list --count HEAD..origin/develop
```

If behind origin/develop:
- Warn user: "Your branch is X commits behind origin/develop"
- Use AskUserQuestion to ask: "Rebase now?" or "Continue anyway (may cause conflicts)"
- If rebase: run `git rebase origin/develop`

---

## Step 3: Ask Branch Strategy

Use AskUserQuestion with options:
- **Stay on current branch** - continue work on `<current-branch-name>`
- **Create new branch from develop** - checkout fresh branch

---

## Step 4: New Branch (if selected)

If user chose "Create new branch":

1. First ask for Linear ticket (needed for branch name suggestion)
2. Generate suggested branch name: `feature/deli-XXX-short-description`
   - Extract description from Linear ticket title (lowercase, hyphenated, max 5 words)
3. Use AskUserQuestion to confirm or customize:
   - Show suggested name
   - Let user type custom name if preferred

Then execute:

```bash
git checkout origin/develop
git checkout -b <branch-name>
```

---

## Step 5: Ask for Linear Ticket ID

Try to extract DELI-XXX from current branch name first.

Use AskUserQuestion:
- If found in branch: "Detected Linear ticket: DELI-XXX. Confirm or enter different ID"
- If not found: "Enter Linear ticket ID (e.g., DELI-123)"

Fetch ticket details using mcp__plugin_linear_linear__get_issue to validate and get title.

---

## Step 6: Ask for Reviewer

Use AskUserQuestion with options:
- **<DEFAULT_REVIEWER>** (default based on project type)
- **Other** - let user type custom reviewer name

For backend default: Ilia Belov
For frontend default: Peter Koopman

---

## Step 7: Analyze Changes and Generate Commit Message

Use a subagent to:
- Run `git diff --staged` and `git diff` to see all changes
- Analyze what was changed
- Generate a concise, descriptive commit message
- Return the commit message

---

## Step 8: Run Project-Specific Checks

This is a monorepo - run checks based on which apps are affected.

### Always run (monorepo-wide):

```bash
pnpm format
pnpm lint
```

### For Backend changes (apps/ip-hub-backend):

```bash
pnpm nx lint ip-hub-backend
pnpm nx test ip-hub-backend
npx tsc --noEmit -p apps/ip-hub-backend
```

### For Frontend changes (apps/ip-hub-frontend):

```bash
pnpm nx lint ip-hub-frontend
pnpm nx test ip-hub-frontend
```

### For CMS changes (apps/payload-cms):

```bash
pnpm nx lint payload-cms
pnpm nx test payload-cms
```

If any check fails, fix issues before proceeding.

---

## Step 9: Bump Version

Read the version from **remote develop** (not local) to avoid conflicts when multiple PRs are in flight.

```bash
# Fetch latest develop and read its version (already fetched in Step 2)
git show origin/develop:package.json | grep '"version"'
```

Take that version and increment the patch (e.g., if origin/develop has 0.0.41 → bump to 0.0.42).

Use the Edit tool to update the version in the root `package.json` file.

---

## Step 10: Commit Changes

```bash
git add -A ':!docs'
git commit -m "<generated-commit-message>"
```

Do NOT commit files in docs/ folder.

---

## Step 11: Push to Remote

```bash
git push --force-with-lease -u origin HEAD
```

---

## Step 12: Create Azure DevOps PR

```bash
az repos pr create \
  --repository <REPO_NAME> \
  --source-branch $(git rev-parse --abbrev-ref HEAD) \
  --target-branch develop \
  --title "<generated-commit-message>" \
  --description "## Summary\n\n<brief-description-of-changes>\n\n## Test\n\nAll tests pass." \
  --org https://dev.azure.com/DubaiFutureFoundation \
  --project "Dubai IP Hub"
```

Then add reviewer:

```bash
az repos pr reviewer add \
  --id <PR_ID> \
  --reviewers "<REVIEWER>" \
  --org https://dev.azure.com/DubaiFutureFoundation
```

---

## Step 13: Ask for Linear Comment Text

Use AskUserQuestion:
- Suggest default: "PR created: <PR_URL>"
- Let user customize the comment text

---

## Step 14: Add Linear Comment

Use mcp__plugin_linear_linear__create_comment with user-provided text.

---

## Step 15: Generate Slack Message

Output:

```
PR ready: <PR_URL>
<one-line-summary-of-changes>
```

---

## Final Summary

Display:
- Project type (backend/frontend)
- Branch name
- New version number
- PR URL
- Linear ticket updated (DELI-XXX)
- Slack message (ready to copy)

---

## Important Notes

- All checks must pass before committing
- Never commit docs/*.md files
- Target branch is always `develop`
- Linear ticket prefix is DELI
- This is a monorepo using pnpm
- Version is managed in root package.json
- Apps: ip-hub-backend, ip-hub-frontend, payload-cms
- Libs: api-contracts, domain, ip-constants
