---
name: dna-new-domain-entity
description: Interview-driven creation of new domain entities. Explores project documentation, cross-references with existing domain model, resolves ambiguities through 2-3 rounds of Q&A, and generates DDD-compliant domain code.
allowed-tools: Read, Grep, Glob, Task, AskUserQuestion, Write, Edit
---

# New Domain Entity — Structured Interview

You are conducting a structured interview to design and implement a new domain entity
for the IP Hub App. The domain layer is **framework-independent** — no NestJS,
no TypeORM, no api-contracts imports.

Paths:
- Domain source: `libs/domain/src/`
- Documentation: `documentation/technical-project-context/`
- Exports: `libs/domain/src/index.ts`
- Design doc: `specs/features/{feature-name}/DESIGN.md`

Output artifacts: entity, value objects (if needed), events, repository interface, unit tests, **DESIGN.md**.

---

## Phase 0: Initial Input

If `$ARGUMENTS` is provided, use it as the feature description.
Otherwise, use `AskUserQuestion` to ask:
- What domain entity or feature do you need? Describe the business concept.

Store the user's answer as `FEATURE_DESCRIPTION` for all subsequent phases.

Derive `FEATURE_NAME` from the description — a short kebab-case identifier
(e.g., "payment processing" → `payment-processing`). This becomes the folder name
for the design doc: `specs/features/{FEATURE_NAME}/DESIGN.md`.

---

## Phase 1: Parallel Documentation & Domain Extraction

### Step 1.1 — Discover documentation structure

Use `Glob` with pattern `documentation/technical-project-context/**/*.md` to find all docs.
Group the results by their **first subdirectory** under `technical-project-context/`.
Count how many groups you have — this determines the number of subagents.

### Step 1.2 — Launch subagents

For **each discovered subdirectory group**, launch a `Task` subagent (`subagent_type: Explore`)
with this prompt:

> Read all markdown files under `documentation/technical-project-context/{subdirectory}/`.
> Extract ONLY information relevant to: "{FEATURE_DESCRIPTION}".
>
> Return a structured summary:
> 1. Entities, properties, and relationships mentioned
> 2. Business rules and constraints
> 3. State machines or status workflows
> 4. Relationships to other bounded contexts
> 5. Ambiguities or contradictions found
>
> If nothing relevant found, return: "No relevant content in {subdirectory}."

Also launch **one additional subagent** (`subagent_type: Explore`) to learn coding conventions
and discover entities the new feature may need to reference:

> We are creating a NEW domain entity for: "{FEATURE_DESCRIPTION}".
> There is NO existing code for this feature yet.
>
> Read all files in `libs/domain/src/` (entities, value-objects, repositories, events).
>
> Extract two things:
>
> A) **Coding conventions to follow** (the new entity must match these exactly):
>    1. Constructor style — public vs private fields, readonly usage
>    2. Value object pattern — static constants, fromString, private constructor
>    3. Repository interface pattern — methods, filters, Symbol token
>    4. Event pattern — constructor parameters, naming
>    5. How index.ts organizes exports (comment sections, grouping)
>
> B) **Entities the new feature may reference or relate to**:
>    List entity names and their IDs/key properties that could be foreign keys
>    or relationships for "{FEATURE_DESCRIPTION}".

Launch ALL subagents **in parallel**. Wait for all to complete. It is OK to run 15-20 subagents in parallel.

### Step 1.3 — Consolidate

Merge subagent results into a single analysis:
- **Relevant doc findings** (only from subagents that returned useful content)
- **Entities to reference** (existing entities the new feature may link to via foreign keys)
- **Coding conventions** — patterns the new entity must follow
- **Ambiguities list** — contradictions between docs, unclear points, missing details

Remove any subagent results that said "No relevant content."
Ignore gaps not related to the feature description.

---

## Phase 2: Iterative Q&A Clarification (2–3 Rounds)

Run exactly 2 rounds minimum, up to 3 if ambiguities remain.
Use `AskUserQuestion` for each round (up to 4 questions per call).

### Round 1 — Core Identity & Properties

Based on Phase 1 findings, ask about:
- **Identity**: What uniquely identifies this entity? UUID? Composite key? Who owns it?
- **Core properties**: Present the properties found in docs. Ask which are actually needed.
  Remove anything the user doesn't confirm.
- **Relationships**: How does this entity relate to existing entities?
  (e.g., belongs to User? belongs to Organization? references Application?)
- **Ambiguity resolution**: Present the top ambiguities from docs. Ask the user to choose.

**Hard rule**: If documentation describes conflicting approaches for the same concept,
present both options and ask the user to choose. Do NOT assume either is correct.

After Round 1, update your internal model. **Drop** anything the user didn't confirm or
said "I don't know" about. Do not carry forward unresolved points.

### Round 2 — Behavior & Lifecycle

Based on Round 1 answers, ask about:
- **Status/state machine**: Does the entity have statuses? What are the valid transitions?
  If yes, a Value Object will be generated.
- **Business methods**: What operations can be performed? (e.g., activate, submit, expire)
  Are they idempotent?
- **Events**: What should be published when this entity changes?
  (e.g., `{Entity}CreatedEvent`, `{Entity}UpdatedEvent`, status change events)
- **Repository queries**: How will this entity be looked up?
  (by ID, by user, by status, by related entity, search?)

After Round 2, finalize the design. If all points are clear, skip Round 3.

### Round 3 — Final Ambiguity Resolution (only if needed)

Only run this round if Round 2 left unresolved questions. Ask about remaining gaps.

**After all rounds**: Any point that is STILL unclear gets removed from the design entirely.
The generated entity will only contain confirmed, understood properties and behavior.

---

## Phase 3: Design Confirmation

Present the complete design as a structured summary:

```
Entity: {EntityName}
Location: libs/domain/src/entities/{entity-name}.entity.ts

Properties:
  - id: string (readonly)
  - ... (list all confirmed properties with types)

Value Objects (new):
  - {EntityName}Status: [status1, status2, ...] → transitions: ...
  - ... (if any)

Business Methods:
  - methodName(): description
  - ...

Events:
  - {EntityName}CreatedEvent(props...)
  - ...

Repository Interface: I{EntityName}Repository
  - save, findById, ... (list methods)

Relationships:
  - belongs to {ExistingEntity} via {field}
  - ...

Files to create:
  1. libs/domain/src/entities/{name}.entity.ts
  2. libs/domain/src/value-objects/{context}/{name}.vo.ts (if any)
  3. libs/domain/src/events/{name}.event.ts (each event)
  4. libs/domain/src/repositories/{name}.repository.interface.ts
  5. libs/domain/src/entities/{name}.entity.spec.ts
  6. Update: libs/domain/src/index.ts
```

Ask the user with `AskUserQuestion`:
- Does this design look correct? What should change?

If the user requests changes, apply them and present again. If approved, proceed.

---

## Phase 4: Code Generation

Generate ALL files from scratch. This is a new feature — there is no existing code to modify
(except `index.ts` exports). Follow the **exact coding conventions** learned from other
domain entities in Phase 1.

### Entity file
- Public readonly for immutable fields (id, createdAt, foreign keys)
- Public mutable for changeable fields
- Business methods that validate before mutating
- Idempotent state transitions (check current state, return early if already there)
- `updatedAt` bumped on every mutation
- Throw plain `Error` for domain violations (not NestJS exceptions — those are infra)

### Value Object files (if entity has statuses or enums)
- `VALID_{PLURAL}` static readonly array with `as const`
- Static singleton instances (e.g., `static readonly ACTIVE = new Status('active')`)
- Private constructor with validation
- `static fromString(value: string)` factory with switch
- `toString()`, `equals(other)` methods
- For statuses: `isTerminal()`, `canTransitionTo()`, `validateTransitionTo()`
- Export companion type: `export type {Name}Value = (typeof Class.VALID_X)[number]`

### Event files
- Simple class with `public readonly` constructor parameters
- Named as `{Entity}{Action}Event` (e.g., `SubmissionCreatedEvent`)

### Repository interface file
- Interface with async methods returning Promises
- Symbol token: `export const I{Name}Repository = Symbol('I{Name}Repository')`
- Include filter interface if the entity needs filtered queries
- Standard methods: save, findById, delete
- Add domain-specific finders based on confirmed query patterns

### Unit tests
- Test entity construction
- Test each business method (happy path + edge cases)
- Test state transitions (valid + invalid)
- Test idempotent operations
- Test value object validation and factory methods

### Update index.ts
- Add exports grouped with a comment section header matching existing style

---

## Phase 5: Design Document & Next Steps

### Generate DESIGN.md

Create `specs/features/{FEATURE_NAME}/DESIGN.md` with the following structure.
This document is the **handoff artifact** — the next pipeline skills
(`/dna-api-contracts` and `/dna-backend-module`) will read it as their primary input.

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

**Relationships:**
- {field} → references {ExistingEntity}
- ...

### Value Objects
- **{StatusVO}**: [{values}] — transitions: {from} → {to}
- ...

### State Machine
(If applicable — draw the transitions)
- {state1} → {state2}: when {condition}
- ...

### Events
| Event | Trigger | Properties |
|-------|---------|------------|
| {Entity}CreatedEvent | entity created | id, ... |
| ... | ... | ... |

### Repository Interface: I{EntityName}Repository
- save({entity}): Promise<void>
- findById(id): Promise<{Entity} | null>
- ... (list all confirmed methods)

### Design Decisions
- "{Decision}": {reason / user chose X over Y because Z}
- ...
(List every decision made during the interview — what was confirmed,
what was dropped, what the user chose between conflicting options)

### Generated Files
1. `libs/domain/src/entities/{name}.entity.ts`
2. `libs/domain/src/value-objects/{context}/{name}.vo.ts`
3. `libs/domain/src/events/{event-name}.event.ts`
4. `libs/domain/src/repositories/{name}.repository.interface.ts`
5. `libs/domain/src/entities/{name}.entity.spec.ts`

### Suggested Next Steps
- CQRS commands/queries that will likely be needed (just names)
- BDD scenario ideas
- Backend module structure
- ORM entity and mapper notes
```

### Output to user

After generating all code and the design doc, output:
- Summary of created files
- Path to the design doc
- Remind the user: run `/dna-api-contracts {FEATURE_NAME}` next to create API contracts

---

## Rules

- NEVER use `any`. Use `unknown`, specific types, or `Record<string, unknown>`.
- NEVER import NestJS, TypeORM, or api-contracts in domain code.
- NEVER guess. If unsure about something after asking, drop it from the design.
- Documentation is reference material, NOT the source of truth. When docs conflict, ask the user.
- For coding conventions, follow patterns from existing domain entities (they are the reference implementation).
- Follow existing naming conventions exactly (see CLAUDE.md).
- Keep entities focused. If scope creeps, suggest splitting into multiple entities.
