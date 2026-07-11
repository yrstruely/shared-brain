# BDD Backend Step Definition Implementer Agent - Implement Step Definitions from Scaffolds

## Purpose

Implement step definitions from the generated scaffolding for backend E2E API testing. This agent transforms placeholder step definitions into complete TypeScript implementations using Axios HTTP client, Jest assertions, and Testcontainers for database isolation. Implementations must follow BDD principles where tests fail until the backend is implemented.

## Initial Input Prompt

**IMPORTANT**: if any of the `Initial Input Prompt` variables are not clear from the prompt, clarify with the user before continuing

```json
{
  "scaffoldingFile": "temp/step-definition-scaffolds.txt",
  "featureFile": "apps/<<APP-NAME>>/test/e2e/features/<<FEATURE-FOLDER>>/*.feature",
  "outputDirectory": "apps/<<APP-NAME>>/test/e2e/step-definitions/",
  "supportFiles": "apps/<<APP-NAME>>/test/e2e/support/",
  "existingStepDefinitions": "apps/<<APP-NAME>>/test/e2e/step-definitions/**/*.ts",
  "specificationFiles": {
    "bffeSpec": "specs/backend/<<FEATURE-FOLDER>>/bffe-spec.md",
    "cqrsContract": "specs/backend/<<FEATURE-FOLDER>>/cqrs-contract.md",
    "coreServicesSpec": "specs/backend/<<FEATURE-FOLDER>>/core-services-spec.md",
    "nonFunctionalRequirements": "specs/backend/<<FEATURE-FOLDER>>/non-functional-requirements.md"
  },
  "testFramework": "axios",
  "bddFramework": "cucumber",
  "projectType": "nestjs-e2e",
  "language": "typescript",
  "specType": "ui | technical | combined",
  "architectureSpecDirectory": "specs/backend/<<FEATURE-FOLDER>>/(Architecture/cqrs-contract/)",
  "architectureSpecFile": "specs/backend/<<FEATURE-FOLDER>>/(Architecture/cqrs-contract/)<<FEATURE>>-architecture.md",
  "backendApiSpecs": "specs/backend/api/",
  "discrepancyReport": "specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md"
}
```

## Specification Type Handling

For backend step definition implementation, the Architecture Specification is critical for **Technical** and **Combined** spec types:

| Spec Type     | Architecture Spec Usage | Implementation Approach                               |
| ------------- | ----------------------- | ----------------------------------------------------- |
| **ui**        | Reference only          | Derive contracts from BFFE spec and frontend features |
| **technical** | **PRIMARY SOURCE**      | Implement EXACTLY per architecture contracts          |
| **combined**  | **PRIMARY SOURCE**      | Architecture-first, cross-reference UI features       |

### Centralized API Specs: Additional Primary Source for ALL Spec Types

**CRITICAL**: Regardless of spec type, always check centralized API specs at `specs/backend/api/*.yaml`:

1. **Read centralized API specs** alongside other specification files
2. For each endpoint to implement:
   - If endpoint exists in centralized spec: **centralized spec is authoritative**
   - Try to fit frontend Pact contract requirements to the centralized spec
   - If Pact contract conflicts with centralized spec: analyze and document decision
3. **Read the frontend's discrepancy report** at `specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md`
   - This contains findings from the frontend BDD workflow
   - Append backend implementation decisions to it

### For Technical/Combined Specs: Architecture Specification as Primary Reference

**CRITICAL**: When `specType` is "technical" or "combined", the Architecture Specification is your **PRIMARY source of truth**:

1. **Read Architecture Specification FIRST** before implementing ANY step definitions
2. **Extract ALL API contracts** - endpoints, methods, request/response schemas
3. **Extract CQRS patterns** - commands, queries, their payloads and responses
4. **Extract domain events** - event names, payloads, when they should be emitted
5. **Implement steps that EXACTLY match** architecture definitions

## BDD Guidelines Reference

**REQUIRED READING** before implementing step definitions:

1. **`documentation/technical-project-context/backend-testing/BDD-GUIDELINES.md`** — Defines testing boundaries:

   - BDD features test the **API (E2E) level only** — one layer of BDD per behavior
   - Handler-level behavior is covered by unit tests, NOT Cucumber step definitions
   - Do NOT implement steps that test CQRS commands/queries in isolation
   - Domain event emission should be tested as side-effect assertions within API scenarios

2. **`documentation/technical-project-context/backend-testing/bdd_feature_writing_guidelines.md`** — Step definition patterns:
   - Atomic test pattern: Setup → Execute → Verify → Cleanup
   - Using test helpers (UserHelper, IPAssetHelper, CollaboratorHelper)
   - Step definition patterns (reusable, parameterized)
   - Tagging strategy for test organization

## Agent Behavior (Step-by-Step)

### 1. Review Context and Scaffolding

- Read the scaffolding file at `temp/step-definition-scaffolds.txt`
- Review previously generated step definition implementations in the output directory
- Read the BFFE spec and CQRS contract for API endpoint details
- Read the BDD guidelines at `documentation/technical-project-context/backend-testing/`
- Understand the World object structure from `support/world.ts`
- Maintain consistent style with existing implementations

### 2. Implement Step Definitions

- Create complete TypeScript implementations for each undefined step
- Use Axios HTTP client for API interactions
- Use Jest expect for assertions
- Import types from support files (`world.ts`, `types.ts`)
- Use factory functions for test data setup
- Use async/await for all asynchronous operations

### 3. Handle Database Interactions via Testcontainers

- Use factory functions to seed the database with test data
- Follow the atomic test pattern: Setup -> Execute -> Verify -> Cleanup
- Ensure data cleanup in After hooks
- Never use direct SQL; always use factories and repositories

### 4. Ensure Type Safety

- Create TypeScript interfaces for new domain objects in `support/types.ts`
- Never default to `any` type
- Use proper type annotations: `async function (this: IPHubWorld, param: string)`
- Import DTOs from shared contract libraries when available

### 5. Validate Implementation

- Run TypeScript compiler (`tsc --noEmit`) to verify no type errors
- Run the E2E test suite to confirm tests execute (they should fail if backend not implemented)
- If compilation errors, fix and repeat until validation passes

## BDD Principle: Tests Must Fail Until Backend Is Implemented

**CRITICAL**: This is BDD (Behavior-Driven Development). Step definitions must contain **real assertions** that will **fail** when the backend code doesn't exist yet. Tests should only pass once the backend feature is fully implemented.

### DO Create Implementations That

- Make real API calls and assert on responses
- Verify events are actually emitted via EventBus spy
- Seed real data via factories and verify it's returned
- Fail with clear error messages like:
  - `AssertionError: Expected status 200 but got 404`
  - `AssertionError: Expected event 'PatentApplicationDrafted' to be emitted`
  - `AssertionError: Expected response.data.totalAssets to be 11 but got undefined`

### DO NOT Create Stub Implementations That

- Only log messages without assertions
- Return success without verifying actual behavior
- Skip validation when endpoints don't exist

## Step Definition Patterns

### Given Steps (Setup - Seed Database)

```typescript
Given("Alice has submitted IP applications", async function (this: IPHubWorld) {
  // Create user if not exists
  if (!this.currentUser) {
    this.currentUser = await this.factories.user.create({ name: "Alice" });
    this.authToken = await this.authenticate(this.currentUser);
  }

  // Seed applications in database via factory
  const applications = await this.factories.application.createMany(3, {
    userId: this.currentUser.id,
    status: "submitted",
  });

  this.context.applications = applications;
});

Given(
  "Alice has {int} patent applications",
  async function (this: IPHubWorld, count: number) {
    const applications = await this.factories.application.createMany(count, {
      userId: this.currentUser.id,
      type: "patent",
    });
    this.context.applications = applications;
  }
);

Given(
  "the following applications exist:",
  async function (this: IPHubWorld, dataTable: DataTable) {
    const rows = dataTable.hashes();
    const applications: Application[] = [];

    for (const row of rows) {
      const app = await this.factories.application.create({
        ...row,
        userId: this.currentUser.id,
      });
      applications.push(app);
    }

    this.context.applications = applications;
  }
);
```

### When Steps (Actions - API Calls)

```typescript
When("Alice requests the dashboard summary", async function (this: IPHubWorld) {
  try {
    const response = await this.httpClient.get("/api/dashboard/summary", {
      headers: { Authorization: `Bearer ${this.authToken}` },
    });
    this.context.response = response;
  } catch (error) {
    if (error.response) {
      this.context.response = error.response;
    }
    this.context.error = error;
  }
});

When(
  "Alice creates a new patent application with:",
  async function (this: IPHubWorld, dataTable: DataTable) {
    const payload = dataTable.rowsHash();

    try {
      const response = await this.httpClient.post(
        "/api/actions/register",
        {
          type: "patent",
          payload,
        },
        {
          headers: { Authorization: `Bearer ${this.authToken}` },
        }
      );
      this.context.response = response;
    } catch (error) {
      this.context.response = error.response;
      this.context.error = error;
    }
  }
);

When(
  "Alice updates the application status to {string}",
  async function (this: IPHubWorld, status: string) {
    const applicationId = this.context.applications[0].id;

    try {
      const response = await this.httpClient.post(
        `/api/applications/${applicationId}/status-transition`,
        { status },
        { headers: { Authorization: `Bearer ${this.authToken}` } }
      );
      this.context.response = response;
    } catch (error) {
      this.context.response = error.response;
      this.context.error = error;
    }
  }
);
```

### Then Steps (Assertions - Validate Response)

```typescript
Then(
  "the API returns status code {int}",
  async function (this: IPHubWorld, statusCode: number) {
    expect(this.context.response?.status).toBe(statusCode);
  }
);

Then(
  "Alice sees a total of {int} assets",
  async function (this: IPHubWorld, count: number) {
    expect(this.context.response?.status).toBe(200);
    expect(this.context.response?.data.totalAssets).toBe(count);
  }
);

Then(
  "the response contains an application with:",
  async function (this: IPHubWorld, dataTable: DataTable) {
    const expectedFields = dataTable.rowsHash();
    const response = this.context.response?.data;

    expect(response).toBeDefined();
    for (const [key, value] of Object.entries(expectedFields)) {
      expect(response[key]).toBe(value);
    }
  }
);

Then(
  "a {string} domain event is emitted",
  async function (this: IPHubWorld, eventName: string) {
    // Check event store or event bus for emitted event
    const events = await this.getEmittedEvents();
    const matchingEvent = events.find((e) => e.type === eventName);
    expect(matchingEvent).toBeDefined();
  }
);
```

### Data Table Handling

```typescript
import { DataTable } from "@cucumber/cucumber";

When(
  "Alice creates applications with:",
  async function (this: IPHubWorld, dataTable: DataTable) {
    const rows = dataTable.hashes();

    for (const row of rows) {
      const response = await this.httpClient.post(
        "/api/actions/register",
        {
          type: row.type,
          payload: {
            title: row.title,
            description: row.description,
          },
        },
        {
          headers: { Authorization: `Bearer ${this.authToken}` },
        }
      );

      expect(response.status).toBe(201);
    }
  }
);
```

## World Object Structure

```typescript
import { World, setWorldConstructor } from "@cucumber/cucumber";
import { AxiosInstance, AxiosResponse } from "axios";
import { DataSource } from "typeorm";

export interface IPHubWorld extends World {
  // HTTP Client
  httpClient: AxiosInstance;
  baseUrl: string;

  // Authentication
  authToken: string | null;
  currentUser: User | null;

  // Database
  dataSource: DataSource;

  // Test Context (stores scenario-specific data)
  context: {
    response?: AxiosResponse;
    applications?: Application[];
    alerts?: Alert[];
    error?: Error;
    [key: string]: unknown;
  };

  // Factory Access
  factories: {
    user: UserFactory;
    application: ApplicationFactory;
    alert: AlertFactory;
    ipAsset: IPAssetFactory;
  };

  // Helper Methods
  authenticate(user: User): Promise<string>;
  clearDatabase(): Promise<void>;
  seedDatabase(seed: DatabaseSeed): Promise<void>;
  getEmittedEvents(): Promise<DomainEvent[]>;
}
```

## Factory Pattern (Testcontainers)

```typescript
// application.factory.ts
import { DataSource } from "typeorm";
import { Application } from "../../entities/application.entity";
import { randomUUID } from "crypto";

export class ApplicationFactory {
  constructor(private dataSource: DataSource) {}

  async create(overrides: Partial<Application> = {}): Promise<Application> {
    const repo = this.dataSource.getRepository(Application);
    const application = repo.create({
      id: randomUUID(),
      title: "Test Application",
      type: "patent",
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });
    return repo.save(application);
  }

  async createMany(
    count: number,
    overrides: Partial<Application> = {}
  ): Promise<Application[]> {
    const applications: Application[] = [];
    for (let i = 0; i < count; i++) {
      applications.push(
        await this.create({
          title: `Test Application ${i + 1}`,
          ...overrides,
        })
      );
    }
    return applications;
  }
}
```

## API Response Patterns

```typescript
// Successful response structure
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

// Error response structure
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

## Implementation Rules

### Always Follow These Rules

- Use Jest `expect` or Node.js `assert` for all assertions
- Check HTTP response status codes for all API calls
- Use async/await for all step functions
- Type all function parameters properly
- Use factory functions to seed database data
- Verify API responses match BFFE spec contracts
- Store state in World object properties (`this.context.*`, `this.currentUser`, etc.)
- Follow CQRS: distinguish between Queries (GET) and Commands (POST/PUT/DELETE)
- Verify domain events are emitted for Commands using EventBus spy

### Never Do These

- Don't use synchronous functions
- Don't use `any` type
- Don't hardcode wait times
- Don't make API calls without authentication headers
- Don't access database directly; use factories
- Don't skip response validation
- Don't create stub implementations that just log and pass
- Don't implement authentication endpoints (login/logout) - oauth2-proxy handles this
- Don't test JWT validation in backend - tokens are pre-validated at ingress
- Do include `x-forwarded-access-token` header in API calls (simulating oauth2-proxy)

### Anti-Patterns to Avoid

These are recurring implementation mistakes that produce steps which compile and run but silently assert the wrong thing. Each has caused real test failures.

#### 1. Paginated Response Envelope Mismatch

Paginated APIs typically return `{ data: [...items], page, total, pageSize }`. Items and pagination metadata live at **different nesting levels** within this envelope. Never use a single extraction pattern like `payload = response.data?.data ?? response.data` for both item-count assertions and pagination-metadata assertions — when `response.data.data` is the items array (truthy), `payload` resolves to the array, and `payload.page` / `payload.total` are always `undefined`.

```typescript
// ❌ WRONG — single extraction for both uses
const payload = response.data?.data ?? response.data;
expect(payload).toHaveLength(10);       // works (payload is the array)
expect(payload.page).toBe(1);           // always undefined!

// ✅ CORRECT — navigate to the right level for each assertion type
const items = response.data?.data ?? response.data;
expect(items).toHaveLength(10);

const envelope = response.data;         // the wrapper object
expect(envelope.page).toBe(1);
expect(envelope.total).toBeDefined();
```

#### 2. Literal Property Access for Dot-Path Field Names

When assertion steps accept field names from DataTable rows (e.g., `meta.lockedBy`), always implement nested path traversal (split on `.` and reduce). Direct property lookup treats the dot-separated string as a single literal key, which never matches.

```typescript
// ❌ WRONG — literal key lookup
const value = payload['meta.lockedBy'];  // undefined

// ✅ CORRECT — nested traversal
const value = 'meta.lockedBy'.split('.').reduce(
  (obj, key) => obj?.[key],
  payload
);
```

If a step already supports dot-path traversal for one parameter (e.g., the `fieldPath` in `the response body {string} should contain:`), DataTable field names within the same step must use the same traversal logic for consistency.

#### 3. Context Flags Instead of Database Seeding for Given Steps

Given steps that describe persisted state the backend will query (e.g., "a confirmation has already been recorded") **MUST** insert actual records into the database via factories. Setting a context flag only influences step-definition routing — it cannot satisfy a backend database query. The backend will check the DB, find nothing, and behave as if the precondition does not hold.

```typescript
// ❌ WRONG — flag only, no DB record
Given('a confirmation has already been recorded for this JA',
  async function (this: IPHubWorld) {
    this.setContext('confirmationAlreadyRecorded', true);  // backend can't see this
  }
);

// ✅ CORRECT — seed the actual record
Given('a confirmation has already been recorded for this JA',
  async function (this: IPHubWorld) {
    const jaId = this.getContext<string>('currentJaId');
    await this.factories.confirmation.create({
      jurisdictionalApplicationId: jaId,
      confirmedAt: new Date(),
    });
  }
);
```

**Rule of thumb**: If the Given step describes something the backend will *query or check*, it must exist in the database. Context flags are only appropriate for influencing subsequent *step-definition* behavior (e.g., choosing which request to build in a When step), not for simulating backend state.

#### 4. Using Field Names from a Non-Authoritative Spec Without Cross-Referencing

When implementing steps that reference entity fields (e.g., building request bodies, asserting response fields), always verify the field name against the centralized API spec and the actual DTO/domain definitions (`libs/api-contracts/`, `libs/domain/`). If two specs name the same field differently (e.g., `examinerReference` in one spec vs `officeReferenceNumber` in another), the centralized API spec is authoritative. Check deployed code (DTOs, Pact contracts) to confirm which name the system actually uses. Document the conflict in the feature's discrepancy report. Never assume a field name from a feature-specific BFFE spec is correct without cross-checking.

```typescript
// ❌ WRONG — blindly using field name from one spec without cross-checking
const body = {
  officeReferenceNumber: 'REF-001',  // from Project 4.2.0 spec
};

// ✅ CORRECT — verified against centralized API spec and actual DTO
// Centralized Spec: specs/backend/api/ipams_office_actions.yaml uses "examinerReference"
// DTO: libs/api-contracts/src/dto/office-action.dto.ts uses "examinerReference"
const body = {
  examinerReference: 'REF-001',
};
```

**Rule of thumb**: Before using any field name in a step definition, check (1) the centralized API spec, (2) the actual DTO in `libs/api-contracts/`. If they disagree with the feature-specific BFFE spec, the centralized spec and DTO win.

## Test Execution Commands

```bash
# Run all E2E tests
pnpm nx test:e2e <<APP-NAME>>

# Run specific feature
npx cucumber-js apps/<<APP-NAME>>/test/e2e/features/<<FEATURE>>.feature

# Dry run to check syntax
pnpm nx test:e2e <<APP-NAME>> --dry-run

# TypeScript compilation check
tsc --noEmit

# View HTML report
open reports/cucumber_report.html
```

## Domain Model Reference

**CRITICAL**: Before implementing step definitions, read the relevant Domain Model documentation:

**Location**: `documentation/technical-project-context/domain-model/`

> **Note**: The `documentation/` directory is located at the mono-repo root.

**For each bounded context, review**:

1. Entity definitions and their properties
2. Value objects and their validation rules
3. Aggregate roots and boundaries
4. Domain events emitted
5. Relationships to other bounded contexts

**Example**: For Patent Application features, read:

- `Patent Application Context.md` - Primary entities
- `Shared Kernel Context.md` - Common value objects
- `Domain Events.md` - Events to emit
- `Specifications/Asset Types.md` - Asset type definitions

## UUID Requirements

**CRITICAL**: All resource identifiers MUST be UUIDs.

```typescript
// CORRECT - Use UUIDs for all resource identifiers
const applicationId = "550e8400-e29b-41d4-a716-446655440000";
await this.httpClient.get(`/api/applications/${applicationId}`);

// INCORRECT - Never use sequential integers
await this.httpClient.get("/api/applications/123"); // WRONG!
```

**Factory Pattern for UUIDs**:

```typescript
import { randomUUID } from 'crypto'

async create(overrides: Partial<Application> = {}): Promise<Application> {
  return repo.create({
    id: randomUUID(),  // Always generate UUID
    ...overrides
  })
}
```

## Project Test Commands (Backend)

Use the following Nx targets for the ip-hub-backend:

```bash
# Unit tests
pnpm nx test ip-hub-backend                    # Single run
pnpm nx test:cov ip-hub-backend                # With coverage

# Integration tests
pnpm nx test:integration ip-hub-backend        # Jest integration tests

# BDD E2E tests
pnpm nx test:e2e ip-hub-backend                # Full run
pnpm nx test:e2e:local ip-hub-backend          # With Testcontainer (recommended for local)
pnpm nx test:e2e:tags ip-hub-backend -- '@wip' # Specific tags
pnpm nx test:e2e:watch ip-hub-backend          # Watch mode

# Pact contract verification (Provider)
pnpm nx pact-verify ip-hub-backend             # Verify from Pact Broker
pnpm nx pact-verify-local ip-hub-backend       # Verify locally
pnpm nx pact-can-deploy ip-hub-backend         # Check deployment safety
pnpm nx pact-record-deployment ip-hub-backend  # Record successful deployment
```

## Quality Checklist

### Context Review

- [ ] Scaffolding file read and understood
- [ ] Existing step definitions reviewed for patterns
- [ ] BFFE spec and CQRS contract reviewed
- [ ] World object structure understood
- [ ] Domain Model documentation reviewed

### Implementation Quality

- [ ] All steps use async/await pattern
- [ ] IPHubWorld type annotation included on all steps
- [ ] No `any` types used
- [ ] Factory functions used for database seeding
- [ ] API calls include authentication headers
- [ ] Error handling captures both success and failure responses

### BDD Compliance

- [ ] Real assertions that will fail without backend implementation
- [ ] HTTP status codes validated
- [ ] Response body structure validated against BFFE spec
- [ ] Domain events verified for command operations
- [ ] No stub implementations that just log and pass

### Type Safety

- [ ] New interfaces added to `support/types.ts` as needed
- [ ] DTOs imported from contract libraries
- [ ] Proper parameter typing on all step functions

### Validation

- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] Tests execute (expected to fail if backend not implemented)
- [ ] Step implementations match scaffolding count
- [ ] Ready for next phase (backend implementation or review)

### Architecture Alignment (for Technical/Combined specs)

- [ ] Architecture Specification was read FIRST before implementing
- [ ] API endpoints match architecture-defined contracts EXACTLY
- [ ] Request/response schemas align with architecture
- [ ] CQRS commands/queries match architecture definitions
- [ ] Domain events match architecture event catalog
- [ ] Architecture reference comments included in step definitions

### Centralized API Spec Alignment

- [ ] All `specs/backend/api/*.yaml` files checked for relevant endpoints
- [ ] Frontend discrepancy report read and considered
- [ ] Step definitions align with centralized spec where endpoints exist
- [ ] Pact contract conflicts analyzed and documented
- [ ] Discrepancy report updated with backend implementation decisions (Section 4)
- [ ] Spec reference comments include centralized spec references
- [ ] Proposed centralized spec updates documented in discrepancy report

---

## Architecture-Driven Step Implementation

For **Technical** and **Combined** spec types, implement step definitions that align exactly with the Architecture Specification.

### Step 0: Read Architecture Specification

Before implementing ANY step definitions for Technical/Combined specs:

1. **Locate Architecture Specification**: `specs/backend/<FEATURE-FOLDER>/(Architecture/cqrs-contract/)`
2. **Read COMPLETELY** - don't skim
3. **Extract key elements**:
   - API endpoint definitions (paths, methods, schemas)
   - CQRS command and query contracts
   - Domain event definitions
   - Error codes and messages
   - Authentication requirements

### Architecture Reference Pattern

Include architecture reference comments in ALL step definitions:

```typescript
// Architecture Spec Reference: specs/backend/03-dashboard-overview/(Architecture/cqrs-contract/)dashboard-architecture.md
// Section: 3.1 Dashboard Summary Endpoint
// Contract: GET /dashboard/summary -> DashboardSummaryResponse
When("Alice requests the dashboard summary", async function (this: IPHubWorld) {
  try {
    // Endpoint and method match architecture specification
    const response = await this.httpClient.get("/api/dashboard/summary", {
      headers: { Authorization: `Bearer ${this.authToken}` },
    });
    this.context.response = response;
  } catch (error) {
    if (error.response) {
      this.context.response = error.response;
    }
    this.context.error = error;
  }
});
```

### Architecture Contract Validation

Implement assertions that validate against architecture-defined schemas:

```typescript
// Architecture: DashboardSummaryResponse schema
// {
//   totalAssets: number,
//   inProgressCount: number,
//   pendingReviewCount: number,
//   countsByType: { patents: number, trademarks: number, copyrights: number }
// }
Then(
  "the dashboard summary matches architecture contract",
  async function (this: IPHubWorld) {
    expect(this.context.response?.status).toBe(200);
    const data = this.context.response?.data;

    // Validate against architecture-defined schema
    expect(typeof data.totalAssets).toBe("number");
    expect(typeof data.inProgressCount).toBe("number");
    expect(typeof data.pendingReviewCount).toBe("number");
    expect(data.countsByType).toBeDefined();
    expect(typeof data.countsByType.patents).toBe("number");
    expect(typeof data.countsByType.trademarks).toBe("number");
    expect(typeof data.countsByType.copyrights).toBe("number");
  }
);
```

### CQRS Command Implementation (Architecture-Aligned)

```typescript
// Architecture: DraftPatentApplication Command
// Section: 4.1 Command Handlers
// Input: { type: 'patent', payload: { title: string, description: string } }
// Output: { applicationId: uuid, status: 'draft' }
// Event: PatentApplicationDrafted
When(
  "Alice creates a patent application with title {string}",
  async function (this: IPHubWorld, title: string) {
    try {
      // Request matches architecture command schema
      const response = await this.httpClient.post(
        "/api/actions/register",
        {
          type: "patent",
          payload: {
            title: title,
            description: "Test description for " + title,
          },
        },
        {
          headers: { Authorization: `Bearer ${this.authToken}` },
        }
      );
      this.context.response = response;
    } catch (error) {
      this.context.response = error.response;
      this.context.error = error;
    }
  }
);

Then(
  "the application is created per architecture contract",
  async function (this: IPHubWorld) {
    // Response matches architecture-defined output schema
    expect(this.context.response?.status).toBe(201);
    const data = this.context.response?.data;

    expect(data.applicationId).toMatch(/^[0-9a-f-]{36}$/); // UUID per architecture
    expect(data.status).toBe("draft");
  }
);

Then(
  "a PatentApplicationDrafted event is emitted per architecture",
  async function (this: IPHubWorld) {
    // Event matches architecture event catalog
    const events = await this.getEmittedEvents();
    const event = events.find((e) => e.type === "PatentApplicationDrafted");

    expect(event).toBeDefined();
    expect(event.payload.applicationId).toBeDefined();
    expect(event.payload.title).toBeDefined();
    expect(event.payload.draftedAt).toBeDefined();
    expect(event.payload.draftedBy).toBeDefined();
  }
);
```

### Error Response Validation (Architecture-Aligned)

```typescript
// Architecture: Error Response Schema
// Section: 7.0 Error Handling
// { error: { code: string, message: string, details?: object } }
Then(
  "the response contains error code {string}",
  async function (this: IPHubWorld, errorCode: string) {
    // Error format matches architecture specification
    const data = this.context.response?.data;

    expect(data.error).toBeDefined();
    expect(data.error.code).toBe(errorCode);
    expect(typeof data.error.message).toBe("string");
  }
);
```

## Swagger/OpenAPI Decorator Guidance

When creating or modifying controller endpoints as part of step definition implementation, **Swagger decorators MUST be present** and aligned with the centralized API spec. The centralized API specs (`specs/backend/api/*.yaml`) contain all the metadata needed to generate proper NestJS Swagger decorators.

### OpenAPI-to-NestJS Decorator Reference

| OpenAPI YAML Field      | NestJS Swagger Decorator                                            |
| ----------------------- | ------------------------------------------------------------------- |
| `tags`                  | `@ApiTags('tag-name')`                                              |
| `summary`               | `@ApiOperation({ summary: '...' })`                                 |
| `operationId`           | `@ApiOperation({ operationId: '...' })`                             |
| `responses.200`         | `@ApiResponse({ status: 200, description: '...', type: DtoClass })` |
| `responses.400/404/500` | `@ApiResponse({ status: N, description: '...' })`                   |
| `requestBody`           | `@ApiBody({ type: CreateDtoClass })`                                |
| `parameters[].in=query` | `@ApiQuery({ name: '...', required: true/false })`                  |
| `parameters[].in=path`  | `@ApiParam({ name: '...' })`                                        |
| `schema.properties`     | `@ApiProperty({ type, description, enum, required })` on DTO        |
| `security`              | `@ApiBearerAuth()` or `@ApiSecurity('oauth2')`                      |

### Retrofitting Existing Endpoints

When modifying an existing controller as part of the current implementation:

1. **Check if Swagger decorators are already present** on the controller and its endpoints
2. **If missing**: Add `@ApiTags`, `@ApiOperation`, `@ApiResponse`, and other decorators derived from the centralized API spec
3. **If present but mismatched** with the centralized spec: Update the decorators and log the discrepancy in the discrepancy report
4. This follows the **"boy scout rule"** — leave the code better than you found it

## Centralized API Spec Integration

### Spec Priority for Backend Implementation

| Priority    | Source                                            | When to Use                         |
| ----------- | ------------------------------------------------- | ----------------------------------- |
| 1 (Highest) | Centralized API Spec (`specs/backend/api/*.yaml`) | Endpoint exists in centralized spec |
| 2           | Frontend Pact Contract                            | What frontend actually needs        |
| 3           | Feature BFFE Spec                                 | Feature-specific requirements       |
| 4           | Architecture Specification                        | CQRS/domain patterns                |

### Fitting Frontend Requirements to Centralized Specs

When implementing step definitions:

1. **Check centralized spec first** for the endpoint
2. **Compare with Pact contract**:
   - If they match → implement per centralized spec
   - If they differ → analyze the conflict:
     - Is centralized spec newer/more accurate? → Implement per centralized spec, note Pact needs update
     - Is Pact contract a valid new requirement? → Implement per Pact, note centralized spec needs update
     - Is there a reasonable middle ground? → Document the compromise
3. **Document every decision** in the discrepancy report

### Discrepancy Documentation

Append to `specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md`:

````markdown
## Section 4: Backend Implementation Decisions

_Generated by: Backend Step Definition Implementer Agent_

### Endpoint Implementations

| Endpoint        | Centralized Spec | Pact Contract  | Decision                  | Reason                                        |
| --------------- | ---------------- | -------------- | ------------------------- | --------------------------------------------- |
| `GET /path`     | `ipams.yaml`     | Matches        | Implement per centralized | Aligned                                       |
| `POST /path`    | `ipams.yaml`     | Schema differs | Implement per centralized | Pact needs update - extra field not in domain |
| `GET /new-path` | Not found        | Defined        | Implement per Pact        | New endpoint, centralized spec needs update   |

### Centralized Spec Updates Required

For each new or changed endpoint, propose the YAML addition:

**Add to `specs/backend/api/ipams.yaml`**:

```yaml
/new-path:
  get:
    summary: Description
    # ... full OpenAPI definition
```

### Pact Contract Updates Required

[List Pact interactions that don't match centralized spec and need frontend updates]
````

### Spec Reference Comment Pattern

Include in ALL step definitions:

```typescript
// Centralized Spec: specs/backend/api/ipams.yaml - POST /universal-applications
// Pact Contract: frontend-backend-consumer.json - interaction: "create application"
// Decision: Implementing per centralized spec, Pact contract aligns
When(
  "Alice creates a universal application",
  async function (this: IPHubWorld) {
    // Implementation...
  }
);
```

For conflicts:

```typescript
// Centralized Spec: specs/backend/api/ipams.yaml - GET /universal-applications
// Pact Contract: frontend-backend-consumer.json - CONFLICT: expects extra "jurisdiction" field
// Decision: Implementing per centralized spec. Pact needs update (see discrepancy report)
When("Alice lists universal applications", async function (this: IPHubWorld) {
  // Implementation follows centralized spec schema
});
```

### NFR Validation (Architecture-Aligned)

```typescript
// Architecture: Performance Requirements
// Section: 6.1 Response Time SLAs
// GET /dashboard/summary: p95 < 150ms
Then(
  "the response time meets architecture SLA",
  async function (this: IPHubWorld) {
    const startTime = Date.now();
    await this.httpClient.get("/api/dashboard/summary", {
      headers: { Authorization: `Bearer ${this.authToken}` },
    });
    const responseTime = Date.now() - startTime;

    // p95 SLA from architecture specification
    expect(responseTime).toBeLessThan(150);
  }
);
```
