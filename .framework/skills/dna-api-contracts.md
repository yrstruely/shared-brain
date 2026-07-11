---
description: Project-agnostic API contract generation. Creates DTOs, response types, and frontend API wiring. Uses RLM for convention discovery.
argument-hint: Provide feature name and project name
---

# API Contracts (Project-Agnostic)

> Creates API contract types (DTOs, response types) and frontend API layer for a feature. Pure TypeScript interfaces — no framework dependencies. Uses RLM for convention discovery.

---

## Phase 0: Load Project Context

**Goal:** Load project configuration and discover API contract conventions.

**Actions:**

1. **Load ProjectContext via RLM**

   ```typescript
   const context = await loadProjectContext(projectName);
   const { project, projectType } = context;
   ```

2. **Resolve paths**

   ```typescript
   const paths = {
     contracts: project.paths.contracts || `libs/api-contracts/src/`,
     frontend: project.paths.frontend,
     features: project.paths.features || `specs/features/`,
     domain: project.paths.domain
   };
   ```

3. **Validate prerequisites**

   Read `{paths.features}/{FEATURE_NAME}/DESIGN.md`.
   If missing Phase 1 (Domain Model): stop, tell user to run `/dna-domain-entity` first.

4. **Discover conventions via RLM**

   ```typescript
   const contractConventions = await rlm.explore({
     project: projectName,
     path: paths.contracts,
     query: "Extract DTO conventions, response type patterns, enum patterns, index.ts organization"
   });

   const frontendConventions = await rlm.explore({
     project: projectName,
     path: paths.frontend,
     query: "Extract frontend API layer conventions: plugin structure, composable patterns, apiFetch usage"
   });
   ```

---

## Phase 1: Extract from Design Doc

Extract from Phase 1 (Domain Model):
- Entity name, properties, types, mutability
- Value objects and valid values
- Events (to understand operations)
- Repository query patterns (for list/detail endpoints)
- Relationships (for nested DTOs)

---

## Phase 2: Q&A — API Surface

Ask user (up to 4 questions):

- **Endpoints:** What operations does frontend need?
  Suggest based on domain events/methods.
- **DTO variants:** Different views needed?
  (compact for lists, full for detail, extended with nested data)
- **Request shapes:** What data for create/update?
  Suggest based on mutable properties.
- **Filters/queries:** Filtering and pagination for list?
  Suggest based on repository query patterns.

After answers, finalize contract design.

---

## Phase 3: Design Confirmation

Present contract design:

```
DTOs:
  - {EntityName}Dto — full resource
  - {EntityName}CompactDto — list view (if needed)
  - Create{EntityName}Request
  - Update{EntityName}Request (if needed)
  - {EntityName}FiltersDto (if needed)

Response types:
  - Get{EntityName}Response = ResourceResponse<{EntityName}Dto>
  - Get{EntityName}ListResponse = ListResponse<{EntityName}CompactDto>
  - Create{EntityName}Response = CommandResult<{ id: string }>

Files:
  1. {paths.contracts}/dto/{entity-name}.dto.ts
  2. {paths.contracts}/responses/{entity-name}.responses.ts
  3. Update: {paths.contracts}/index.ts

Frontend wiring:
  4. Update: {paths.frontend}/plugins/api.ts
  5. Create: {paths.frontend}/composables/api/{entity-name}.api.ts
  6. Update: {paths.frontend}/composables/api/index.ts
```

Ask: Does this look correct?

---

## Phase 4: Code Generation

Generate ALL files following conventions discovered in Phase 0.

### DTO file (`{paths.contracts}/dto/{entity-name}.dto.ts`)

Structure:
1. Enum-like types — `const` arrays with `as const` + extracted union
2. Nested interfaces
3. Resource DTOs — full, compact variants
4. Request interfaces — create, update payloads
5. Query/filter DTOs

Conventions:
- Pure interfaces, no classes, no decorators
- Dates as ISO 8601 strings (`string`), never `Date`
- Optional fields use `?`
- Nullable fields use `| null`
- Never use `any`

### Response types (`{paths.contracts}/responses/{entity-name}.responses.ts`)

Use standard response wrappers:
- `ResourceResponse<T>` — single resource GET
- `ListResponse<T>` — paginated list GET
- `CommandResult<T>` — create/update/delete
- `CommandResult` (no generic) — void operations

Each response is a `type` alias with HTTP method/route comment.

### Frontend API Plugin

Add resource group to API plugin. Each method:
- Calls `apiFetch<ResponseType>(url, options)`
- GET: no method property
- POST/PUT/PATCH/DELETE: explicit method + body

### Frontend Composable

```typescript
export function use{EntityName}Api() {
  const { $api } = useNuxtApp(); // or framework equivalent
  return $api.{entityName};
}
```

---

## Phase 5: Update DESIGN.md

Append Phase 2 section:

```markdown
## Phase 2: API Contracts

Created by: /dna-api-contracts
Date: {YYYY-MM-DD}

### Endpoints
| Method | Route | Response Type | Description |
|--------|-------|---------------|-------------|
| POST | /api/v1/{entities} | Create{Entity}Response | Create |
| GET | /api/v1/{entities}/:id | Get{Entity}Response | Get by ID |
| ... | ... | ... | ... |

### DTOs
- **{EntityName}Dto**: {fields}
- ...

### Generated Files
1. `{paths.contracts}/dto/{name}.dto.ts`
2. `{paths.contracts}/responses/{name}.responses.ts`

### Frontend Wiring
- Updated: `{paths.frontend}/plugins/api.ts`
- Created: `{paths.frontend}/composables/api/{name}.api.ts`
```

---

## Rules

- NEVER use `any`. Use `unknown` or `Record<string, unknown>`.
- NEVER import framework code in contract files.
- NEVER use classes or decorators — pure interfaces only.
- NEVER use JavaScript `Date` — always ISO strings.
- Follow existing conventions exactly.

---

## Source

Original: `.framework/agents/playbooks/dna-tools/commands/dna-api-contracts.md`
