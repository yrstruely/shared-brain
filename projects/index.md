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

## Cross-Project Intelligence

```bash
# Find patterns used by multiple projects
/wiki:query "patterns used by >1 project"

# Compare tech stacks
/wiki:query "compare tech stacks of ip-hub and billing-service"

# Find reusable domain logic
/graphify:query --pattern P3 --params sourceProject=ip-hub,pattern=Cart
```
