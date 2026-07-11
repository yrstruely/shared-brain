---
name: dna-backend-module
description: Creates the full NestJS backend module (CQRS commands/queries, ORM entities, mappers, repository implementations, controller, Casbin permissions) based on DESIGN.md Phases 1+2.
allowed-tools: Read, Grep, Glob, Task, AskUserQuestion, Write, Edit, Bash
---

# Backend Module — Pipeline Step 3

You are creating the full NestJS backend module for the IP Hub backend.
This is step 3 of the feature development pipeline — steps 1 (`/dna-new-domain-entity`)
and 2 (`/dna-api-contracts`) must have been completed first.

Paths:
- Design doc: `specs/features/{FEATURE_NAME}/DESIGN.md`
- Backend modules: `apps/ip-hub-backend/src/app/`
- BFFE controllers: `apps/ip-hub-backend/src/bffe/controllers/`
- Common (guards, decorators, casbin): `apps/ip-hub-backend/src/common/`
- Domain source: `libs/domain/src/` (read-only reference)
- Contracts source: `libs/api-contracts/src/` (read-only reference)

Output artifacts: NestJS module with full CQRS stack, updated DESIGN.md with Phase 3.

---

## Phase 0: Load Context

`$ARGUMENTS` is the **feature name** (kebab-case, e.g., `payment-processing`).
If not provided, use `AskUserQuestion` to ask for it.

Read `specs/features/{FEATURE_NAME}/DESIGN.md`.
If the file doesn't exist or is missing Phase 1/Phase 2, stop and tell the user
which pipeline steps to run first.

Extract from Phase 1 (Domain Model):
- Entity name, properties, types
- Value objects and their valid values
- Events and their properties
- Repository interface methods
- Relationships to other entities

Extract from Phase 2 (API Contracts):
- Endpoints (method, route, response type)
- DTOs and request types
- Filter/query DTOs

---

## Phase 1: Learn Conventions

Launch **two subagents in parallel** (`subagent_type: Explore`):

**Subagent A — Backend module conventions:**
> We are creating a NEW NestJS backend module. There is NO existing code for this feature yet.
>
> Read the `organization` module as reference implementation:
> - `apps/ip-hub-backend/src/app/organization/` (all files)
> - `apps/ip-hub-backend/src/bffe/controllers/organization.controller.ts`
> - `apps/ip-hub-backend/src/common/casbin/casbin.constants.ts`
> - `apps/ip-hub-backend/src/common/decorators/require-permission.decorator.ts`
> - `apps/ip-hub-backend/src/common/guards/casbin.guard.ts`
>
> Extract conventions for each file type:
> 1. Module file — imports, providers, exports pattern
> 2. Command class + handler — constructor, execute(), return type, event publishing
> 3. Query class + handler — constructor, execute(), DTO mapping
> 4. Event handler — @EventsHandler, Casbin role assignment pattern
> 5. ORM entity — decorators, column types, value object getters/setters, indexes
> 6. Infrastructure mapper — static toDomain() and toPersistence() methods
> 7. DTO mapper — static toDto() method, date→ISO string, value object→string
> 8. Repository implementation — @Injectable, @InjectRepository, mapper usage
> 9. Controller — @Controller, CommandBus/QueryBus, @RequirePermission, @CurrentUserId
> 10. Index files — how commands/, queries/, events/, infrastructure/ export handler arrays

**Subagent B — Existing module registration:**
> Read these files to understand how modules are registered:
> - `apps/ip-hub-backend/src/app.module.ts`
> - `apps/ip-hub-backend/src/bffe/bffe.module.ts`
> - `apps/ip-hub-backend/src/config/database/typeorm.config.ts` (or similar entity registration)
>
> Extract:
> 1. How new modules are imported in app.module.ts
> 2. How new controllers are registered in bffe.module.ts
> 3. How ORM entities are registered (if centralized)
> 4. Any other registration points for new modules

Wait for both.

---

## Phase 2: Q&A — Implementation Decisions (1 Round)

Use `AskUserQuestion` with up to 4 questions:

- **Casbin permissions**: What resource name and actions does this entity need?
  Suggest based on existing CasbinResource constants. Ask if a new resource constant is needed
  and what actions (read, write, admin) apply to which endpoints.
- **Event side effects**: What should happen when domain events are published?
  (e.g., assign Casbin roles, send notifications, update related entities)
  Suggest based on events from DESIGN.md Phase 1.
- **Transaction boundaries**: Which operations need atomicity?
  (e.g., creating entity + related records in one transaction)
  Suggest based on relationships and events from Phase 1.
- **Dependencies**: Does this module depend on other modules?
  (e.g., UserModule for user lookups, OrganizationModule for org context)
  Suggest based on relationships from Phase 1.

After answers, finalize implementation plan.

---

## Phase 3: Design Confirmation

Present the implementation plan:

```
Module: {EntityName}Module
Location: apps/ip-hub-backend/src/app/{entity-name}/

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
  - {EntityName}OrmEntity → table: {table_name}
  - {EntityName}Mapper (domain ↔ ORM)
  - {EntityName}DtoMapper (domain → DTO)
  - {EntityName}Repository implements I{EntityName}Repository

Controller: {EntityName}Controller
  - POST /{entities} → Create{EntityName}Command
  - GET /{entities}/:id → Get{EntityName}Query
  - ...

Casbin: CasbinResource.{ENTITY_NAME} with actions: read, write
  - Event handler assigns roles on creation

Module dependencies: [UserModule, ...]

Files to create: {count} files
Registration updates: app.module.ts, bffe.module.ts, casbin.constants.ts
```

Ask with `AskUserQuestion`: Does this look correct?

---

## Phase 4: Code Generation

Generate ALL files from scratch following exact conventions from the reference module.

### File generation order (dependencies flow top-down):

#### 1. ORM Entity (`infrastructure/entities/{entity-name}.orm-entity.ts`)
- `@Entity('table_name')` with snake_case table name
- `@PrimaryColumn('uuid')` for ID
- `@Column({ name: 'snake_case', type: '...' })` for each field
- `@Index()` on frequently queried columns (foreign keys, status)
- `@CreateDateColumn({ name: 'created_at' })` and `@UpdateDateColumn({ name: 'updated_at' })`
- Value object fields: private backing field `_status` + getter/setter using `fromString()`/`toString()`
- `@ManyToOne` with `onDelete: 'CASCADE'` for foreign key relationships
- JSONB columns for complex nested structures

#### 2. Infrastructure Mapper (`infrastructure/mappers/{entity-name}.mapper.ts`)
- Static class with `toDomain(entity: OrmEntity): DomainEntity` and `toPersistence(domain: DomainEntity): OrmEntity`
- Convert value objects via `fromString()` / `toString()`
- Convert dates between Date objects and ISO strings
- Create new ORM entity instance, assign all fields

#### 3. DTO Mapper (`mappers/{entity-name}-dto.mapper.ts`)
- Static class with `toDto(domain: DomainEntity): Dto`
- Convert Date → ISO string via `.toISOString()`
- Convert value objects → string via `.toString()` with `as` cast to contract type
- Handle nullable fields
- May rename fields (entity `id` → DTO `entityId`)

#### 4. Repository Implementation (`infrastructure/repositories/{entity-name}.repository.ts`)
- `@Injectable()` class implementing domain interface
- `@InjectRepository(OrmEntity)` for TypeORM repository
- Each method: query ORM → map to domain via mapper
- `save()`: domain → mapper.toPersistence() → repository.save()
- `findById()`: repository.findOne() → mapper.toDomain() or null
- List methods: repository.find() → map each via mapper.toDomain()
- Complex queries: use `createQueryBuilder()` for WHERE + AND clauses
- Return `null` for not-found (never throw from repository)

#### 5. Command Classes (`commands/{command-name}/{command-name}.command.ts`)
- Simple class with `public readonly` constructor parameters
- Parameters are primitive types (string, number) — no domain objects

#### 6. Command Handlers (`commands/{command-name}/{command-name}.handler.ts`)
- `@CommandHandler(CommandClass)` decorator
- Implements `ICommandHandler<CommandClass>`
- Inject repositories via `@Inject(IInterfaceToken)`
- Inject `EventBus` for domain event publishing
- Generate UUID via `randomUUID()` from `crypto`
- Create domain entity, persist via repository, publish events
- Return `CommandResult<T>` with `id`, `success`, and optional `data`
- Throw NestJS exceptions: `NotFoundException`, `ForbiddenException`, `ConflictException`, `BadRequestException`
- Use `DataSource.transaction()` for multi-step operations

#### 7. Query Classes (`queries/{query-name}/{query-name}.query.ts`)
- Simple class with `public readonly` constructor parameters

#### 8. Query Handlers (`queries/{query-name}/{query-name}.handler.ts`)
- `@QueryHandler(QueryClass)` decorator
- Implements `IQueryHandler<QueryClass>`
- Inject repositories only (no EventBus)
- Use DTO mapper to convert domain → response type
- Return API contract response type

#### 9. Event Handlers (`events/on-{event-name}.handler.ts`)
- `@EventsHandler(EventClass)` decorator
- Implements `IEventHandler<EventClass>`
- Side effects only: Casbin policies, logging, notifications
- Use `Logger` for structured logging
- Do NOT perform business-logic state mutations

#### 10. Index Files
- `commands/index.ts` — export command classes + `commandHandlers` array
- `queries/index.ts` — export query classes + `queryHandlers` array
- `events/index.ts` — export event handlers + `eventHandlers` array
- `infrastructure/index.ts` — export ORM entities, mappers, repositories

#### 11. Module File (`{entity-name}.module.ts`)
- Import `CqrsModule`, `TypeOrmModule.forFeature([OrmEntities])`, dependent modules
- Providers: spread `commandHandlers`, `queryHandlers`, `eventHandlers` + repository bindings
- Repository bindings: `{ provide: IRepository, useClass: Repository }`
- Exports: `CqrsModule`, repository interfaces

#### 12. Controller (`../../bffe/controllers/{entity-name}.controller.ts`)
- `@Controller('{entities}')` with plural lowercase route
- `@UseGuards(CasbinGuard)` at class level
- Inject `CommandBus` and `QueryBus`
- Each endpoint: extract params → create command/query → execute via bus → return result
- `@RequirePermission(CasbinResource.X, CasbinAction.Y)` on protected routes
- `@CurrentUserId()` for authenticated user context
- `@Param('id', ParseUUIDPipe)` for UUID validation
- `@HttpCode(HttpStatus.CREATED)` for POST endpoints

#### 13. Casbin Constants Update
- Add new resource to `CasbinResource` in `casbin.constants.ts`

#### 14. Module Registration
- Import new module in `app.module.ts`
- Register new controller in `bffe.module.ts`

---

## Phase 5: Update DESIGN.md

Append Phase 3 section to `specs/features/{FEATURE_NAME}/DESIGN.md`:

```markdown

---

## Phase 3: Backend Implementation

Created by: /dna-backend-module
Date: {YYYY-MM-DD}

### Module: {EntityName}Module

**Commands:**
| Command | Handler | Description |
|---------|---------|-------------|
| Create{EntityName}Command | Create{EntityName}Handler | Creates entity, publishes event |
| ... | ... | ... |

**Queries:**
| Query | Handler | Description |
|-------|---------|-------------|
| Get{EntityName}Query | Get{EntityName}Handler | Returns single entity |
| ... | ... | ... |

**Event Handlers:**
| Event | Handler | Side Effect |
|-------|---------|-------------|
| {Entity}CreatedEvent | On{Entity}CreatedHandler | Assigns Casbin roles |
| ... | ... | ... |

**Infrastructure:**
- ORM Entity: `{entity_name}` table
- Mapper: {EntityName}Mapper
- DTO Mapper: {EntityName}DtoMapper
- Repository: {EntityName}Repository → I{EntityName}Repository

**Controller:** {EntityName}Controller (`/api/{entities}`)
- Casbin resource: `{entity_name}`

### Design Decisions
- "{Decision}": {reason}
- ...

### Generated Files
1. `apps/ip-hub-backend/src/app/{name}/{name}.module.ts`
2. `apps/ip-hub-backend/src/app/{name}/commands/...`
3. `apps/ip-hub-backend/src/app/{name}/queries/...`
4. `apps/ip-hub-backend/src/app/{name}/events/...`
5. `apps/ip-hub-backend/src/app/{name}/infrastructure/...`
6. `apps/ip-hub-backend/src/app/{name}/mappers/...`
7. `apps/ip-hub-backend/src/bffe/controllers/{name}.controller.ts`
8. Updated: `app.module.ts`, `bffe.module.ts`, `casbin.constants.ts`

### Suggested Next Steps
- Create database migration: `pnpm nx migration:generate ip-hub-backend --args="{EntityName}"`
- Add unit tests for handlers
- Add integration tests
- Add BDD/E2E scenarios
- Add Pact contract tests (if frontend consumer exists)
```

### Output to user

After generating all code and updating the design doc:
- Summary of all created files
- Path to the complete design doc
- Remind: run migration, then tests

---

## Rules

- NEVER use `any`. Use `unknown`, specific types, or `Record<string, unknown>`.
- NEVER guess. If unsure after asking, drop it.
- All comments in English.
- Follow conventions from the `organization` module exactly — it is the reference implementation.
- Repository implementations return `null` for not-found, never throw.
- Command handlers throw NestJS exceptions, not domain errors.
- Event handlers do NOT mutate business state — side effects only.
- Generate all index files with handler arrays for module registration.
- Always use `randomUUID()` from `crypto` for ID generation.
- Publish events AFTER successful persistence (or after transaction commit).
