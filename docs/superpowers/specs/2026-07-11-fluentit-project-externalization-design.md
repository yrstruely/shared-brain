# FluentIT Project Externalization Design

## Date: 2026-07-11
## Status: Draft — pending review

---

## 1. Problem Statement

Currently, the FluentIT framework assumes all project artifacts live inside the shared-brain vault under `projects/{name}/`. This includes:

- OKF metadata (`projects/{name}/okf/index.md`)
- PRDs and specs (`projects/{name}/specs/`)
- Gherkin feature files (`projects/{name}/features/`)
- Frontend code (`projects/{name}/frontend/src/`)
- Backend code (`projects/{name}/backend/src/`)

This design has two problems:

1. **Projects cannot live in separate git repositories.** The shared-brain vault is one git repo. If a project needs its own repo (e.g., IP Hub on GitHub), the code cannot be versioned independently.
2. **Multi-machine setups fail silently.** The vault lives on a shared NAS, but code is developed on local machines with different directory structures. Hardcoding `projects/{name}/` breaks when the same user works on a desktop, laptop, and WSL environment.

## 2. Goals

1. Allow project **code** (features, frontend, backend) to live outside the vault in a separate directory or git repository.
2. Keep project **documentation** (OKF, specs) inside the vault where it serves as cross-project knowledge.
3. Support **multiple local paths** for the same project across different machines.
4. **Never silently fall back** to a default path — if the code path is unresolved, ask the user.
5. Maintain **backwards compatibility** for existing projects that still keep everything in `projects/{name}/`.

## 3. Proposed Solution

### 3.1 OKF Schema Extension: `codePaths`

The OKF (`projects/{name}/okf/index.md`) gains a new `codePaths` field — an array of machine-to-path mappings:

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
  tests:
    unit: backend/src/**/*.spec.ts
    integration: backend/test
    e2e: frontend/e2e
codePaths:
  - machine: "desktop"
    path: "C:/Users/Reforged/Projects/hello-world"
  - machine: "laptop"
    path: "C:/Users/Kerry/Projects/hello-world"
  - machine: "wsl"
    path: "/mnt/c/Users/Reforged/Projects/hello-world"
---

# Hello World

Minimal validation project for the FluentIT framework.
```

**Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `codePaths` | `Array<{machine: string, path: string}>` | No | Maps machine identifiers to local code directories. |
| `codePaths[].machine` | `string` | Yes (per entry) | Identifier for the machine/environment. |
| `codePaths[].path` | `string` | Yes (per entry) | Absolute or relative path to the project code root. |

**For backwards compatibility:**
- If `codePaths` is absent and `codePath` (singular string) is present, treat it as a single-entry array with `machine: "default"`.
- If both are absent, the project is **vault-local** — all artifacts live in `projects/{name}/`. This is the current behavior.

### 3.2 Machine Resolution Algorithm

Each skill that needs to access code follows this algorithm:

```
function resolveCodePath(projectName, okf):

  1. Read OKF from vault: projects/{projectName}/okf/index.md
     If missing → STOP: "Project '{name}' not found. Create the OKF first."

  2. If OKF has no codePaths and no codePath:
     → Project is vault-local. Use projects/{projectName}/ as the code root.
     → Return projects/{projectName}/

  3. Determine the machine identifier in this priority:
     a. Environment variable: FLUENTIT_MACHINE
     b. Local config file: ~/.fluentit/machine.json → { "machine": "desktop" }
     c. Hostname: Run `hostname` and use the output

  4. Match the machine identifier against codePaths entries.
     If a match is found → Return the matched path.

  5. If no match found:
     → STOP and ask the user:
        "No code path configured for machine '{machineId}' in project '{name}'.
         Please provide the path to the project code, or add it to the OKF:
         codePaths:
           - machine: '{machineId}'
             path: '<your path here>'"
```

**Important:** There is no silent fallback to `projects/{name}/` for code when `codePaths` is present. The skill must either find a matching entry or ask the user.

### 3.3 Two Root Paths Per Project

After resolution, every skill operates with **two roots**:

| Root | Purpose | Always In |
|------|---------|-----------|
| `vaultRoot` = `projects/{name}/` | OKF, specs, ADRs, bounded contexts, PRDs | Shared-brain vault |
| `codeRoot` = resolved from `codePaths` | Features, frontend code, backend code, tests, git ops | External directory or repo |

For a vault-local project (no `codePaths`), both roots are the same: `projects/{name}/`.

### 3.4 Path Mapping for Each Artifact Type

| Artifact | Vault Path | Code Path | Notes |
|----------|-----------|-----------|-------|
| OKF | `{vaultRoot}/okf/index.md` | — | Always in vault |
| Bounded contexts | `{vaultRoot}/okf/bounded-contexts/` | — | Always in vault |
| ADRs | `{vaultRoot}/okf/adr/` | — | Always in vault |
| Specs/PRDs | `{vaultRoot}/specs/` | — | Always in vault |
| Feature files | — | `{codeRoot}/{featuresPath}/` | Executable tests; from OKF `paths.features` |
| Frontend code | — | `{codeRoot}/{frontendPath}/` | From OKF `paths.frontend` |
| Backend code | — | `{codeRoot}/{backendPath}/` | From OKF `paths.backend` |
| Domain entities | — | `{codeRoot}/{domainPath}/` | From OKF `paths.domain` |
| Git operations | — | `{codeRoot}/` | `.git` is in the code root |
| Step definitions | — | `{codeRoot}/{testPaths}/` | From OKF `paths.tests.*` |

### 3.5 Local Machine Config

Each machine stores its identifier in `~/.fluentit/machine.json`:

```json
{
  "machine": "desktop"
}
```

This file is **machine-local** and **not committed to the vault.** It allows the same user to have different identifiers on different machines without modifying the shared OKF.

Alternatively, the user can set an environment variable:
```bash
# Windows
set FLUENTIT_MACHINE=desktop

# Linux/macOS/WSL
export FLUENTIT_MACHINE=wsl
```

The environment variable takes priority over the config file.

## 4. Skill Updates Required

All 13 FluentIT skills need updating. The changes fall into three categories:

### Category A: Read OKF + Read Vault Files Only
Skills that only read the OKF and specs (no code access):

| Skill | Change |
|-------|--------|
| `fluentit-orchestrator` | Resolve `codeRoot`. Use `vaultRoot` for specs/state checks. Use `codeRoot` for code/state checks. |
| `fluentit-bdd-features` | Read specs from `vaultRoot`. Write features to `codeRoot/{featuresPath}/`. |

### Category B: Read Code + Write Code
Skills that read features and write implementation:

| Skill | Change |
|-------|--------|
| `fluentit-bdd-frontend-steps` | Read features from `codeRoot`. Write step defs to `codeRoot`. |
| `fluentit-bdd-backend-steps` | Read features from `codeRoot`. Write step defs to `codeRoot`. |
| `fluentit-tdd-frontend` | Read features from `codeRoot`. Write tests + components to `codeRoot`. |
| `fluentit-tdd-backend` | Read features from `codeRoot`. Write tests + services to `codeRoot`. |
| `fluentit-domain-entity` | Read OKF from `vaultRoot`. Write entities to `codeRoot`. |
| `fluentit-api-contracts` | Read OKF from `vaultRoot`. Write DTOs + API services to `codeRoot`. |
| `fluentit-backend-module` | Read OKF from `vaultRoot`. Write module scaffold to `codeRoot`. |
| `fluentit-frontend-guide` | Read OKF from `vaultRoot`. Guide implementation in `codeRoot`. |

### Category C: Git Operations
Skills that run git commands:

| Skill | Change |
|-------|--------|
| `fluentit-pr` | Run `cd {codeRoot} && git ...` instead of `cd projects/{name} && git ...`. |
| `fluentit-review` | Run `cd {codeRoot} && git ...` instead of `cd projects/{name} && git ...`. |

### 4.1 Skill Template Change

Every skill's step-by-step instructions currently say:

```markdown
Use the Read tool to open `projects/{projectName}/okf/index.md`.
```

This becomes:

```markdown
**Step 1: Read the OKF**

Use the Read tool to open `projects/{projectName}/okf/index.md`.

Extract:
- `techStack.*` — technology choices
- `paths.*` — sub-directory structure
- `codePaths` — machine-to-path mappings (if present)

**Step 2: Resolve the Code Path**

If `codePaths` is present:
1. Determine the machine identifier (FLUENTIT_MACHINE env var → ~/.fluentit/machine.json → hostname)
2. Find the matching entry in `codePaths`
3. If found, use that path as `{codeRoot}`
4. If not found, STOP and ask the user for the code path

If `codePaths` is absent, the project is vault-local:
- `{codeRoot}` = `projects/{projectName}/`

**Step 3: Use the correct root for each operation**

- Vault operations (specs, OKF): `projects/{projectName}/...`
- Code operations (features, code, tests): `{codeRoot}/...`
```

## 5. Error Handling

| Problem | Response |
|---------|----------|
| OKF missing | "Project '{name}' not found. Create projects/{name}/okf/index.md first." |
| `codePaths` present, no matching machine | "No code path configured for machine '{id}'. Provide the path or add it to the OKF." |
| `codePaths` entry path does not exist | "Code path '{path}' does not exist. Check the path and try again." |
| `~/.fluentit/machine.json` missing | Fall back to hostname detection. |
| Hostname not in `codePaths` | Ask user (no silent fallback). |
| Both `codePath` (string) and `codePaths` (array) present | Prefer `codePaths`; warn that `codePath` is deprecated. |

## 6. Migration Path

### 6.1 Existing Projects (Vault-Local)

Projects like `hello-world` that keep everything in `projects/{name}/` require **no changes.** They simply omit the `codePaths` field, and skills behave exactly as before.

### 6.2 New Projects (External Code)

1. Create the OKF in the vault: `projects/{name}/okf/index.md`
2. Add `codePaths` with entries for each machine:
   ```yaml
   codePaths:
     - machine: "desktop"
       path: "C:/Users/Reforged/Projects/{name}"
   ```
3. Set up the machine identifier on each development machine:
   ```bash
   mkdir -p ~/.fluentit
   echo '{"machine": "desktop"}' > ~/.fluentit/machine.json
   ```
4. The external code directory can be initialized as a separate git repo:
   ```bash
   cd C:/Users/Reforged/Projects/{name}
   git init
   ```

### 6.3 Existing Projects Migrating to External Code

1. Move code directories (`features/`, `frontend/src/`, `backend/src/`) to the external location.
2. Add `codePaths` to the OKF.
3. Leave specs, ADRs, and bounded contexts in the vault.
4. Verify by running `fluentit-orchestrator --project {name}`.

## 7. Example: Hello World with External Code

### 7.1 Vault Side (shared-brain)

`projects/hello-world/okf/index.md`:
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
  tests:
    unit: backend/src/**/*.spec.ts
    integration: backend/test
    e2e: frontend/e2e
codePaths:
  - machine: "desktop"
    path: "C:/Users/Reforged/Projects/hello-world"
---

# Hello World

Minimal validation project for the FluentIT framework.
```

`projects/hello-world/specs/welcome.md`:
```markdown
## Feature
As a user, I want to see a welcome message.

## Acceptance Criteria
Given the user opens the application
When the page finishes loading
Then the user sees "Hello, World!"
```

### 7.2 Code Side (local machine)

`C:/Users/Reforged/Projects/hello-world/`:
```
hello-world/
├── features/
│   └── welcome.feature          ← Generated by fluentit-bdd-features
├── frontend/
│   └── src/
│       └── components/
│           └── WelcomeMessage.vue   ← Generated by fluentit-tdd-frontend
├── backend/
│   └── src/
│       └── welcome/
│           ├── welcome.controller.ts  ← Generated by fluentit-tdd-backend
│           └── welcome.service.ts     ← Generated by fluentit-tdd-backend
├── package.json
└── .git/                        ← Separate git repo
```

### 7.3 Skill Execution Flow

**User runs:**
```
/fluentit-orchestrator --project hello-world --feature welcome
```

**Skill resolves:**
1. Reads OKF from `projects/hello-world/okf/index.md`
2. Finds `codePaths` with machine entries
3. Determines machine ID: `FLUENTIT_MACHINE` → `~/.fluentit/machine.json` → `hostname`
4. Matches `"desktop"` → `codeRoot = "C:/Users/Reforged/Projects/hello-world"`
5. Checks vault side: `specs/welcome.md` exists ✅
6. Checks code side: `features/` is empty ❌
7. Recommends: `fluentit-bdd-features`

**User runs:**
```
/fluentit-bdd-features --project hello-world --specs specs/welcome.md
```

**Skill resolves:**
1. Reads OKF, resolves `codeRoot` as above
2. Reads spec from `projects/hello-world/specs/welcome.md` (vault side)
3. Generates `welcome.feature`
4. Writes to `C:/Users/Reforged/Projects/hello-world/features/welcome.feature` (code side)
5. Reports: "✅ Generated feature file at {codeRoot}/features/welcome.feature"

## 8. Backwards Compatibility

- **No `codePaths` field** → Full vault-local behavior. All skills use `projects/{name}/` for everything.
- **Singular `codePath` string** → Treated as `codePaths: [{machine: "default", path: <value>}]`.
- **All existing skills** continue to work for vault-local projects without modification.

## 9. Open Questions

1. **Should the machine config file live in `.claude/` instead of `~/.fluentit/`?** Claude Code already has `~/.claude/` for settings. Using `.claude/fluentit-machine.json` would colocate with existing config.
2. **Should `codePaths` support relative paths from the vault root?** E.g., `path: "../hello-world-code"` resolved relative to the vault directory. This would make the OKF more portable if the relative structure is consistent across machines.
3. **Should there be a `default` machine entry that serves as a fallback?** This would allow one entry to catch all unmatched machines, but it conflicts with the "never silently fall back" principle.

## 10. Success Criteria

- [ ] `fluentit-orchestrator` correctly resolves `codeRoot` and reports state from both vault and code sides.
- [ ] `fluentit-bdd-features` reads specs from vault, writes features to code path.
- [ ] `fluentit-tdd-frontend` reads features from code path, writes components to code path.
- [ ] `fluentit-pr` runs git commands in the code path.
- [ ] When `codePaths` is absent, all skills behave exactly as before (vault-local).
- [ ] When no machine matches, the skill asks the user instead of failing silently.
- [ ] The hello-world project can be set up with external code and the full pipeline runs end-to-end.
