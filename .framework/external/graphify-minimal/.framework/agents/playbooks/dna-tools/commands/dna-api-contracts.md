---
name: dna-api-contracts
description: Creates API contract types (DTOs, response types) and frontend API layer (plugin methods, composable) for a feature based on DESIGN.md. Reads Phase 1, asks one Q&A round about API surface, generates contracts and frontend wiring.
allowed-tools: Read, Grep, Glob, Task, AskUserQuestion, Write, Edit
---

# API Contracts — Pipeline Step 2

You are creating API contracts (DTOs + response types) for the IP Hub backend.
This is step 2 of the feature development pipeline — step 1 (`/dna-new-domain-entity`)
must have been completed first.

**This library is framework-independent** — no NestJS, no TypeORM, no class-validator.
Pure TypeScript interfaces only.

Paths:
- Design doc: `specs/features/{FEATURE_NAME}/DESIGN.md`
- Contracts source: `libs/api-contracts/src/`
- Contracts exports: `libs/api-contracts/src/index.ts`
- Domain source: `libs/domain/src/` (read-only reference)
- Frontend plugin: `apps/ip-hub-frontend/app/plugins/api.ts`
- Frontend composables: `apps/ip-hub-frontend/app/composables/api/`

Output artifacts: DTO file, response types file, frontend API plugin + composable, updated DESIGN.md with Phase 2.

---

## Phase 0: Load Context

`$ARGUMENTS` is the **feature name** (kebab-case, e.g., `payment-processing`).
If not provided, use `AskUserQuestion` to ask for it.

Read `specs/features/{FEATURE_NAME}/DESIGN.md`.
If the file doesn't exist, stop and tell the user to run `/dna-new-domain-entity` first.

Extract from Phase 1:
- Entity name, properties, types, mutability
- Value objects and their valid values
- Events (to understand what operations exist)
- Repository query patterns (to understand what list/detail endpoints are needed)
- Relationships (to understand nested DTOs)
- Design decisions (to respect choices already made)

---

## Phase 1: Learn Conventions

Launch **three subagents in parallel** (`subagent_type: Explore`):

**Subagent A — API contracts conventions:**
> We are creating NEW API contracts for a feature. There is NO existing code for this feature yet.
>
> Read all files in `libs/api-contracts/src/` (dto/, responses/, api-response.types.ts, index.ts).
>
> Extract coding conventions:
> 1. How DTOs are defined (pure interfaces, no classes, no decorators)
> 2. How enum-like types work (`const X = [...] as const` + type extraction)
> 3. How response types are defined (ResourceResponse, ListResponse, CommandResult patterns)
> 4. How request/create interfaces are structured
> 5. How query parameter DTOs work
> 6. How index.ts organizes exports (DTOs section, responses section)
> 7. Date format convention (ISO strings, not Date objects)
> 8. Optional field convention (`?` not `| undefined`)

**Subagent B — Documentation scan for API details:**
> Read all markdown files in `documentation/technical-project-context/`.
> Extract ONLY information relevant to API endpoints, routes, request/response shapes
> for: "{entity name from DESIGN.md}".
>
> Return:
> 1. Endpoint paths mentioned (REST routes)
> 2. Request payload shapes
> 3. Response shapes (list view vs detail view differences)
> 4. Query parameter / filter patterns
> 5. Any pagination requirements
>
> If nothing relevant, return "No API-specific documentation found."

**Subagent C — Frontend API layer conventions:**
> We are adding a NEW API resource to the Nuxt frontend. There is NO existing code for this feature yet.
>
> Read these files:
> - `apps/ip-hub-frontend/app/plugins/api.ts`
> - `apps/ip-hub-frontend/app/composables/api/index.ts`
> - Two existing API composable files in `apps/ip-hub-frontend/app/composables/api/` (pick any two)
>
> Extract conventions:
> 1. How a new resource group is added to the `$api` object in `api.ts`
>    (method naming, return types, URL patterns, how apiFetch is called)
> 2. How composable files are structured (`use{Entity}Api()` pattern)
> 3. How composables are exported from `index.ts`
> 4. How response types from `@ip-hub-backend/api-contracts` are imported and used

Wait for all three. Subagent A and C are mandatory. Subagent B is supplementary.

---

## Phase 2: Q&A — API Surface (1 Round)

Based on the domain entity properties and documentation findings, use `AskUserQuestion`
to ask about the API surface. Up to 4 questions:

- **Endpoints**: What operations does the frontend need?
  Suggest based on domain events/methods (e.g., create, get by ID, list with filters, update status).
  Ask the user to confirm or adjust.
- **DTO variants**: Does the frontend need different views?
  (e.g., compact DTO for lists, full DTO for detail, extended DTO with nested data)
  Suggest based on domain entity properties — not all properties need to be in every DTO.
- **Request shapes**: What data does the frontend send for create/update operations?
  Suggest based on mutable entity properties. Ask which fields are required vs optional.
- **Filters/queries**: What filtering and pagination does the list endpoint need?
  Suggest based on repository query patterns from DESIGN.md Phase 1.

After answers, drop anything unconfirmed. Finalize the contract design.

---

## Phase 3: Design Confirmation

Present the contract design:

```
DTOs:
  - {EntityName}Dto — full resource ({list properties})
  - {EntityName}CompactDto — list view ({list properties}) (if needed)
  - Create{EntityName}Request — {list properties}
  - Update{EntityName}Request — {list properties} (if needed)
  - {EntityName}FiltersDto — {list filters} (if needed)

Response types:
  - Get{EntityName}Response = ResourceResponse<{EntityName}Dto>
  - Get{EntityName}ListResponse = ListResponse<{EntityName}CompactDto>
  - Create{EntityName}Response = CommandResult<{ id: string }>
  - ...

Enum types:
  - {EntityName}Status = '{value1}' | '{value2}' | ...
  - ...

Files:
  1. libs/api-contracts/src/dto/{entity-name}.dto.ts
  2. libs/api-contracts/src/responses/{entity-name}.responses.ts
  3. Update: libs/api-contracts/src/index.ts

Frontend wiring:
  4. Update: apps/ip-hub-frontend/app/plugins/api.ts (add resource group)
  5. Create: apps/ip-hub-frontend/app/composables/api/{entity-name}.api.ts
  6. Update: apps/ip-hub-frontend/app/composables/api/index.ts
```

Ask with `AskUserQuestion`: Does this look correct?

---

## Phase 4: Code Generation

Generate ALL files from scratch following exact conventions from Phase 1.

### DTO file (`libs/api-contracts/src/dto/{entity-name}.dto.ts`)

Structure in this order:
1. **Enum-like types** — `const` arrays with `as const` + extracted union types
2. **Nested interfaces** — for complex sub-structures
3. **Resource DTOs** — full representation, compact variants
4. **Request interfaces** — create, update payloads
5. **Query/filter DTOs** — for query parameters

Conventions:
- Pure interfaces, no classes, no decorators
- Dates as ISO 8601 strings (`string`), never `Date`
- Optional fields use `?`
- Nullable fields use `| null`
- Use `Record<string, unknown>` for metadata/dynamic fields
- Never use `any`
- DTO field names may differ from domain entity names (e.g., entity `id` → DTO `entityId`)

### Response types file (`libs/api-contracts/src/responses/{entity-name}.responses.ts`)

Import from `../api-response.types` and `../dto/{entity-name}.dto`.

Use the standard response wrappers:
- `ResourceResponse<T>` — single resource GET
- `ListResponse<T>` — paginated list GET
- `CommandResult<T>` — create/update/delete POST
- `CommandResult` (no generic) — void operations
- Raw array or custom type — when consumer needs a specific shape

Each response is a `type` alias, not an `interface`.
Add a comment above each type showing the HTTP method and route.

### Update index.ts

Add DTO and response exports. Follow existing grouping style.

### Frontend: Update API plugin (`apps/ip-hub-frontend/app/plugins/api.ts`)

Add a new resource group to the `$api` object. Follow the exact pattern of existing groups
(e.g., `dashboard`, `alerts`, `applications`).

Each method:
- Calls `apiFetch<ResponseType>(url, options)` with the correct response type from api-contracts
- Uses string template for URLs with IDs: `` `/entities/${id}` ``
- GET requests: no `method` property needed (default)
- POST requests: `method: 'POST'` + `body: data`
- PUT/PATCH requests: `method: 'PUT'`/`'PATCH'` + `body: data`
- DELETE requests: `method: 'DELETE'`

Also add the new group to the `$api` type declaration returned by `provide`.

### Frontend: Create composable (`apps/ip-hub-frontend/app/composables/api/{entity-name}.api.ts`)

```typescript
export function use{EntityName}Api() {
  const { $api } = useNuxtApp();
  return $api.{entityName};
}
```

Follow exact pattern from existing composables. This is a thin wrapper.

### Frontend: Update composables index (`apps/ip-hub-frontend/app/composables/api/index.ts`)

Add the export for the new composable. Follow existing style.

---

## Phase 5: Update DESIGN.md

Append Phase 2 section to `specs/features/{FEATURE_NAME}/DESIGN.md`:

```markdown

---

## Phase 2: API Contracts

Created by: /dna-api-contracts
Date: {YYYY-MM-DD}

### Endpoints
| Method | Route | Response Type | Description |
|--------|-------|---------------|-------------|
| POST | /api/v1/{entities} | Create{Entity}Response | Create new entity |
| GET | /api/v1/{entities}/:id | Get{Entity}Response | Get by ID |
| GET | /api/v1/{entities} | Get{Entity}ListResponse | List with filters |
| ... | ... | ... | ... |

### DTOs
- **{EntityName}Dto**: {list fields}
- **Create{EntityName}Request**: {list fields}
- ...

### Design Decisions
- "{Decision}": {reason}
- ...

### Generated Files
1. `libs/api-contracts/src/dto/{entity-name}.dto.ts`
2. `libs/api-contracts/src/responses/{entity-name}.responses.ts`

### Frontend Wiring
- Updated: `apps/ip-hub-frontend/app/plugins/api.ts` — added `$api.{entityName}` resource group
- Created: `apps/ip-hub-frontend/app/composables/api/{entity-name}.api.ts` — `use{EntityName}Api()` composable
- Updated: `apps/ip-hub-frontend/app/composables/api/index.ts` — added export
```

### Output to user

After generating all code and updating the design doc:
- Summary of created files
- Remind the user: run `/dna-backend-module {FEATURE_NAME}` next

---

## Rules

- NEVER use `any`. Use `unknown`, specific types, or `Record<string, unknown>`.
- NEVER import NestJS, TypeORM, or domain library in api-contracts code.
- NEVER use classes or decorators — pure interfaces only.
- NEVER use JavaScript `Date` — always ISO 8601 strings.
- NEVER guess. If unsure after asking, drop it.
- All comments in English.
- Follow existing conventions from `libs/api-contracts/src/` exactly.
