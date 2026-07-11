---
description: Loads project context by reading the OKF file. All skills use this as their first step.
argument-hint: Provide project name.
---

# RLM Context Loader

> Reads the project OKF file and extracts configuration. Every skill starts here.

## How to Use

This skill is used **internally** by other skills. You don't invoke it directly.

## What It Does

1. Reads `projects/{projectName}/okf/index.md`
2. Parses the YAML frontmatter
3. Returns project configuration

## Manual Equivalent

If you need to load context manually:

```bash
# Read the OKF
cat projects/{projectName}/okf/index.md

# Extract key fields:
# - name: project name
# - type: project type (nestjs-vue, etc.)
# - techStack: frontend, backend, database info
# - paths: where code lives
```

## OKF Template

```markdown
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
  specs:
    frontend: specs/frontend
    backend: specs/backend
---

# My Project

Brief description.
```

## Important Notes

- The OKF is the **single source of truth** for project configuration
- All skills read it to know where files live and what tech stack to use
- If a skill fails, the first thing to check is whether the OKF is correct
