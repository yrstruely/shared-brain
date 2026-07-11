# FluentIT Project Externalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable FluentIT projects to keep documentation (OKF, specs) in the shared-brain vault while code (features, frontend, backend) lives in an external directory, with per-machine path support.

**Architecture:** Extend the OKF with a `codePaths` array that maps machine identifiers to local code directories. Skills resolve the correct path at runtime via env var → local config → hostname. All skills gain a two-root model: `vaultRoot` for docs, `codeRoot` for code. No silent fallbacks.

**Tech Stack:** Markdown skill files, YAML frontmatter, Bash path resolution

## Global Constraints

- `codePaths` is an array of `{machine: string, path: string}` objects in OKF frontmatter.
- If `codePaths` is absent, the project is vault-local (current behavior, unchanged).
- If `codePaths` is present but no machine matches, the skill **asks the user** — no silent fallback.
- Machine identifier resolution priority: `FLUENTIT_MACHINE` env var → `~/.fluentit/machine.json` → `hostname` command.
- `vaultRoot` = `projects/{name}/` (always in the vault).
- `codeRoot` = resolved from `codePaths` (external directory).
- All file paths in skill instructions must use the correct root for the artifact type.

---

## File Map

| File | Responsibility | Action |
|------|---------------|--------|
| `projects/hello-world/okf/index.md` | Hello World OKF — test case for externalization | Modify: add `codePaths` |
| `.framework/skills/fluentit-orchestrator.md` | Detects project state, routes to next skill | Modify: add path resolution, two-root state checks |
| `.framework/skills/fluentit-bdd-features.md` | Specs → Gherkin `.feature` files | Modify: read specs from vaultRoot, write features to codeRoot |
| `.framework/skills/fluentit-bdd-frontend-steps.md` | Feature → Playwright step definitions | Modify: read features from codeRoot, write steps to codeRoot |
| `.framework/skills/fluentit-bdd-backend-steps.md` | Feature → API E2E step definitions | Modify: read features from codeRoot, write steps to codeRoot |
| `.framework/skills/fluentit-tdd-frontend.md` | Red/Green/Clean Vue/React components | Modify: read features from codeRoot, write code/tests to codeRoot |
| `.framework/skills/fluentit-tdd-backend.md` | Red/Green/Clean NestJS controllers/services | Modify: read features from codeRoot, write code/tests to codeRoot |
| `.framework/skills/fluentit-domain-entity.md` | DDD entity design | Modify: read OKF from vaultRoot, write entities to codeRoot |
| `.framework/skills/fluentit-api-contracts.md` | TypeScript DTOs + API services | Modify: read OKF from vaultRoot, write contracts to codeRoot |
| `.framework/skills/fluentit-backend-module.md` | NestJS module scaffold | Modify: read OKF from vaultRoot, write module to codeRoot |
| `.framework/skills/fluentit-frontend-guide.md` | Frontend feature orchestration | Modify: read OKF from vaultRoot, guide implementation in codeRoot |
| `.framework/skills/fluentit-pr.md` | Commit → push → PR | Modify: run git commands in codeRoot |
| `.framework/skills/fluentit-review.md` | AI code cleanup | Modify: run git commands in codeRoot |
| `setup-instructions/SETUP_GUIDE.md` | Framework setup documentation | Modify: document codePaths and machine config |
| `setup-instructions/SETUP_SUMMARY.md` | Quick reference | Modify: add codePaths to OKF template |
| `projects/index.md` | Project registry | Modify: document the two-root model |

---

### Task 1: Create Machine Config Infrastructure

**Files:**
- Create: `~/.fluentit/machine.json` (on the user's machine, not in the repo)
- Modify: `setup-instructions/SETUP_GUIDE.md`
- Modify: `setup-instructions/SETUP_SUMMARY.md`

**Interfaces:**
- Consumes: Nothing (first task)
- Produces: Machine identifier resolution convention documented; config file schema defined.

**Context:** This task establishes how skills determine which machine they're running on. It does not create code — it defines a convention that all subsequent skills rely on.

- [ ] **Step 1: Document machine config in SETUP_GUIDE.md**

  Add a new section after the OKF bundle section in `setup-instructions/SETUP_GUIDE.md`:

  ```markdown
  ## Machine Configuration (for Multi-Computer Setups)

  If you work on the same project from multiple computers, the code path may differ on each machine. Configure a machine identifier on each computer:

  ### Option A: Environment Variable (recommended for CI)
  ```bash
  # Windows
  set FLUENTIT_MACHINE=desktop

  # Linux/macOS/WSL
  export FLUENTIT_MACHINE=laptop
  ```

  ### Option B: Local Config File (recommended for workstations)
  Create `~/.fluentit/machine.json`:
  ```json
  {
    "machine": "desktop"
  }
  ```

  ### Option C: Hostname (fallback)
  If neither is set, the skill uses the output of the `hostname` command.

  ### Add codePaths to Your OKF
  In `projects/{name}/okf/index.md`, add:
  ```yaml
  codePaths:
    - machine: "desktop"
      path: "C:/Users/Reforged/Projects/hello-world"
    - machine: "laptop"
      path: "C:/Users/Kerry/Projects/hello-world"
  ```

  If no matching machine is found, the skill will ask you for the path.
  ```

- [ ] **Step 2: Update OKF template in SETUP_SUMMARY.md**

  Find the OKF template in `setup-instructions/SETUP_SUMMARY.md` and add `codePaths` to it:

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

  Also add a note below the template:
  ```markdown
  > **Note:** `codePaths` is optional. Omit it to keep the project vault-local (all code in `projects/{name}/`).
  ```

- [ ] **Step 3: Create local machine config on this machine**

  Run:
  ```bash
  mkdir -p ~/.fluentit
  echo '{"machine": "desktop"}' > ~/.fluentit/machine.json
  ```

  Verify:
  ```bash
  cat ~/.fluentit/machine.json
  ```
  Expected output:
  ```
  {"machine": "desktop"}
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add setup-instructions/SETUP_GUIDE.md setup-instructions/SETUP_SUMMARY.md
  git commit -m "docs: document machine config and codePaths for multi-computer setups"
  ```

---

### Task 2: Update Hello World OKF with codePaths

**Files:**
- Modify: `projects/hello-world/okf/index.md`

**Interfaces:**
- Consumes: Machine config convention from Task 1
- Produces: A test project with `codePaths` configured

**Context:** Hello World becomes the validation project for the externalization feature. The code directory doesn't need to exist yet — we'll create it in Task 10.

- [ ] **Step 1: Read current OKF**

  Read `projects/hello-world/okf/index.md` to confirm current content.

- [ ] **Step 2: Add codePaths to the OKF**

  Add the `codePaths` field to the YAML frontmatter:

  ```yaml
  ---
  name: hello-world
  type: nestjs-vue
  techStack:
    frontend: vue3
    backend: nestjs
    database: none
  paths:
    frontend: frontend/src
    backend: backend/src
    domain: backend/src/domain
    features: features/
    specs:
      frontend: specs/frontend
      backend: specs/backend
    tests:
      unit: backend/src/**/*.spec.ts
      integration: backend/test
      e2e: frontend/e2e
  codePaths:
    - machine: "desktop"
      path: "C:/Users/Reforged/Projects/hello-world"
  ---
  ```

- [ ] **Step 3: Verify the OKF is valid YAML**

  Read the file back and confirm:
  - `codePaths` is an array
  - Each entry has `machine` and `path`
  - No YAML syntax errors (proper indentation, no tabs)

- [ ] **Step 4: Commit**

  ```bash
  git add projects/hello-world/okf/index.md
  git commit -m "feat(hello-world): add codePaths for external code directory"
  ```

---

### Task 3: Update Orchestrator Skill

**Files:**
- Modify: `.framework/skills/fluentit-orchestrator.md`

**Interfaces:**
- Consumes: OKF with optional `codePaths`; machine config convention
- Produces: Skills that correctly reference `vaultRoot` and `codeRoot`

**Context:** The orchestrator is the entry point. It must resolve paths before making recommendations. Every subsequent skill follows the same pattern established here.

- [ ] **Step 1: Add path resolution section after "Step 1"**

  In `.framework/skills/fluentit-orchestrator.md`, replace the existing "Step 2: Detect the current state" with a new two-step process.

  First, insert a new "Step 2: Resolve Code Path" after "Step 1: Read the OKF":

  ```markdown
  **Step 2: Resolve the Code Path**

  Check if the OKF has a `codePaths` field.

  **If `codePaths` is present:**
  1. Determine the machine identifier in this priority:
     - Environment variable `FLUENTIT_MACHINE`
     - Local config file `~/.fluentit/machine.json` (read with Bash: `cat ~/.fluentit/machine.json 2>/dev/null || echo "{}"`)
     - Hostname: `hostname` command
  2. Find the entry in `codePaths` where `machine` matches the identifier.
  3. If found, set `{codeRoot}` to that entry's `path`.
  4. If not found, STOP and tell the user:
     > "No code path configured for machine '{machineId}' in project '{projectName}'. Please provide the path, or add this to the OKF:\n> codePaths:\n>   - machine: '{machineId}'\n>     path: '<your path here>'"

  **If `codePaths` is absent:**
  - The project is vault-local. Set `{codeRoot}` = `projects/{projectName}/`.

  **From now on, use:**
  - `projects/{projectName}/` for OKF, specs, and documentation (vault side)
  - `{codeRoot}/` for features, code, tests, and git operations (code side)
  ```

- [ ] **Step 2: Update state detection commands to use both roots**

  Replace the existing "Step 3: Detect the current state" Bash commands with:

  ```markdown
  **Step 3: Detect the Current State**

  Check vault-side artifacts (documentation):
  ```bash
  # Check for specs (PRDs, requirements)
  ls projects/{projectName}/specs/ 2>/dev/null || echo "No specs"
  ```

  Check code-side artifacts (implementation):
  ```bash
  # Check for Gherkin features
  ls {codeRoot}/features/ 2>/dev/null || echo "No features"

  # Check for step definitions
  find {codeRoot} -name "*.steps.ts" 2>/dev/null | head -5

  # Check for implementation files
  find {codeRoot}/{frontendPath} -name "*.vue" 2>/dev/null | head -5
  find {codeRoot}/{backendPath} -name "*.controller.ts" 2>/dev/null | head -5

  # Check for test files
  find {codeRoot} -name "*.spec.ts" 2>/dev/null | head -5
  ```
  ```

  Note: `{frontendPath}` and `{backendPath}` come from the OKF `paths` map.

- [ ] **Step 3: Update error handling table**

  Add a new row to the Error Handling table:

  ```markdown
  | No matching codePaths entry | "No code path configured for machine '{id}'. Provide the path or add it to the OKF." |
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add .framework/skills/fluentit-orchestrator.md
  git commit -m "feat(orchestrator): add codePaths resolution for external project directories"
  ```

---

### Task 4: Update BDD Features Skill

**Files:**
- Modify: `.framework/skills/fluentit-bdd-features.md`

**Interfaces:**
- Consumes: Path resolution pattern from Task 3
- Produces: Skill that reads specs from vault, writes features to codeRoot

- [ ] **Step 1: Add path resolution after "Step 1: Read the OKF"**

  Insert the same path resolution block from Task 3 between Step 1 and Step 2:

  ```markdown
  **Step 2: Resolve the Code Path**

  Check if the OKF has a `codePaths` field.

  **If `codePaths` is present:**
  1. Determine the machine identifier: `FLUENTIT_MACHINE` env var → `~/.fluentit/machine.json` → `hostname`
  2. Find the matching entry in `codePaths`
  3. If found, set `{codeRoot}` to that path
  4. If not found, STOP and ask the user for the path

  **If `codePaths` is absent:**
  - Set `{codeRoot}` = `projects/{projectName}/`

  Use `projects/{projectName}/` for specs (vault side).
  Use `{codeRoot}/` for features (code side).
  ```

  Renumber subsequent steps (old Step 2 becomes Step 3, etc.).

- [ ] **Step 2: Update spec reading to use vaultRoot**

  In "Step 3: Read the Spec" (formerly Step 2), the Bash command should use the vault root:

  ```bash
  ls projects/{projectName}/{specPath}
  ```

  This is already correct — specs stay in the vault. No change needed to the path.

- [ ] **Step 3: Update feature file output to use codeRoot**

  In "Step 5: Write the Feature File" (formerly Step 4), change:

  ```markdown
  Use the Write tool to create:
  ```
  {codeRoot}/{featuresPath}/{feature-name}.feature
  ```

  If the directory doesn't exist, create it first:
  ```bash
  mkdir -p {codeRoot}/{featuresPath}
  ```
  ```

  Note: `{featuresPath}` comes from the OKF `paths.features` field (e.g., `features/`).

- [ ] **Step 4: Update report output**

  In "Step 6: Report What Was Done" (formerly Step 5), change the output to show the codeRoot path:

  ```markdown
  ```
  ✅ Generated: {codeRoot}/{featuresPath}/{feature-name}.feature

  Scenarios:
    - [scenario 1 name] (@frontend)
    - [scenario 2 name] (@backend)

  Next steps:
    1. Review the feature file
    2. Run: fluentit-bdd-frontend-steps --project {projectName}
    3. Run: fluentit-bdd-backend-steps --project {projectName}
  ```
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add .framework/skills/fluentit-bdd-features.md
  git commit -m "feat(bdd-features): write features to codeRoot, read specs from vaultRoot"
  ```

---

### Task 5: Update BDD Step Definition Skills

**Files:**
- Modify: `.framework/skills/fluentit-bdd-frontend-steps.md`
- Modify: `.framework/skills/fluentit-bdd-backend-steps.md`

**Interfaces:**
- Consumes: Path resolution pattern from Task 3
- Produces: Skills that read features from codeRoot, write steps to codeRoot

**Context:** Both skills follow the same pattern. They read feature files (now in codeRoot) and write step definitions (also in codeRoot). Apply the same changes to both files.

- [ ] **Step 1: Add path resolution to frontend steps skill**

  In `.framework/skills/fluentit-bdd-frontend-steps.md`, insert after "Step 1: Read the OKF":

  ```markdown
  **Step 2: Resolve the Code Path**

  Check if the OKF has a `codePaths` field.

  **If `codePaths` is present:**
  1. Determine the machine identifier: `FLUENTIT_MACHINE` env var → `~/.fluentit/machine.json` → `hostname`
  2. Find the matching entry in `codePaths`
  3. If found, set `{codeRoot}` to that path
  4. If not found, STOP and ask the user for the path

  **If `codePaths` is absent:**
  - Set `{codeRoot}` = `projects/{projectName}/`

  All feature and step definition operations use `{codeRoot}/`.
  ```

  Renumber subsequent steps.

- [ ] **Step 2: Update feature file search to use codeRoot**

  In "Step 3: Find the Feature File" (renumbered), change:
  ```bash
  find {codeRoot}/features -name "*{featureName}*.feature"
  ```

- [ ] **Step 3: Update step definition output to use codeRoot**

  In "Step 5: Generate Step Definitions" (renumbered), change the Write path:
  ```markdown
  Use Write to create:
  ```
  {codeRoot}/{frontendPath}/features/step-definitions/{featureName}.steps.ts
  ```
  ```

- [ ] **Step 4: Apply the same changes to backend steps skill**

  In `.framework/skills/fluentit-bdd-backend-steps.md`:
  1. Insert the same path resolution block after Step 1
  2. Change feature file search: `find {codeRoot}/features -name "*{featureName}*.feature"`
  3. Change step definition output: `{codeRoot}/{backendPath}/test/e2e/step-definitions/{featureName}.steps.ts`

- [ ] **Step 5: Commit both files**

  ```bash
  git add .framework/skills/fluentit-bdd-frontend-steps.md .framework/skills/fluentit-bdd-backend-steps.md
  git commit -m "feat(bdd-steps): read features and write steps to codeRoot"
  ```

---

### Task 6: Update TDD Skills

**Files:**
- Modify: `.framework/skills/fluentit-tdd-frontend.md`
- Modify: `.framework/skills/fluentit-tdd-backend.md`

**Interfaces:**
- Consumes: Path resolution pattern from Task 3
- Produces: Skills that read features from codeRoot, write code/tests to codeRoot

**Context:** Both TDD skills follow the same pattern. They read feature files (codeRoot), check existing code (codeRoot), write tests (codeRoot), and write implementation (codeRoot). The OKF is still read from vaultRoot.

- [ ] **Step 1: Add path resolution to frontend TDD skill**

  In `.framework/skills/fluentit-tdd-frontend.md`, insert after "Step 1: Read the OKF":

  ```markdown
  **Step 2: Resolve the Code Path**

  Check if the OKF has a `codePaths` field.

  **If `codePaths` is present:**
  1. Determine the machine identifier: `FLUENTIT_MACHINE` env var → `~/.fluentit/machine.json` → `hostname`
  2. Find the matching entry in `codePaths`
  3. If found, set `{codeRoot}` to that path
  4. If not found, STOP and ask the user for the path

  **If `codePaths` is absent:**
  - Set `{codeRoot}` = `projects/{projectName}/`

  Read OKF from `projects/{projectName}/okf/index.md` (vault side).
  Read/write all code and tests from `{codeRoot}/` (code side).
  ```

  Renumber subsequent steps.

- [ ] **Step 2: Update all code paths in frontend TDD to use codeRoot**

  Change these occurrences:
  1. Feature file search:
     ```bash
     find {codeRoot}/features -name "*{featureName}*.feature" 2>/dev/null
     ```
  2. Existing component check:
     ```bash
     find {codeRoot}/{frontendPath} -name "*{featureName}*.vue" -o -name "*{featureName}*.tsx" 2>/dev/null
     ```
  3. Existing test check:
     ```bash
     find {codeRoot}/{frontendPath} -name "*{featureName}*.spec.*" 2>/dev/null
     ```
  4. Test file write path:
     ```
     {codeRoot}/{frontendPath}/components/{FeatureName}.spec.ts
     ```
  5. Test run command:
     ```bash
     cd {codeRoot}/{frontendPath} && npm test -- {FeatureName}.spec.ts 2>&1
     ```
  6. Component write path:
     ```
     {codeRoot}/{frontendPath}/components/{FeatureName}.vue
     ```
  7. Report output:
     ```markdown
     Component: {codeRoot}/{frontendPath}/components/{FeatureName}.vue
     ```

- [ ] **Step 3: Apply the same changes to backend TDD skill**

  In `.framework/skills/fluentit-tdd-backend.md`:
  1. Insert the same path resolution block after Step 1
  2. Change feature file search: `find {codeRoot}/features -name "*{featureName}*.feature"`
  3. Change existing code checks: `find {codeRoot}/{backendPath} -name "*..."`
  4. Change test write path: `{codeRoot}/{backendPath}/{featureName}/{featureName}.controller.spec.ts`
  5. Change test run: `cd {codeRoot}/{backendPath} && npx jest ...`
  6. Change service write path: `{codeRoot}/{backendPath}/{featureName}/{featureName}.service.ts`
  7. Change controller write path: `{codeRoot}/{backendPath}/{featureName}/{featureName}.controller.ts`
  8. Change AppModule read path: `{codeRoot}/{backendPath}/app.module.ts`
  9. Change report output paths to use `{codeRoot}`

- [ ] **Step 4: Commit both files**

  ```bash
  git add .framework/skills/fluentit-tdd-frontend.md .framework/skills/fluentit-tdd-backend.md
  git commit -m "feat(tdd): read features and write code/tests to codeRoot"
  ```

---

### Task 7: Update Scaffolding Skills

**Files:**
- Modify: `.framework/skills/fluentit-domain-entity.md`
- Modify: `.framework/skills/fluentit-api-contracts.md`
- Modify: `.framework/skills/fluentit-backend-module.md`
- Modify: `.framework/skills/fluentit-frontend-guide.md`

**Interfaces:**
- Consumes: Path resolution pattern from Task 3
- Produces: Skills that read OKF from vaultRoot, write code to codeRoot

**Context:** These four skills all read the OKF (vault side) and generate code (code side). Each needs the same path resolution block and codeRoot substitution. Apply the pattern to each file.

- [ ] **Step 1: Update domain-entity skill**

  Read `.framework/skills/fluentit-domain-entity.md`.

  Insert the path resolution block after the OKF reading step.

  Replace all `projects/{projectName}/` prefixes for code output paths with `{codeRoot}/`.

  For example, if the skill writes to `{domainPath}/entities/{name}.entity.ts`, the Write path becomes `{codeRoot}/{domainPath}/entities/{name}.entity.ts`.

- [ ] **Step 2: Update api-contracts skill**

  Read `.framework/skills/fluentit-api-contracts.md`.

  Insert the path resolution block after the OKF reading step.

  Replace all code output paths with `{codeRoot}/` prefix. DTOs and API services are written to codeRoot.

- [ ] **Step 3: Update backend-module skill**

  Read `.framework/skills/fluentit-backend-module.md`.

  Insert the path resolution block after the OKF reading step.

  Replace module scaffold output paths with `{codeRoot}/` prefix.

- [ ] **Step 4: Update frontend-guide skill**

  Read `.framework/skills/fluentit-frontend-guide.md`.

  Insert the path resolution block after the OKF reading step.

  Replace all frontend code paths with `{codeRoot}/` prefix.

- [ ] **Step 5: Commit all four files**

  ```bash
  git add .framework/skills/fluentit-domain-entity.md .framework/skills/fluentit-api-contracts.md .framework/skills/fluentit-backend-module.md .framework/skills/fluentit-frontend-guide.md
  git commit -m "feat(scaffolding): resolve codeRoot for all code generation skills"
  ```

---

### Task 8: Update Workflow Skills (PR + Review)

**Files:**
- Modify: `.framework/skills/fluentit-pr.md`
- Modify: `.framework/skills/fluentit-review.md`

**Interfaces:**
- Consumes: Path resolution pattern from Task 3
- Produces: Skills that run git commands in codeRoot

**Context:** These skills run `cd projects/{projectName} && git ...`. They need to `cd` into codeRoot instead. They also need the path resolution block since they don't currently read the OKF.

- [ ] **Step 1: Add OKF reading + path resolution to PR skill**

  In `.framework/skills/fluentit-pr.md`, add before "Step 1: Check Status":

  ```markdown
  **Pre-step: Read the OKF and Resolve Code Path**

  Read `projects/{projectName}/okf/index.md`.

  If the OKF has `codePaths`:
  1. Determine machine identifier: `FLUENTIT_MACHINE` → `~/.fluentit/machine.json` → `hostname`
  2. Find matching entry in `codePaths`
  3. If found, set `{codeRoot}` to that path
  4. If not found, STOP and ask the user

  If `codePaths` is absent, set `{codeRoot}` = `projects/{projectName}/`.

  All git commands run in `{codeRoot}/`.
  ```

- [ ] **Step 2: Update all git commands in PR skill to use codeRoot**

  Replace all occurrences of:
  ```bash
  cd projects/{projectName} && git ...
  ```
  With:
  ```bash
  cd {codeRoot} && git ...
  ```

  This affects:
  - Step 1: `git status --short`
  - Step 2: `git add -A`
  - Step 3: `git commit -m ...`
  - Step 4: `git push origin ...`

- [ ] **Step 3: Apply the same changes to review skill**

  In `.framework/skills/fluentit-review.md`:
  1. Add the OKF reading + path resolution pre-step
  2. Replace `cd projects/{projectName} && git status --short` with `cd {codeRoot} && git status --short`
  3. Replace `cd projects/{projectName} && npm run lint` with `cd {codeRoot} && npm run lint`

- [ ] **Step 4: Commit both files**

  ```bash
  git add .framework/skills/fluentit-pr.md .framework/skills/fluentit-review.md
  git commit -m "feat(workflow): run git and lint commands in codeRoot"
  ```

---

### Task 9: Update Project Registry Documentation

**Files:**
- Modify: `projects/index.md`

**Interfaces:**
- Consumes: Two-root model from the spec
- Produces: Updated project registry that documents the new structure

- [ ] **Step 1: Read current projects/index.md**

  Read the file to see the current project listing template.

- [ ] **Step 2: Add two-root model documentation**

  Add a new section before or after the existing directory template:

  ```markdown
  ## Project Structure: Vault + Code

  FluentIT projects use a **two-root model**:

  - **Vault side** (`projects/{name}/`): OKF, specs, PRDs, ADRs, bounded contexts
  - **Code side** (external directory): Features, frontend code, backend code, tests

  The OKF (`projects/{name}/okf/index.md`) links them together via `codePaths`:

  ```yaml
  codePaths:
    - machine: "desktop"
      path: "C:/Users/Reforged/Projects/my-project"
  ```

  If `codePaths` is omitted, the project is **vault-local** — everything lives in `projects/{name}/`.
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add projects/index.md
  git commit -m "docs(projects): document two-root model and codePaths"
  ```

---

### Task 10: End-to-End Validation with Hello World

**Files:**
- Uses: All updated skills
- Creates: External code directory for hello-world

**Interfaces:**
- Consumes: All tasks 1-9
- Produces: Verified that the full pipeline works with external code

**Context:** This is the integration test. We verify that skills correctly resolve paths and read/write to the right locations.

- [ ] **Step 1: Create the external code directory**

  ```bash
  mkdir -p "C:/Users/Reforged/Projects/hello-world"
  ```

- [ ] **Step 2: Run the orchestrator and verify path resolution**

  In a Claude Code terminal (separate from this one), run:
  ```
  /fluentit-orchestrator --project hello-world --feature welcome
  ```

  **Expected behavior:**
  - Skill reads OKF from `projects/hello-world/okf/index.md` (vault)
  - Skill resolves machine to "desktop" via `~/.fluentit/machine.json`
  - Skill matches "desktop" in `codePaths` → `codeRoot = C:/Users/Reforged/Projects/hello-world`
  - Skill checks `projects/hello-world/specs/` and finds `welcome.md` ✅
  - Skill checks `C:/Users/Reforged/Projects/hello-world/features/` and finds nothing ❌
  - Recommends: `fluentit-bdd-features`

  **Verify:** The output mentions the external path `C:/Users/Reforged/Projects/hello-world`, not `projects/hello-world/`.

- [ ] **Step 3: Run BDD features and verify write location**

  ```
  /fluentit-bdd-features --project hello-world --specs specs/welcome.md
  ```

  **Expected behavior:**
  - Skill reads spec from `projects/hello-world/specs/welcome.md` (vault)
  - Skill writes feature file to `C:/Users/Reforged/Projects/hello-world/features/welcome.feature` (codeRoot)
  - Reports the codeRoot path in output

  **Verify:** Check that the file was created at the external path:
  ```bash
  cat "C:/Users/Reforged/Projects/hello-world/features/welcome.feature"
  ```

- [ ] **Step 4: Verify vault-side files are untouched**

  Confirm that `projects/hello-world/` still only contains:
  - `okf/index.md`
  - `specs/welcome.md`

  No `features/` directory should have been created in `projects/hello-world/`.

- [ ] **Step 5: Document the result**

  If all steps pass, the framework is working correctly with external code paths.

  If any step fails, debug the specific skill and fix the path references.

- [ ] **Step 6: Commit any validation artifacts**

  If the external code directory now contains generated files that should be tracked separately, initialize it as its own repo:
  ```bash
  cd "C:/Users/Reforged/Projects/hello-world"
  git init
  git add .
  git commit -m "feat: initial feature files from FluentIT framework"
  ```

  The vault-side commit (for the OKF update) was already done in Task 2.

---

## Self-Review Checklist

### 1. Spec Coverage

| Spec Section | Implementing Task |
|--------------|-------------------|
| 3.1 OKF Schema Extension (`codePaths` array) | Task 2 |
| 3.2 Machine Resolution Algorithm | Tasks 3-8 (embedded in each skill) |
| 3.3 Two Root Paths (`vaultRoot` + `codeRoot`) | Tasks 3-8 |
| 3.4 Path Mapping Table | Tasks 3-8 (per artifact type) |
| 3.5 Local Machine Config | Task 1 |
| 4. Skill Updates (all 13 skills) | Tasks 3-8 |
| 5. Error Handling | Tasks 3-8 (embedded in each skill) |
| 6.1 Existing Projects (vault-local) | Implicit — omission of `codePaths` preserves behavior |
| 6.2 New Projects (external code) | Task 1 (documentation) + Task 2 (example) |
| 7. Example (Hello World) | Task 2 (OKF) + Task 10 (validation) |
| 8. Backwards Compatibility | Verified — no `codePaths` = current behavior |

**No gaps identified.**

### 2. Placeholder Scan

- [x] No "TBD", "TODO", "implement later", "fill in details"
- [x] No vague error handling ("add appropriate validation")
- [x] No "similar to Task N" references without repeated code
- [x] All file paths are exact
- [x] All bash commands are exact with expected output

### 3. Type Consistency

- [x] `codePaths` — array of `{machine: string, path: string}` — consistent across all tasks
- [x] `{codeRoot}` — resolved path string — consistent across all skills
- [x] `{vaultRoot}` — always `projects/{projectName}/` — consistent
- [x] Machine resolution priority — identical in every skill: env var → config file → hostname

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-07-11-fluentit-project-externalization.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Each skill update is independent, so this parallelizes well.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints for review.

Which approach do you prefer?
