---
description: Project-agnostic knowledge graph for code relationships. JSON-based MVP with TypeScript parser, query engine, and CLI.
argument-hint: Provide project name to index or query (e.g., ip-hub)
---

# Graphify Minimal (MVP)

> Project-agnostic knowledge graph for code relationships. JSON-based implementation.

---

## Status

✅ **Implemented** — JSON-based graph store with TypeScript parser, query engine, and CLI.

**Location:** `.framework/external/graphify-minimal/`

## Dependencies

- Node.js 20+
- TypeScript (for build)

Zero runtime dependencies.

---

## Installation

```bash
cd .framework/external/graphify-minimal
npm install
npm run build
```

---

## CLI Usage

```bash
# Index a project
node bin/graphify.js index --project ip-hub --code projects/ip-hub/src --vault .

# Query
node bin/graphify.js query --project ip-hub --pattern P1
node bin/graphify.js query --project ip-hub --cypher "MATCH (p:Project) RETURN p"

# Stats
node bin/graphify.js stats --project ip-hub

# List indexed projects
node bin/graphify.js list
```

---

## Storage

```typescript
// Simple JSON-based graph store
interface GraphStore {
  nodes: Node[];
  edges: Edge[];
  version: string;
}

// Saved per-project: .graphify/{project}-index.json
```

---

## Node Types

| Type | Properties |
|------|------------|
| `Project` | name, path, type, techStack |
| `DomainEntity` | name, codePath, project, boundedContext |
| `Feature` | name, path, project, status |
| `ADR` | id, title, status, project |
| `Pattern` | id, name, category, projects[] |
| `Test` | name, path, type, project |
| `Module` | name, path, project, imports[] |

---

## Edge Types

| Type | From → To |
|------|-----------|
| `DEPENDS_ON` | Module → Module |
| `IMPLEMENTS` | DomainEntity → Feature |
| `TESTED_BY` | Feature → Test |
| `USES_PATTERN` | Module → Pattern |
| `PART_OF` | DomainEntity → BoundedContext |
| `REFERENCES` | ADR → ADR |

---

## Indexing Pipeline

```typescript
async function indexProject(projectName: string): Promise<void> {
  const project = await loadProject(projectName);

  // 1. Parse TypeScript AST
  const entities = await parseTypeScriptEntities(project.codePath);

  // 2. Parse Gherkin features
  const features = await parseGherkinFeatures(project.featuresPath);

  // 3. Parse OKF bundle
  const okf = await loadOkfBundle(project.okfPath);

  // 4. Build graph
  const graph = buildGraph({ entities, features, okf });

  // 5. Save
  await saveGraph(projectName, graph);
}
```

---

## Query API

```typescript
// Mirror Graphify's query interface
async function query(cypher: string, params: object): Promise<Result[]> {
  // Parse simple Cypher-like queries
  // Execute against JSON store
  // Return results
}
```

### Supported Query Patterns

| Pattern | Cypher | Description |
|---------|--------|-------------|
| P1 | `MATCH (p:Project) RETURN p` | List all projects |
| P2 | `MATCH (e:DomainEntity) WHERE e.project = $project RETURN e` | List project entities |
| P3 | `MATCH (e:DomainEntity {name: $entity})<-[:DEPENDS_ON]-(d) RETURN d` | Find dependents |
| P4 | `MATCH (p:Pattern) WHERE $entity IN p.projects RETURN p` | Find patterns for entity |
| P5 | `MATCH (f:Feature) WHERE f.project = $project AND f.status = 'done' RETURN f` | List done features |

---

## Commands

| Command | Description |
|---------|-------------|
| `/graphify:index --project <name>` | Index a project |
| `/graphify:query --pattern P<n> --params {...}` | Query the graph |
| `/graphify:reindex --all` | Reindex all projects |
| `/graphify:stats` | Show graph statistics |

---

## Migration Path

When Graphify is available:

1. Export JSON store: `graphify:export --project <name>`
2. Import to Graphify: `graphify:import --source json`
3. Update skill to use real Graphify API
4. Keep JSON as fallback/cache
