---
description: Load project context recursively using RLM instead of naive prompt stuffing. Returns ~15k tokens of highly relevant context.
argument-hint: Provide project name (e.g., ip-hub)
---

# RLM Context Loader

> Load project context recursively using RLM instead of naive prompt stuffing.

---

## Status

✅ **Active** — Uses hampton-io/RLM (`~/RLM`).

## Dependencies

- `hampton-io/RLM` — Primary RLM implementation for Claude Code
- `graphify-minimal` skill (for code relationship queries)
- `wiki-ingest-pipeline` skill (for cross-project pattern queries)

---

## Configuration

```typescript
import { RLM } from 'hampton-io/RLM';

const rlm = new RLM({
  model: 'claude-sonnet-4',
  verbose: true,
  tools: ['chunk', 'grep', 'summarize', 'groupBy'],
});
```

---

## Alternative: Backend Projects

For NestJS/backend services that need embedded RLM, use `code-rabi/rllm` as a project dependency (not globally):

```bash
# Inside a backend project only
cd projects/my-backend
pnpm add rllm
```

---

## Project Discovery

```typescript
async function loadProjectContext(projectName: string): Promise<ProjectContext> {
  // 1. Load project OKF index
  const project = await readOkfIndex(`projects/${projectName}/okf/index.md`);

  // 2. Load project-type config
  const projectType = await readProjectType(project.projectType);

  // 3. Query Graphify for relevant context
  const graphContext = await graphify.query(`
    MATCH (p:Project {name: $project})
    RETURN p, p.features, p.domain, p.adrs
  `, { project: projectName });

  // 4. Query Wiki for cross-project patterns
  const wikiContext = await wiki.query(`
    Find patterns for: ${project.techStack}
    Find anti-patterns for: ${project.projectType}
  `);

  return { project, projectType, graphContext, wikiContext };
}
```

---

## Usage in Agents

All BDD/TDD agents call this loader before execution:

```typescript
const context = await loadProjectContext('ip-hub');
// Agent receives ~15k tokens of highly relevant context
// instead of 50k+ tokens of raw codebase
```

---

## Context Schema

```typescript
interface ProjectContext {
  project: {
    name: string;
    type: string;
    techStack: TechStack;
    repoUrl: string;
    ciUrl: string;
  };
  projectType: {
    patterns: Pattern[];
    antiPatterns: AntiPattern[];
    templates: Template[];
  };
  graphContext: {
    entities: DomainEntity[];
    features: Feature[];
    adrs: ADR[];
  };
  wikiContext: {
    patterns: Pattern[];
    antiPatterns: AntiPattern[];
    technologies: Technology[];
  };
}
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/rlm:load-context --project <name>` | Load full context for a project |
| `/rlm:query --project <name> "<question>"` | Ask a question with RLM context |

---

## Installation

```bash
# Primary: hampton-io/RLM (for Claude Code)
git clone https://github.com/hampton-io/RLM.git
cd RLM && npm install && npm run build
```

## Backend Alternative

For backend services needing embedded RLM, install `code-rabi/rllm` per-project:

```bash
cd projects/my-backend
pnpm add rllm
```

See [code-rabi/rllm](https://github.com/code-rabi/rllm) for backend integration docs.
