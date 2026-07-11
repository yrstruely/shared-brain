---
description: Project-agnostic interview-driven creation of domain entities. Uses RLM to explore existing conventions and ProjectContext for paths.
argument-hint: Provide feature description and project name
---

# New Domain Entity (Project-Agnostic)

> Structured interview to design and implement a new domain entity. Framework-independent — no framework imports in domain code. Uses RLM for convention discovery.

---

## Phase 0: Load Project Context

**Goal:** Load project configuration and discover existing domain conventions.

**Actions:**

1. **Load ProjectContext via RLM**

   ```typescript
   const context = await loadProjectContext(projectName);
   const { project, projectType } = context;
   ```

2. **Resolve paths**

   ```typescript
   const paths = {
     domain: project.paths.domain || `libs/domain/src/`,
     features: project.paths.features || `specs/features/`,
     docs: project.paths.docs || `documentation/`
   };
   ```

3. **Discover existing domain entities via RLM**

   ```typescript
   const conventions = await rlm.explore({
     project: projectName,
     path: paths.domain,
     query: "Extract coding conventions: constructor style, value object pattern, repository interfaces, events, index.ts organization"
   });
   ```

4. **Query Graphify for related entities**

   ```typescript
   const relatedEntities = await graphify.query(`
     MATCH (e:DomainEntity)
     WHERE e.project = $project
     RETURN e.name, e.properties
   `, { project: projectName });
   ```

---

## Phase 1: Initial Input

If `$ARGUMENTS` provided, use as feature description.
Otherwise, ask user:
- What domain entity or feature do you need? Describe the business concept.

Derive `FEATURE_NAME` from description (kebab-case).
Design doc path: `{paths.features}/{FEATURE_NAME}/DESIGN.md`.

---

## Phase 2: Parallel Documentation & Domain Extraction

### Step 2.1 — Discover documentation

Use RLM to explore project documentation:

```typescript
const docAnalysis = await rlm.explore({
  project: projectName,
  path: paths.docs,
  query: `Find all documentation relevant to: "${featureDescription}". Extract entities, business rules, state machines, relationships.`
});
```

### Step 2.2 — Extract conventions

```typescript
const codingConventions = await rlm.explore({
  project: projectName,
  path: paths.domain,
  query: "Extract coding conventions from existing domain entities: constructor style, value objects, repository pattern, events"
});
```

### Step 2.3 — Consolidate

Merge findings:
- Relevant documentation
- Existing entities that may relate (foreign keys)
- Coding conventions to follow
- Ambiguities and gaps

---

## Phase 3: Iterative Q&A (2–3 Rounds)

### Round 1 — Core Identity & Properties

- **Identity:** What uniquely identifies this entity?
- **Core properties:** Which properties are needed? (from docs, user confirms)
- **Relationships:** How does it relate to existing entities?
- **Ambiguities:** Present conflicting options from docs, ask user to choose

**Hard rule:** If docs conflict, present both options. Do NOT assume.

### Round 2 — Behavior & Lifecycle

- **Status/state machine:** Does it have statuses? Valid transitions?
- **Business methods:** What operations? Idempotent?
- **Events:** What should publish on change?
- **Repository queries:** How will it be looked up?

### Round 3 — Final Resolution (if needed)

Any still-unclear points get removed from the design entirely.

---

## Phase 4: Design Confirmation

Present complete design:

```
Entity: {EntityName}
Location: {paths.domain}/entities/{entity-name}.entity.ts

Properties:
  - id: string (readonly)
  - ...

Value Objects (if any):
  - {StatusVO}: [values] → transitions: ...

Business Methods:
  - methodName(): description

Events:
  - {Entity}CreatedEvent(props...)

Repository Interface: I{EntityName}Repository
  - save, findById, ...

Relationships:
  - belongs to {ExistingEntity} via {field}

Files to create:
  1. {paths.domain}/entities/{name}.entity.ts
  2. {paths.domain}/value-objects/... (if any)
  3. {paths.domain}/events/... (each event)
  4. {paths.domain}/repositories/... .interface.ts
  5. {paths.domain}/entities/{name}.entity.spec.ts
  6. Update: {paths.domain}/index.ts
```

Ask: Does this design look correct?

---

## Phase 5: Code Generation

Generate ALL files following conventions from Phase 2.

### Entity file
- Public readonly for immutable fields
- Public mutable for changeable fields
- Business methods that validate before mutating
- Idempotent state transitions
- `updatedAt` bumped on every mutation
- Throw plain `Error` for domain violations (not framework exceptions)

### Value Object files (if applicable)
- Static readonly array with `as const`
- Private constructor with validation
- `fromString()`, `toString()`, `equals()`
- For statuses: `isTerminal()`, `canTransitionTo()`

### Event files
- Simple class with `public readonly` constructor params
- Named `{Entity}{Action}Event`

### Repository interface
- Interface with async methods
- Symbol token: `export const I{Name}Repository = Symbol('I{Name}Repository')`
- Standard: save, findById, delete + domain-specific finders

### Unit tests
- Construction, business methods, state transitions, idempotency

### Update index.ts
- Add exports grouped with comment section

---

## Phase 6: Design Document & Index

### Generate DESIGN.md

```markdown
# Feature: {Feature Name}

## Phase 1: Domain Model

Created by: /dna-new-domain-entity
Date: {YYYY-MM-DD}

### Entity: {EntityName}

**Properties:**
| Field | Type | Mutable | Description |
|-------|------|---------|-------------|
| id | string | readonly | UUID |
| ... | ... | ... | ... |

**Value Objects:**
- **{StatusVO}**: [{values}] — transitions: {from} → {to}

**Events:**
| Event | Trigger | Properties |
|-------|---------|------------|
| {Entity}CreatedEvent | created | id, ... |

**Repository:** I{EntityName}Repository
- save, findById, ...

**Design Decisions:**
- "{Decision}": {reason}

**Generated Files:**
1. `{paths.domain}/entities/{name}.entity.ts`
2. ...

### Suggested Next Steps
- Create API contracts: `/dna-api-contracts {FEATURE_NAME}`
- Create backend module: `/dna-backend-module {FEATURE_NAME}`
```

### Update Graphify

```bash
/graphify:index --project {projectName}
```

---

## Rules

- NEVER use `any`. Use `unknown` or specific types.
- NEVER import framework code in domain layer.
- NEVER guess. If unsure after asking, drop it.
- Follow existing entity patterns as reference.
- Keep entities focused. Suggest splitting if scope creeps.

---

## Source

Original: `.framework/agents/playbooks/dna-tools/commands/dna-new-domain-entity.md`
