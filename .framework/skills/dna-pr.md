---
description: Project-agnostic pull request workflow. Commits, versions, pushes, and creates PRs. Adapts to project's git provider and ticket system.
argument-hint: Provide project name and optional branch/ticket info
---

# Pull Request Workflow (Project-Agnostic)

> Executes a complete PR cycle: checks, commit, version bump, push, create PR, update ticket. Adapts to project config.

---

## Phase 0: Load Project Context

**Goal:** Load project git config, CI/CD settings, and reviewer assignments.

**Actions:**

1. **Load ProjectContext via RLM**

   ```typescript
   const context = await loadProjectContext(projectName);
   const { project } = context;
   ```

2. **Load project git config**

   ```typescript
   const gitConfig = project.git || {};
   // git.provider — 'azure-devops', 'github', 'gitlab'
   // git.defaultBranch — 'develop', 'main', 'master'
   // git.repoUrl
   // git.prTarget — target branch for PRs
   ```

3. **Load CI/CD config**

   ```typescript
   const ci = project.ci || {};
   // ci.provider — 'github-actions', 'azure-pipelines', etc.
   // ci.checks — which checks to run before PR
   ```

4. **Load reviewer assignments**

   ```typescript
   const reviewers = project.reviewers || {};
   // reviewers.backend — default backend reviewer
   // reviewers.frontend — default frontend reviewer
   // reviewers.default — fallback reviewer
   ```

5. **Load ticket system config**

   ```typescript
   const tickets = project.tickets || {};
   // tickets.system — 'linear', 'jira', 'azure-boards'
   // tickets.prefix — 'DELI', 'PROJ', etc.
   ```

---

## Step 1: Detect Affected Apps

Determine which app(s) are affected by changes:

```bash
git diff --name-only HEAD~1 | grep -E "^{project.paths.backend}|^{project.paths.frontend}" | sort -u
```

Determine default reviewer based on changed paths.

---

## Step 2: Check Sync with Remote

```bash
git fetch origin {gitConfig.defaultBranch}
git rev-list --count HEAD..origin/{gitConfig.defaultBranch}
```

If behind: warn user, ask to rebase.

---

## Step 3: Ask Branch Strategy

- Stay on current branch
- Create new branch from `{gitConfig.defaultBranch}`

If new branch:
1. Ask for ticket ID (extract from branch name if present)
2. Suggest branch name: `feature/{ticket-prefix}-{number}-{description}`
3. Create branch from `{gitConfig.defaultBranch}`

---

## Step 4: Ask for Ticket ID

Extract `{ticket-prefix}-{number}` from branch name.
Validate and get title from ticket system.

---

## Step 5: Ask for Reviewer

Suggest default based on changed code:
- Backend changes → `{reviewers.backend}`
- Frontend changes → `{reviewers.frontend}`
- Mixed/other → `{reviewers.default}`

---

## Step 6: Analyze Changes and Generate Commit Message

Use subagent to analyze `git diff --staged` and generate concise commit message.

---

## Step 7: Run Project-Specific Checks

Run checks based on affected apps:

```bash
# Always run
{context.project.commands.format}
{context.project.commands.lint}

# For backend changes
{context.project.commands.test}
{context.project.commands.typecheck}

# For frontend changes
{context.project.commands.test}
{context.project.commands.build}
```

If any check fails, fix before proceeding.

---

## Step 8: Bump Version

Read version from remote `{gitConfig.defaultBranch}`:

```bash
git show origin/{gitConfig.defaultBranch}:{versionFile} | grep '"version"'
```

Increment patch version. Update version file.

---

## Step 9: Commit Changes

```bash
git add -A
git commit -m "{commit-message}"
```

---

## Step 10: Push to Remote

```bash
git push --force-with-lease -u origin HEAD
```

---

## Step 11: Create PR

Create PR via project git provider:

```bash
# Provider-specific command
{gitConfig.provider} pr create \
  --source-branch $(git rev-parse --abbrev-ref HEAD) \
  --target-branch {gitConfig.prTarget} \
  --title "{commit-message}" \
  --description "## Summary\n\n{description}\n\n## Test\n\nAll tests pass."
```

Add reviewer.

---

## Step 12: Update Ticket

Add comment to ticket with PR URL.

---

## Step 13: Summarize

Display:
- Branch name
- New version
- PR URL
- Ticket updated

---

## Provider Adaptation

| Provider | PR Creation | Ticket Integration |
|----------|------------|-------------------|
| Azure DevOps | `az repos pr create` | Azure Boards API |
| GitHub | `gh pr create` | GitHub Issues API |
| GitLab | `glab mr create` | GitLab Issues API |

---

## Source

Original: `.framework/agents/playbooks/dna-tools/commands/dna-pr.md`
