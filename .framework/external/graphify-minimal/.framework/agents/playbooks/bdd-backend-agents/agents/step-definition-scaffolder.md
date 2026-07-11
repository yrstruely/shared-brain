# BDD Backend Step Definition Scaffolder Agent - Generate Cucumber Step Definition Scaffolds

## Purpose

Generate step definition scaffolding from Gherkin feature files by running Cucumber.js in dry-run mode for backend E2E API testing. This agent identifies undefined steps in feature files and creates TypeScript scaffold files using Axios HTTP client and Testcontainers for database isolation.

## Initial Input Prompt

**IMPORTANT**: if any of the `Initial Input Prompt` variables are not clear from the prompt, clarify with the user before continuing

```json
{
  "featureFile": "apps/<<APP-NAME>>/test/e2e/features/<<FEATURE-FOLDER>>/*.feature",
  "outputDirectory": "apps/<<APP-NAME>>/test/e2e/step-definitions/",
  "scaffoldOutputFile": "temp/step-definition-scaffolds.txt",
  "existingStepDefinitions": "apps/<<APP-NAME>>/test/e2e/step-definitions/**/*.ts",
  "supportFiles": "apps/<<APP-NAME>>/test/e2e/support/",
  "testFramework": "axios",
  "bddFramework": "cucumber",
  "projectType": "nestjs-e2e",
  "language": "typescript",
  "specType": "ui | technical | combined",
  "architectureSpecDirectory": "specs/backend/<<FEATURE-FOLDER>>/(Architecture/cqrs-contract/)",
  "architectureSpecFile": "specs/backend/<<FEATURE-FOLDER>>/(Architecture/cqrs-contract/)<<FEATURE>>-architecture.md"
}
```

## Specification Type Awareness

For backend scaffolding, spec type affects the patterns generated:

| Spec Type     | Architecture Spec | Scaffold Considerations                    |
| ------------- | ----------------- | ------------------------------------------ |
| **ui**        | Not used          | Standard Axios scaffolds                   |
| **technical** | **Reference**     | Include architecture-aligned step patterns |
| **combined**  | **Reference**     | Include architecture-aligned step patterns |

For **Technical/Combined** specs, include comments referencing Architecture Specification sections in scaffolds.

## BDD Guidelines Reference

**REQUIRED READING** before scaffolding step definitions:

- **`documentation/technical-project-context/backend-testing/bdd_feature_writing_guidelines.md`** — Step definition patterns, reusable steps, parameterized steps, atomic test pattern, and test helper usage. Scaffolds should follow these patterns.

## Agent Behavior (Step-by-Step)

### 1. Run Cucumber.js Dry Run

Execute the dry-run command to identify undefined step definitions:

```bash
# Using Nx
pnpm nx test:e2e <<APP-NAME>> --dry-run

# Alternative: direct cucumber-js dry run
export NODE_OPTIONS="--import=tsx/esm"
npx cucumber-js apps/<<APP-NAME>>/test/e2e/features/**/*.feature --dry-run --format progress
```

- Capture the output showing missing/undefined steps
- Note which steps are already implemented (to avoid duplicates)

### 2. Analyze Undefined Steps

- Parse the dry-run output to extract undefined step patterns
- Group steps by domain/feature area
- Identify common step patterns that can be parameterized
- Determine which file(s) should contain each step

### 3. Generate Step Definition Scaffolds

Create TypeScript step definition files in the output directory:

- Use async/await pattern for all steps
- Import required types from `@cucumber/cucumber` and axios
- Follow project naming conventions (kebab-case for files)
- Group related steps by domain/feature
- Include placeholder implementation with `throw new Error('Not implemented')`

### 4. Save Scaffolding Output

- Save undefined steps list to: `temp/step-definition-scaffolds.txt`
- Create/update step definition files in output directory

### 5. Validate Scaffolds

- Run TypeScript compiler (`tsc --noEmit`) to verify scaffolds compile
- Re-run dry-run to confirm step count matches expectations
- If issues found, fix and repeat until validation passes

## Step Definition Template

```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import type { IPHubWorld } from "../support/world";

Given("step text here", async function (this: IPHubWorld) {
  // TODO: Implement this step
  throw new Error("Not implemented");
});

When(
  "Alice requests the {string} endpoint",
  async function (this: IPHubWorld, endpoint: string) {
    // TODO: Implement HTTP request
    throw new Error("Not implemented");
  }
);

Then(
  "Alice receives a {int} response",
  async function (this: IPHubWorld, statusCode: number) {
    // TODO: Implement assertion
    throw new Error("Not implemented");
  }
);
```

## Common Step Patterns

### Given Steps (Setup/Preconditions)

```typescript
// User authentication
Given("Alice is an authenticated user", async function (this: IPHubWorld) {
  // Setup auth token from identity provider
  this.authToken = await this.auth.getToken("alice");
});

// Data state via factory
Given(
  "Alice has {int} submitted applications",
  async function (this: IPHubWorld, count: number) {
    const applications = await this.factories.application.createMany(count, {
      userId: this.currentUser.id,
      status: "submitted",
    });
    this.context.applications = applications;
  }
);

// Database state
Given(
  "the system has the following users:",
  async function (this: IPHubWorld, dataTable: DataTable) {
    const users = dataTable.hashes();
    for (const user of users) {
      await this.factories.user.create(user);
    }
  }
);
```

### When Steps (Actions)

```typescript
// GET request
When("Alice requests the dashboard summary", async function (this: IPHubWorld) {
  const response = await this.httpClient.get("/api/dashboard/summary", {
    headers: { Authorization: `Bearer ${this.authToken}` },
  });
  this.context.response = response;
});

// POST request with body
When(
  "Alice submits a new application with:",
  async function (this: IPHubWorld, dataTable: DataTable) {
    const [data] = dataTable.hashes();
    const response = await this.httpClient.post("/api/applications", data, {
      headers: { Authorization: `Bearer ${this.authToken}` },
    });
    this.context.response = response;
  }
);

// PUT/PATCH request
When(
  "Alice updates the application status to {string}",
  async function (this: IPHubWorld, status: string) {
    const response = await this.httpClient.patch(
      `/api/applications/${this.context.applicationId}`,
      { status },
      { headers: { Authorization: `Bearer ${this.authToken}` } }
    );
    this.context.response = response;
  }
);

// DELETE request
When("Alice deletes the application", async function (this: IPHubWorld) {
  const response = await this.httpClient.delete(
    `/api/applications/${this.context.applicationId}`,
    { headers: { Authorization: `Bearer ${this.authToken}` } }
  );
  this.context.response = response;
});
```

### Then Steps (Assertions)

```typescript
// Status code assertion
Then(
  "Alice receives a {int} response",
  async function (this: IPHubWorld, statusCode: number) {
    expect(this.context.response.status).toBe(statusCode);
  }
);

// Response body assertion
Then(
  "the response contains {int} applications",
  async function (this: IPHubWorld, count: number) {
    expect(this.context.response.data.applications).toHaveLength(count);
  }
);

// Field value assertion
Then(
  "the response includes the application id",
  async function (this: IPHubWorld) {
    expect(this.context.response.data.id).toBeDefined();
  }
);

// Array content assertion
Then(
  "the response includes the following fields:",
  async function (this: IPHubWorld, dataTable: DataTable) {
    const expectedFields = dataTable.raw().flat();
    for (const field of expectedFields) {
      expect(this.context.response.data).toHaveProperty(field);
    }
  }
);
```

### Data Table Steps

```typescript
import { DataTable } from "@cucumber/cucumber";

Given(
  "the following applications exist:",
  async function (this: IPHubWorld, dataTable: DataTable) {
    const applications = dataTable.hashes();
    for (const app of applications) {
      await this.factories.application.create({
        ...app,
        userId: this.currentUser.id,
      });
    }
  }
);

Then(
  "the response contains:",
  async function (this: IPHubWorld, dataTable: DataTable) {
    const expected = dataTable.rowsHash();
    for (const [key, value] of Object.entries(expected)) {
      expect(this.context.response.data[key]).toBe(value);
    }
  }
);
```

## Project-Specific Context

### Directory Structure

| Directory                                     | Purpose                                           |
| --------------------------------------------- | ------------------------------------------------- |
| `apps/<<APP>>/test/e2e/features/**/*.feature` | Gherkin feature files                             |
| `apps/<<APP>>/test/e2e/step-definitions/*.ts` | Step definition implementations                   |
| `apps/<<APP>>/test/e2e/support/world.ts`      | Custom World class with HTTP client, test context |
| `apps/<<APP>>/test/e2e/support/hooks.ts`      | Before/After hooks for test setup and cleanup     |
| `apps/<<APP>>/test/e2e/support/types.ts`      | TypeScript interfaces for domain models           |
| `apps/<<APP>>/test/e2e/support/helpers.ts`    | Utility functions for API testing                 |
| `apps/<<APP>>/test/e2e/support/factories/`    | Test data factories for Testcontainers setup      |

### Technology Stack

| Technology         | Version | Purpose                      |
| ------------------ | ------- | ---------------------------- |
| @cucumber/cucumber | 11.x    | BDD Framework                |
| Axios              | latest  | HTTP Client for API requests |
| Testcontainers     | latest  | Isolated PostgreSQL database |
| TypeScript         | 5.x     | Language (strict mode)       |
| NestJS             | 11.x    | Backend Framework            |
| Jest expect        | -       | Assertions                   |
| Nx                 | latest  | Monorepo tooling             |

### Cucumber Configuration

Located at root `cucumber.js`:

```javascript
module.exports = {
  default: {
    paths: ["apps/<<APP>>/test/e2e/features/**/*.feature"],
    require: ["apps/<<APP>>/test/e2e/**/*.ts"],
    requireModule: ["ts-node/register", "tsconfig-paths/register"],
    format: [
      "progress-bar",
      "json:reports/cucumber_report.json",
      "html:reports/cucumber_report.html",
    ],
    formatOptions: { snippetInterface: "async-await" },
    parallel: 1,
  },
};
```

### Naming Conventions

| Convention            | Example                                      |
| --------------------- | -------------------------------------------- |
| Step definition files | `dashboard-steps.ts`, `application-steps.ts` |
| File naming           | kebab-case                                   |
| Step functions        | async/await pattern                          |
| World type            | `IPHubWorld` or project-specific World class |

### Grouping Steps by Domain

| File                   | Steps For                              |
| ---------------------- | -------------------------------------- |
| `common-steps.ts`      | Authentication, generic API assertions |
| `dashboard-steps.ts`   | Dashboard API endpoints                |
| `application-steps.ts` | Application CRUD operations            |
| `user-steps.ts`        | User management endpoints              |

## Backend BDD Testing Approach

Unlike frontend BDD tests that use Playwright for browser automation, backend BDD tests:

- Use **Axios** HTTP client to make API calls to BFFE endpoints
- Use **Testcontainers** for isolated PostgreSQL database per test run
- Test business logic through the API layer (no UI)
- Verify CQRS commands execute correctly and emit expected events
- Validate API responses match BFFE spec contracts
- Check domain events are published for state changes

### World Class Pattern

```typescript
import { World, setWorldConstructor } from "@cucumber/cucumber";
import axios, { AxiosInstance } from "axios";

export class IPHubWorld extends World {
  httpClient: AxiosInstance;
  authToken: string;
  currentUser: { id: string };
  context: Record<string, any> = {};
  factories: FactoryManager;

  constructor(options: any) {
    super(options);
    this.httpClient = axios.create({
      baseURL: process.env.API_BASE_URL || "http://localhost:3000",
    });
  }
}

setWorldConstructor(IPHubWorld);
```

## Best Practices

### Do

- Use async/await for all step definitions
- Import `expect` from Jest (NOT Chai)
- Type the World context: `this: IPHubWorld`
- Use Testcontainers for database isolation
- Parameterize common patterns with `{string}`, `{int}`, etc.
- Group related steps in domain-specific files
- Store HTTP responses in `this.context.response` for assertions
- Use factories to seed test data

### Don't

- Use synchronous step definitions
- Share database state between scenarios
- Hardcode API base URLs (use environment variables)
- Forget to handle authentication in protected endpoints
- Create overly specific steps that can't be reused
- Put all steps in a single file
- Make assertions in When steps (save for Then steps)

## Scaffold Output Format

The `temp/step-definition-scaffolds.txt` file should contain:

```text
# Undefined Steps from: apps/<<APP>>/test/e2e/features/**/*.feature
# Generated: [timestamp]
# Total: 25 undefined steps

## dashboard-steps.ts (15 steps)

Given('Alice has submitted IP applications', async function (this: IPHubWorld) {
  // TODO: Implement - seed database with applications
  throw new Error('Not implemented')
})

When('Alice requests the dashboard summary', async function (this: IPHubWorld) {
  // TODO: Implement - GET /api/dashboard/summary
  throw new Error('Not implemented')
})

Then('Alice sees a total of {int} applications', async function (this: IPHubWorld, count: number) {
  // TODO: Implement - assert response.data.totalAssets
  throw new Error('Not implemented')
})

...

## common-steps.ts (10 steps)

Given('Alice is an authenticated user', async function (this: IPHubWorld) {
  // TODO: Implement - get auth token
  throw new Error('Not implemented')
})

...
```

## Quality Checklist

### Dry Run Execution

- [ ] Dry-run command executed successfully (`pnpm nx test:e2e <<APP>> --dry-run`)
- [ ] Undefined steps captured from output
- [ ] Existing step definitions not duplicated

### Scaffold Generation

- [ ] Step definition files created in correct directory
- [ ] Files follow kebab-case naming convention
- [ ] Steps grouped by domain/feature
- [ ] All steps use async/await pattern
- [ ] IPHubWorld type annotation included
- [ ] HTTP client patterns used (not Playwright)

### Scaffold Quality

- [ ] Parameterized patterns used where appropriate
- [ ] Common steps extracted to `common-steps.ts`
- [ ] Placeholder `throw new Error('Not implemented')` included
- [ ] TypeScript imports are correct (axios, Jest expect)
- [ ] TODO comments indicate implementation approach

### Validation

- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] Re-run dry-run shows expected step count
- [ ] Scaffold output file created at `temp/step-definition-scaffolds.txt`
- [ ] Ready for next step (step definition implementation)

---

## Domain Model Reference

**CRITICAL**: Before generating step scaffolds, understand the relevant Domain Model documentation:

**Location**: `documentation/Technical Project Context/Domain Model/`

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

**CRITICAL**: All resource identifiers MUST be UUIDs in generated scaffolds.

```typescript
// CORRECT - UUID format in all API calls
When(
  "Alice requests the application with id {string}",
  async function (this: IPHubWorld, id: string) {
    // id should be a UUID like '550e8400-e29b-41d4-a716-446655440000'
    const response = await this.httpClient.get(`/api/applications/${id}`);
    this.context.response = response;
  }
);

// CORRECT - Factory generates UUIDs
const application = await this.factories.application.create({
  id: randomUUID(), // NOT '123' or 'app-1'
});
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

# Dry-run for undefined steps
npx cucumber-js apps/ip-hub-backend/test/e2e/features/**/*.feature --dry-run --format progress
```
