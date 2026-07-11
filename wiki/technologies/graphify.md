> **Type:** Technology
> **Source:** `.framework/skills/graphify-minimal.md`
> **Related:** [[wiki/technologies/rlm|RLM]], [[wiki/concepts/project-context|ProjectContext]]

# Graphify

**Graphify** is the code relationship knowledge graph of the framework. It stores and queries relationships between projects, domain entities, features, tests, and modules.

---

## Implementation

The framework uses **Graphify Minimal** — a zero-dependency JSON-based implementation that mirrors the full Graphify API.

| Aspect | Details |
|--------|---------|
| **Storage** | JSON files per project (`.graphify/{project}-index.json`) |
| **Location** | `.framework/external/graphify-minimal/` |
| **Dependencies** | Node.js 20+ only (zero runtime deps) |
| **Status** | ✅ Implemented and tested |

---

## Node Types

| Type | Represents | Properties |
|------|-----------|------------|
| `Project` | A project in the vault | name, path, type |
| `DomainEntity` | Business entity | name, codePath, boundedContext |
| `Feature` | BDD feature | name, path, status, scenarios |
| `ADR` | Architecture decision | id, title, status |
| `Pattern` | Reusable pattern | name, category |
| `Test` | Test file | name, path, type |
| `Module` | Code module | name, path, imports |
| `Class` | TypeScript class | name, module |
| `Function` | Function/method | name, module |

## Edge Types

| Type | Relationship |
|------|-------------|
| `DEPENDS_ON` | Module → Module |
| `IMPORTS` | Module → external package |
| `IMPLEMENTS` | DomainEntity → Feature |
| `TESTED_BY` | Feature → Test |
| `USES_PATTERN` | Module → Pattern |
| `PART_OF` | Entity → BoundedContext |
| `CONTAINS` | Module → Class/Function |

---

## CLI Commands

```bash
# Index a project
cd .framework/external/graphify-minimal
node bin/graphify.js index --project ip-hub --code /path/to/src --vault /path/to/vault

# Query
node bin/graphify.js query --project ip-hub --pattern P1
node bin/graphify.js query --project ip-hub --cypher "MATCH (p:Project) RETURN p"

# Stats
node bin/graphify.js stats --project ip-hub

# List projects
node bin/graphify.js list
```

## Query Patterns

| Pattern | Description |
|---------|-------------|
| P1 | List all projects |
| P2 | List entities for a project |
| P3 | Find dependents of an entity |
| P4 | Find patterns for an entity |
| P5 | List done features for a project |

---

## Usage in Skills

Skills query Graphify for code discovery:

```typescript
// Find existing entities
const entities = await graphify.query(`
  MATCH (e:DomainEntity) WHERE e.project = $project RETURN e
`, { project: projectName });

// Find related components
const related = await graphify.query(`
  MATCH (c:Component) WHERE c.project = $project RETURN c
`, { project: projectName });

// Find features
const features = await graphify.query(`
  MATCH (f:Feature) WHERE f.project = $project RETURN f
`, { project: projectName });
```

---

## Migration Path

When full Graphify is available:

1. Export JSON store
2. Import to Graphify
3. Update skill to use Graphify API
4. Keep JSON as fallback/cache

---

## Related

- [[wiki/concepts/project-context|ProjectContext]] — Graphify feeds into context loading
- [[technologies/graphify|graphify]]
- `.framework/external/graphify-minimal/` — Implementation code
