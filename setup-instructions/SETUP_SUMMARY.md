# Framework Status Report

> Updated: 2026-07-11
> Framework: Agentic BDD/TDD Development Framework (FluentIT)
> GitHub: Pushed to kerry.harris0713@gmail.com account

---

## Executive Summary

**Status: Structurally complete, functionally unproven.**

The framework has been fully assembled — all skills ported, wiki populated, documentation written, and code pushed to GitHub. However, **no skill has been invoked on a real project**. The framework is a factory-built car that has never been driven.

---

## What Has Been Completed Since Last Update (2026-07-08)

### 1. Skills Ported & Renamed (17 total)

| Phase | Skill | Status | Tested |
|-------|-------|--------|--------|
| Infrastructure | `rlm-context-loader` | ✅ Active | ❌ No |
| Infrastructure | `graphify-minimal` | ✅ Active | ✅ Yes (self-indexed) |
| Infrastructure | `wiki-ingest-pipeline` | ✅ Active | ✅ Yes (Cucumber docs) |
| Pipeline | `fluentit-bdd-features` | ✅ Ported | ❌ No |
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
| Meta | `fluentit-orchestrator` | ✅ Created | ❌ No |
| Reference | `MASTER_TEMPLATE` | ✅ Active | N/A |
| Registry | `index` | ✅ Active | N/A |

**Key Changes:**
- All 12 DNA skills renamed from `dna-` to `fluentit-` prefix
- 2 original stubs (`bdd-feature-agents`, `tdd-implementation-agents`) merged into ported versions and deleted
- `fluentit-orchestrator` created as meta-skill for pipeline routing
- All skills installed to `~/.claude/skills/`
- All skills have proper Claude Code frontmatter (`description`, `argument-hint`)

> **⚠️ Important:** Skills are loaded once at Claude Code startup. After updating skills in `.framework/skills/`, re-copy to `~/.claude/skills/` and **restart Claude Code**.

### 2. Wiki Populated (69 pages)

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

### 1. Real Project Scaffold

IP Hub exists as OKF metadata only:
- ❌ No `src/` directory
- ❌ No `package.json`
- ❌ No actual NestJS or Vue code
- ❌ No test files

**Impact:** Skills have nothing to operate on.

### 2. Error Handling

Skills assume happy path:
- ❌ What if RLM fails to load context?
- ❌ What if Graphify returns no results?
- ❌ What if project OKF is malformed?
- ❌ What if tests fail during TDD cycle?

### 3. Cross-Skill State Passing

The orchestrator detects state, but:
- ❌ Skills don't read each other's output files
- ❌ No shared state format between BDD → TDD handoff
- ❌ No verification that previous skill succeeded

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

### 5. Integration Testing

No test validates:
- ❌ End-to-end pipeline on a real feature
- ❌ Skill composition (orchestrator → skill A → skill B)
- ❌ Wiki updates after skill execution
- ❌ Graphify reindexing after code changes

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
    path: "C:/Users/Reforged/Projects/my-project"
---
```

> **Note:** `codePaths` is optional. Omit it to keep the project vault-local (all code in `projects/{name}/`).

---

## Recommended Path to Production

### Phase 1: Hello World Validation (1-2 days)

**Goal:** Prove the framework can build something.

```bash
# 1. Create minimal project
mkdir -p projects/hello-world/src/frontend
mkdir -p projects/hello-world/src/backend
mkdir -p projects/hello-world/okf

# 2. Write minimal OKF
cat > projects/hello-world/okf/index.md << 'EOF'
---
name: hello-world
type: nestjs-vue
techStack:
  frontend: vue3
  backend: nestjs
paths:
  frontend: src/frontend
  backend: src/backend
---
EOF

# 3. Scaffold minimal NestJS + Vue
# (Use nest CLI and nuxi init)

# 4. Write a PRD
cat > projects/hello-world/sources/prds/welcome.md << 'EOF'
# Welcome Message

## Feature
As a user, I want to see a welcome message so that I know the app loaded.

## Acceptance Criteria
- Given I open the app
- When the page loads
- Then I see "Hello, World!"
EOF

# 5. Run the pipeline
fluentit-orchestrator --project hello-world --feature welcome
```

**Expected outcome:** A working Vue component with a passing Playwright test.

**If this works:** Framework is viable. Proceed to Phase 2.
**If this fails:** Fix the broken skill(s) before proceeding.

### Phase 2: RLM Implementation (1 day)

**Goal:** Make `loadProjectContext()` real.

**Minimal implementation:**
```typescript
async function loadProjectContext(projectName: string) {
  const okfPath = `projects/${projectName}/okf/index.md`;
  const okf = await readOkfIndex(okfPath);
  return {
    project: okf,
    projectType: await readProjectType(okf.projectType),
    graph: { query: async () => [] }, // stub
    wiki: { query: async () => [] },  // stub
  };
}
```

**Test:** Every skill can call `loadProjectContext('hello-world')` without error.

### Phase 3: IP Hub Feature (2-3 days)

**Goal:** Build one real feature in IP Hub.

1. Scaffold IP Hub codebase (NestJS + Nuxt)
2. Pick simplest bounded context (e.g., User Management)
3. Run full pipeline: PRD → Features → Steps → TDD → Review → PR
4. Document what breaks

### Phase 4: Hardening (Ongoing)

- Add error handling to each skill
- Add validation checkpoints (did previous skill succeed?)
- Add rollback capability
- Optimize token usage (currently ~15k target, may need tuning)

---

## Success Metrics (Revised)

| Metric | Current | Target (3 months) |
|--------|---------|-------------------|
| Skills tested end-to-end | 0/12 | 12/12 |
| Real features built | 0 | 10+ |
| Framework projects | 0 | 2+ |
| Wiki pages | 69 | 200+ |
| Avg. time per feature | N/A | < 4 hours |
| Token cost per feature | N/A | < $2.00 |

---

## Decision Point

**The framework is at a fork:**

**Path A: Validate Now** (Recommended)
- Spend 1-2 days on Hello World
- Find and fix the breaking points
- Decide if the framework is worth investing more time

**Path B: Keep Building**
- Add more skills (debugging, deployment, monitoring)
- Improve documentation
- Build more wiki content

**Path C: Pivot**
- Extract the most valuable skill (e.g., `fluentit-bdd-features`)
- Use it standalone without the full framework
- Gradually add orchestration later

**My recommendation: Path A.** The framework has enough structure. What it needs now is proof that it works.

---

*Report for Kerry Harris — FluentIT Framework*
*Last updated: 2026-07-11*
