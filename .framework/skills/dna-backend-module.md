---
description: Project-agnostic backend module scaffolding. Creates application layer (handlers, controllers) and infrastructure layer (ORM, mappers, repositories). Uses RLM for convention discovery.
argument-hint: Provide feature name and project name
---

# Backend Module (Project-Agnostic)

> Creates the full backend module for a feature based on DESIGN.md Phases 1+2. Adapts to project architecture (CQRS, MVC, Hexagonal). Uses RLM for convention discovery.

---

## Phase 0: Load Project Context

**Goal:** Load project configuration, architecture, and existing module conventions.

**Actions:**

1. **Load ProjectContext via RLM**

   ```typescript
   const context = await loadProjectContext(projectName);
   const { project, projectType } = context;
   ```

2. **Resolve paths**

   ```typescript
   const paths = {
     backend: project.paths.backend,
     domain: project.paths.domain,
     features: project.paths.features || `specs/features/`,
     controllers: `${project.paths.backend}/controllers/` // or bffe/, api/, etc.
   };
   ```

3. **Load architecture config**

   ```typescript
   const architecture = project.techStack.backend.architecture;
   // 'cqrs', 'mvc', 'hexagonal'
   ```

4. **Discover conventions via RLM**

   ```typescript
   const moduleConventions = await rlm.explore({
     project: projectName,
     path: paths.backend,
     query: `Find a reference backend module. Extract conventions for: module file, command/query handlers, ORM entities, mappers, repositories, controllers, index files`
   });

   const registrationConventions = await rlm.explore({
     project: projectName,
     path: paths.backend,
     query: `How are new modules registered? Find app.module, controller registration, entity registration patterns`
   });
   ```

5. **Validate prerequisites**

   Read `{paths.features}/{FEATURE_NAME}/DESIGN.md`.
   If missing Phase 1 or Phase 2: stop, tell user which pipeline steps first.

---

## Phase 1: Extract from Design Doc

Extract from Phase 1 (Domain Model):
- Entity name, properties, types
- Value objects and valid values
- Events and properties
- Repository interface methods
- Relationships

Extract from Phase 2 (API Contracts):
- Endpoints (method, route, response type)
- DTOs and request types
- Filter/query DTOs

---

## Phase 2: Q&A — Implementation Decisions

Ask user (up to 4 questions):

- **Permissions:** What resource name and actions needed?
  Suggest based on existing permission constants.
- **Event side effects:** What happens when domain events publish?
  (notifications, role assignments, updates to related entities)
- **Transaction boundaries:** Which operations need atomicity?
- **Dependencies:** Does this module depend on other modules?

After answers, finalize plan.

---

## Phase 3: Design Confirmation

Present implementation plan:

```
Module: {EntityName}Module
Location: {paths.backend}/app/{entity-name}/

Commands:
  - Create{EntityName}Command → Create{EntityName}Handler
  - ...

Queries:
  - Get{EntityName}Query → Get{EntityName}Handler
  - ...

Event Handlers:
  - On{EntityName}Created → {side effects}
  - ...

Infrastructure:
  - {EntityName}OrmEntity
  - {EntityName}Mapper (domain ↔ ORM)
  - {EntityName}DtoMapper (domain → DTO)
  - {EntityName}Repository

Controller: {EntityName}Controller
  - Routes based on API contracts Phase 2

Files to create: {count}
Registration updates: app module, controller registry
```

Ask: Does this look correct?

---

## Phase 4: Code Generation

Generate ALL files following conventions from Phase 0.

### File generation order:

**1. ORM Entity** (`infrastructure/entities/{name}.orm-entity.ts`)
- Entity decorator with table name
- Primary key, columns, indexes
- Value object fields with getter/setter
- Date columns
- Foreign key relationships

**2. Infrastructure Mapper** (`infrastructure/mappers/{name}.mapper.ts`)
- `toDomain()` and `toPersistence()` static methods
- Value object conversion
- Date conversion

**3. DTO Mapper** (`mappers/{name}-dto.mapper.ts`)
- `toDto()` static method
- Date → ISO string
- Value object → string

**4. Repository Implementation** (`infrastructure/repositories/{name}.repository.ts`)
- Implements domain repository interface
- ORM repository injection
- CRUD methods with mapper usage
- Returns `null` for not-found

**5. Commands & Handlers**
- Simple command class with `public readonly` params
- Handler with repository injection
- Event publishing after persistence

**6. Queries & Handlers**
- Simple query class
- Handler with repository injection
- DTO mapping for responses

**7. Event Handlers** (if needed)
- Side effects only (permissions, logging)
- No business state mutations

**8. Module File** (`{name}.module.ts`)
- Imports, providers, exports
- Repository bindings

**9. Controller** (`{paths.controllers}/{name}.controller.ts`)
- Routes from API contracts
- CommandBus/QueryBus injection
- Validation pipes

**10. Registration**
- Import module in app module
- Register controller

---

## Phase 5: Update DESIGN.md

Append Phase 3 section:

```markdown
## Phase 3: Backend Implementation

Created by: /dna-backend-module
Date: {YYYY-MM-DD}

### Module: {EntityName}Module

**Commands:** | Command | Handler | Description |
**Queries:** | Query | Handler | Description |
**Event Handlers:** | Event | Handler | Side Effect |
**Infrastructure:** ORM Entity, Mapper, DTO Mapper, Repository
**Controller:** {EntityName}Controller

### Generated Files
1. `{paths.backend}/app/{name}/{name}.module.ts`
2. `{paths.backend}/app/{name}/commands/...`
3. ...

### Suggested Next Steps
- Create database migration
- Add unit tests
- Add integration tests
- Add BDD/E2E scenarios
```

---

## Architecture Adaptation

The skill adapts to the project's backend architecture:

| Architecture | Handler Pattern | Repository Pattern |
|-------------|----------------|-------------------|
| **CQRS** | CommandBus/QueryBus | Interface + implementation |
| **MVC** | Service layer | Repository or direct ORM |
| **Hexagonal** | Use case / port | Port + adapter |

---

## Rules

- NEVER use `any`.
- NEVER guess. If unsure, ask or drop it.
- Repository returns `null` for not-found, never throw.
- Handlers throw framework exceptions, not domain errors.
- Event handlers do NOT mutate business state — side effects only.
- Generate all index files with handler arrays.

---

## Source

Original: `.framework/agents/playbooks/dna-tools/commands/dna-backend-module.md`
