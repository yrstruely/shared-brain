# Framework Status Report

> Updated: 2026-07-11
> Framework: Agentic BDD/TDD Development Framework (FluentIT)
> GitHub: Pushed to kerry.harris0713@gmail.com account

---

## Executive Summary

**Status: Structurally complete, partially validated, post-major refactor.**

The framework has been fully assembled and undergone a major architectural refactor to support **external project directories** (projects can live outside the shared-brain vault). The orchestrator skill has been invoked successfully and correctly resolves paths. However, **skills wrote generated files to the wrong directory** (vault instead of external) — this has been fixed with explicit path-verification warnings. Full end-to-end pipeline validation is still pending a Claude Code restart.

---

## What Has Been Completed

### 1. Skills Ported & Renamed (17 total)

| Phase | Skill | Status | Tested |
|-------|-------|--------|--------|
| Infrastructure | `rlm-context-loader` | ✅ Active | ❌ No |
| Infrastructure | `graphify-minimal` | ✅ Active | ✅ Yes (self-indexed) |
| Infrastructure | `wiki-ingest-pipeline` | ✅ Active | ✅ Yes (Cucumber docs) |
| Pipeline | `fluentit-bdd-features` | ✅ Ported | ⚠️ Partial (path fix pending restart) |
| Pipeline | `fluentit-bdd-frontend-steps` | ✅ Ported | ❌ No |
| Pipeline | `fluentit-bdd-backend-steps` | ✅ Ported | ❌ No |
| Pipeline | `fluentit-tdd-frontend` | ✅ Ported | ❌ No |
| Pipeline | `fluentit-tdd-backend` | ✅ Ported | ❌ No |
| Scaffolding | `fluentit-domain-entity` | ✅ Ported | ❌ No |
| Scaffolding | `fluentit-api-contracts` | ✅ Ported | ❌ No |
| Scaffolding | `fluentit-backend-module` | ✅ Ported | ❌ No |
| Workflow | `fluentit-frontend-guide` | ✅ Ported | ❌ No |
| Workflow | `fluentit-pr` | ✅ Ported | ❌ No |
| Workflow | `fluentit-review` | ✅ Ported | ❌ No |
| Meta | `fluentit-orchestrator` | ✅ Created | ✅ Yes (path resolution works) |
| Reference | `MASTER_TEMPLATE` | ✅ Active | N/A |
| Registry | `index` | ✅ Active | N/A |

**Key Changes:**
- All 12 DNA skills renamed from `dna-` to `fluentit-` prefix
- 2 original stubs merged into ported versions and deleted
- `fluentit-orchestrator` created as meta-skill for pipeline routing
- All skills installed to `~/.claude/skills/`
- All skills have proper Claude Code frontmatter

> **⚠️ Important:** Skills are loaded once at Claude Code startup. After updating skills in `.framework/skills/`, re-copy to `~/.claude/skills/` and **restart Claude Code**.

### 2. Project Externalization Refactor (Major)

**What changed:** Projects can now keep documentation in the vault while code lives in an external directory.

**New OKF field: `codePaths`**
```yaml
codePaths:
  - machine: "desktop"
    path: "C:/Users/Reforged/Dropbox/Programming/hello-world"
```

- **Vault side** (`projects/{name}/`): OKF, specs, ADRs, bounded contexts
- **Code side** (external): Features, frontend code, backend code, tests
- Machine resolution: `FLUENTIT_MACHINE` env var → `~/.fluentit/machine.json` → `hostname`
- All 12 skills updated with two-root path resolution

**Files changed:**
- All 12 `.framework/skills/fluentit-*.md` skills
- `projects/hello-world/okf/index.md` — added `codePaths`
- `projects/index.md` — documented two-root model
- `setup-instructions/SETUP_GUIDE.md` — added machine config section

### 3. Wiki Populated (69 pages)

| Section | Pages | Source |
|---------|-------|--------|
| Concepts | 28 | Cucumber.io BDD documentation (ingested) |
| Entities | 8 | Cucumber ecosystem tools |
| Technologies | 17 | Framework skills + infrastructure |
| Patterns | 3 | BDD pipeline, TDD red-green-clean |
| Sources | 1 | Cucumber/Gherkin reference |
| Workflow | 1 | Project development guide |
| Log | 1 | Operation history |

**Ingestion:** Cucumber.io docs ingested via DeepSeek V4 Flash on OpenRouter

### 3. Graphify Tested

- ✅ Built: `npm install && npm run build`
- ✅ Indexed: `shared-brain` project (16 nodes, 4 edges)
- ✅ Queried: P1 (projects), P2 (entities), custom Cypher (modules)
- ⚠️ Limitation: Only indexed its own source code. Real project = 1000+ nodes

### 4. Documentation Written

| Document | Purpose |
|----------|---------|
| `setup-instructions/WORKFLOW.md` | Step-by-step project development guide |
| `wiki/workflow.md` | Wiki summary of workflow |
| `bin/sync-skills.sh` | Script to sync skills after edits |
| `README.md` | Updated with workflow link and LLM config |

### 5. Git Repository

- ✅ Initialized in `//nas/obsidian-vault/shared-brain`
- ✅ 2 commits pushed to GitHub (kerry.harris0713@gmail.com account)
- ✅ `.gitignore` configured (excludes `.graphify/`, `node_modules/`, `.obsidian/`)
- ✅ Local git config: Kerry Harris / nzfluentit@gmail.com

---

## Validation Log

### 2026-07-11: Orchestrator Path Resolution ✅

**Test:** `/fluentit-orchestrator --project hello-world --feature welcome`

**Result:**
- ✅ Reads OKF from vault: `projects/hello-world/okf/index.md`
- ✅ Resolves machine ID from `~/.fluentit/machine.json`
- ✅ Matches `codePaths` entry for "desktop"
- ✅ Correctly identifies external directory: `C:/Users/Reforged/Dropbox/Programming/hello-world`
- ✅ Checks specs in vault, features in external directory
- ✅ Recommends correct next skill: `fluentit-bdd-features`

### 2026-07-11: Bug Found — Skills Writing to Wrong Directory ❌

**Problem:** When skills ran, they wrote generated files to `projects/hello-world/` (vault) instead of `C:/Users/Reforged/Dropbox/Programming/hello-world/` (external).

**Root cause:** `{codeRoot}` is a placeholder in skill markdown. Claude didn't consistently substitute it with the resolved path.

**Files incorrectly created in vault:**
- `projects/hello-world/backend/src/welcome/*.ts`
- `projects/hello-world/frontend/src/components/*.vue`
- `projects/hello-world/features/welcome.feature`

**Fix applied:**
- Added `⚠️ CRITICAL — Two-Root Rule` warning to all 12 skills
- Added `⚠️ Verify the write path` warning before every Write operation
- Orchestrator output now shows: `📂 Code Directory: {codeRoot}`
- Explicitly warn: "DO NOT write to `projects/{projectName}/` — that is the vault side"
- Cleaned vault-side `projects/hello-world/` to contain only `okf/`

**Status:** Fix committed but requires **Claude Code restart** to load updated skills.

### 2026-07-11: Pending Validation

- [ ] Re-run orchestrator after restart (confirm path display)
- [ ] Run `fluentit-bdd-features` (confirm writes to external directory)
- [ ] Verify vault-side remains clean (only `okf/`)
- [ ] Run full pipeline end-to-end

---

## What Remains Untested (High Risk)


### 🔴 Critical: No Skill Has Executed Real Work

| Skill                         | What Could Break                                   | Likelihood |
| ----------------------------- | -------------------------------------------------- | ---------- |
| `fluentit-orchestrator`       | State detection logic may fail on real projects    | High       |
| `fluentit-bdd-features`       | May not generate valid Gherkin from real PRDs      | High       |
| `fluentit-tdd-frontend`       | May not handle real Vue/Nuxt component structure   | High       |
| `fluentit-tdd-backend`        | May fail with real NestJS CQRS patterns            | High       |
| `fluentit-bdd-frontend-steps` | Playwright/MSW/Pact generation untested            | High       |
| `fluentit-bdd-backend-steps`  | API E2E step generation untested                   | High       |
| `fluentit-domain-entity`      | Interview flow may not converge on real domains    | Medium     |
| `fluentit-api-contracts`      | DTO generation may mismatch real APIs              | Medium     |
| `fluentit-backend-module`     | May scaffold incompatible with project conventions | Medium     |
| `fluentit-frontend-guide`     | May not adapt to real design requirements          | Medium     |
| `fluentit-pr`                 | Git provider detection untested                    | Medium     |
| `fluentit-review`             | AI artifact detection may be incomplete            | Low        |

### 🟡 Medium Risk: Infrastructure Gaps

| Component | Gap | Impact |
|-----------|-----|--------|
| RLM | Not installed (`~/RLM` missing) | Skills reference `loadProjectContext()` but function doesn't exist |
| Graphify | Not tested on real codebase | Cross-project queries are theoretical |
| Obsidian CLI | Installed but not integrated with skills | Skills can't write to wiki via CLI |
| Karpathy Plugin | Configured but not tested end-to-end | Ingestion pipeline may have gaps |

### 🟢 Low Risk: Known Limitations

| Limitation | Mitigation |
|------------|------------|
| Skills are large (10-12KB each) | Only loaded when invoked; no performance issue |
| Symlinks not possible on Windows | Using `bin/sync-skills.sh` copy script |
| No CI/CD integration | Manual `fluentit-pr` skill handles PR workflow |

---

## What's Missing

### 1. Full Pipeline End-to-End Validation

Hello World project exists at `C:/Users/Reforged/Dropbox/Programming/hello-world/` with:
- ✅ External code directory configured in OKF
- ✅ `codePaths` with machine "desktop"
- ✅ Features, frontend, backend directories exist
- ❌ Full pipeline (orchestrator → bdd-features → bdd-steps → tdd → pr) not yet run cleanly

### 2. Skill Restart Verification

Updated skills are in `~/.claude/skills/` but Claude Code must be **restarted** to load them. This is the current blocker for continued validation.

### 3. Error Handling

Skills assume happy path:
- ❌ What if `codePaths` entry path doesn't exist?
- ❌ What if RLM fails to load context?
- ❌ What if project OKF is malformed?
- ❌ What if tests fail during TDD cycle?

### 4. RLM Implementation

The `rlm-context-loader` skill references:
```typescript
const context = await loadProjectContext(projectName);
```

But `loadProjectContext()` is **not implemented**. It's a function signature in the skill description, not actual code.

**Options:**
- Install `hampton-io/RLM` (requires separate repo)
- Implement a minimal `loadProjectContext()` that reads OKF files directly
- Use a simpler approach: just read `projects/{name}/okf/index.md`

### 5. Multi-Machine Testing

`codePaths` supports multiple machines but has only been tested on "desktop":
- ❌ Not tested with `FLUENTIT_MACHINE` env var
- ❌ Not tested with hostname fallback
- ❌ Not tested on laptop/WSL with different paths

---

## OKF Template

```yaml
---
name: my-project
type: nestjs-vue
techStack:
  frontend: vue3
  backend: nestjs
  database: postgresql
paths:
  frontend: frontend/src
  backend: backend/src
  domain: backend/src/domain
  features: features/
  tests:
    unit: backend/src/**/*.spec.ts
    integration: backend/test
    e2e: frontend/e2e
codePaths:
  - machine: "desktop"
    path: "C:/Users/Reforged/Dropbox/Programming/my-project"
---
```

> **Note:** `codePaths` is optional. Omit it to keep the project vault-local (all code in `projects/{name}/`).

---

## Recommended Path Forward

### Immediate: Restart & Validate (5 minutes)

1. **Restart Claude Code** in your other terminal (skills loaded at startup)
2. **Re-run orchestrator:** `/fluentit-orchestrator --project hello-world --feature welcome`
3. **Verify:** Output shows `📂 Code Directory: C:/Users/Reforged/Dropbox/Programming/hello-world`
4. **Run BDD features:** `/fluentit-bdd-features --project hello-world --specs specs/welcome.md`
5. **Verify:** Feature file written to external directory, vault-side remains clean

**If this works:** Framework core is viable. Proceed to hardening.
**If this fails:** Debug the specific skill and fix.

### Short-Term: Hardening (1-2 days)

- Add error handling for missing `codePaths` entries
- Add validation that previous skill succeeded before running next
- Test multi-machine path resolution
- Optimize token usage

### Medium-Term: Real Feature (IP Hub)

- Pick simplest bounded context
- Run full pipeline: PRD → Features → Steps → TDD → Review → PR
- Document what breaks

---

## Success Metrics

| Metric | Current | Target (3 months) |
|--------|---------|-------------------|
| Skills tested end-to-end | 0/12 | 12/12 |
| Orchestrator path resolution | ✅ Works | 12/12 |
| Skills writing to correct directory | ⚠️ Fix pending restart | 12/12 |
| Real features built | 0 | 10+ |
| Framework projects | 1 (hello-world external) | 2+ |
| Wiki pages | 69 | 200+ |
| Avg. time per feature | N/A | < 4 hours |
| Token cost per feature | N/A | < $2.00 |

---

*Report for Kerry Harris — FluentIT Framework*
*Last updated: 2026-07-11 (post-externalization refactor)*
