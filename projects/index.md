# Projects Index

> Per-project OKF bundles and knowledge.

---

## Active Projects

| Project | Type | Status | Patterns |
|---------|------|--------|----------|
| [[projects/ip-hub/okf/index\|IP Hub]] | nestjs-vue | 🚧 In Progress | P1-P5 |
| [[projects/hello-world/okf/index\|Hello World]] | nestjs-vue | 🧪 Validating | — |

---

## Project Status Legend

| Symbol | Meaning |
|--------|---------|
| 🚧 | In Progress |
| ✅ | Complete |
| ⏳ | Planned |
| 🗃️ | Archived |

---

## Quick Commands

```bash
# Initialize new project
/framework:init-project --name <name> --type <type>

# Ingest project sources
/wiki:ingest projects/<name>/sources/

# Index project code
/graphify:index --project <name>

# Query project patterns
/wiki:query "patterns used by <name>"
```

---

## Project Template

Each project has:

```
projects/<name>/
├── okf/
│   ├── index.md              # Project metadata
│   ├── bounded-contexts/     # Domain contexts
│   └── adr/                  # Architecture decisions
├── sources/
│   ├── prds/                 # Product requirements
│   ├── rfcs/                 # RFCs
│   └── meeting-notes/        # Meeting notes
└── links.md                  # External links
```

---

## Project Structure: Vault + Code

FluentIT projects use a **two-root model**:

- **Vault side** (`projects/<name>/`): OKF, specs, PRDs, ADRs, bounded contexts
- **Code side** (external directory): Features, frontend code, backend code, tests

The OKF (`projects/<name>/okf/index.md`) links them together via `codePaths`:

```yaml
codePaths:
  - machine: "desktop"
    path: "C:/Users/Reforged/Projects/my-project"
```

If `codePaths` is omitted, the project is **vault-local** — everything lives in `projects/<name>/`.

---

## Cross-Project Intelligence

```bash
# Find patterns used by multiple projects
/wiki:query "patterns used by >1 project"

# Compare tech stacks
/wiki:query "compare tech stacks of ip-hub and billing-service"

# Find reusable domain logic
/graphify:query --pattern P3 --params sourceProject=ip-hub,pattern=Cart
```
