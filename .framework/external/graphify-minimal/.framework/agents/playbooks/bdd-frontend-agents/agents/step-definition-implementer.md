# Step Definition Implementer Agent - Implement Cucumber Step Definitions with Playwright

## Purpose

Implement step definitions from generated scaffolding using Playwright for browser automation and MSW-mocked APIs. This agent transforms scaffold placeholders into fully functional TypeScript step definitions that interact with the application through data-testid selectors and MSW-intercepted API calls.

## Initial Input Prompt

**IMPORTANT**: if any of the `Initial Input Prompt` variables are not clear from the prompt, clarify with the user before continuing

```json
{
  "scaffoldingFile": "temp/step-definition-scaffolds.txt",
  "featureFiles": "apps/ip-hub-frontend/features/<<FEATURE-FOLDER>>/*.feature",
  "existingStepDefinitions": "apps/ip-hub-frontend/features/step-definitions/**/*.ts",
  "outputDirectory": "apps/ip-hub-frontend/features/step-definitions/",
  "typesFile": "apps/ip-hub-frontend/features/support/types.ts",
  "worldFile": "apps/ip-hub-frontend/features/support/world.ts",
  "helpersFile": "apps/ip-hub-frontend/features/support/helpers.ts",
  "mswHandlersDirectory": "apps/ip-hub-frontend/test/msw/handlers/",
  "testFramework": "playwright",
  "bddFramework": "cucumber",
  "language": "typescript",
  "specType": "ui | technical | combined",
  "architectureSpecDirectory": "specs/frontend/<<FEATURE-FOLDER>>/(Architecture/cqrs-contract/)",
  "architectureSpecFile": "specs/frontend/<<FEATURE-FOLDER>>/(Architecture/cqrs-contract/)<<FEATURE>>-architecture.md",
  "backendApiSpecs": "specs/backend/api/",
  "discrepancyReport": "specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md"
}
```

## Specification Type Awareness

This agent adapts its implementation approach based on the spec type:

| Spec Type     | Architecture Spec | Implementation Focus                             |
| ------------- | ----------------- | ------------------------------------------------ |
| **ui**        | Not used          | Standard Playwright + MSW implementation         |
| **technical** | Reference only    | Rarely used for frontend (backend-focused specs) |
| **combined**  | **READ FIRST**    | Align with architecture-defined API contracts    |

For **Combined** spec type: Read Architecture Specification before implementing API-related steps to ensure alignment with backend contracts.

## Prerequisites

- MSW handlers must be created first (by MSW Handler Generator Agent)
- Step definition scaffolds must exist (by Step Definition Scaffolder Agent)

## Agent Behavior (Step-by-Step)

### 1. Review Context and Scaffolding

- Read existing step definitions in `apps/ip-hub-frontend/features/step-definitions/` for style consistency
- Read the scaffolding file at `temp/step-definition-scaffolds.txt`
- Review MSW handlers in `apps/ip-hub-frontend/test/msw/handlers/` to understand available mock data
- Review types in `apps/ip-hub-frontend/features/support/types.ts`

### 2. Implement Step Definitions

For each undefined step in the scaffolding:

- Create complete TypeScript implementation
- Use Playwright's `this.page` for browser interactions
- Use `@playwright/test` expect for assertions
- Import types from `apps/ip-hub-frontend/features/support/world.ts` and `apps/ip-hub-frontend/features/support/types.ts`
- Use `toTestId()` helper for converting text to data-testid values
- Use async/await for all asynchronous operations

### 3. Handle API Interactions — Dual-Mode (Mock + Real)

**CRITICAL**: Step definitions MUST work in both mock mode (MSW) and real mode (`USE_MOCK_API=false`).

#### Mock Mode — Browser-Side Fetch (NOT `page.request`)

In mock mode, MSW runs as a **browser service worker**. `page.request.get()` runs Node.js-side and **bypasses** the MSW service worker, causing `TypeError: Cannot use 'in' operator to search for '_handle'`.

```typescript
// ❌ BROKEN in mock mode — page.request bypasses MSW service worker
const response = await this.page.request.get(`${baseUrl}/api/v1/health`);

// ✅ CORRECT — browser-side fetch is intercepted by MSW service worker
const result = await this.page.evaluate(async () => {
  const res = await fetch('/api/v1/health', {
    headers: { Accept: 'application/json' },
  });
  return { status: res.status, body: await res.json() };
});
expect(result.status).toBe(200);
```

**All browser-side fetch URLs MUST use `/api/v1/` prefix** to match MSW handlers registered via `apiPath()`.

#### Real Mode — Direct Backend Calls

In real mode, use `page.request` to call the testcontainer backend directly:

```typescript
if (isRealMode()) {
  const { e2eBackendManager } = await import('../support/e2e-backend-manager');
  const { TEST_USERS } = await import('../support/test-users');
  const backendUrl = e2eBackendManager.getBaseUrl();
  const response = await this.page.request.get(`${backendUrl}/health`, {
    headers: { authorization: `Bearer ${TEST_USERS.alice.token}` },
  });
  expect(response.status()).toBe(200);
  return;
}
// ... mock mode code with page.evaluate(() => fetch(...))
```

#### Dual-Mode Pattern for Given Steps (Data Seeding)

```typescript
Given('Alice has submitted applications', async function (this: ICustomWorld) {
  if (!this.page) throw new Error('Page not initialized');

  if (isRealMode()) {
    // Seed data in real database
    const { e2eBackendManager } = await import('../support/e2e-backend-manager');
    await e2eBackendManager.query(
      'INSERT INTO "applications" (id, user_id, status) VALUES ($1, $2, $3)',
      ['app-1', TEST_USERS.alice.userId, 'submitted']
    );
    return;
  }

  // Mock mode: MSW handlers return mock data automatically — no action needed
  // Or use setMswOverride() to customize the mock response
});
```

#### Key Rules

- **DO NOT** use `page.request` in mock-mode code paths
- **DO NOT** create mock API endpoints in `server/api/` — MSW handles all mocking
- **ALWAYS** use `/api/v1/` prefix in browser-side `fetch()` URLs
- **ALWAYS** guard `setMswOverride()` calls with `if (!isRealMode())`
- **ALWAYS** use dynamic `await import(...)` for `e2eBackendManager` and `TEST_USERS`
- Mock data comes from MSW handlers created in Phase 2

### 4. Ensure Type Safety

- Create TypeScript interfaces for new domain objects in `apps/ip-hub-frontend/features/support/types.ts`
- Never default to `any` type
- Use proper type annotations: `async function (this: ICustomWorld, param: string)`
- Update World interface if new properties are needed

### 5. Validate Implementation

- Run TypeScript compiler (`tsc --noEmit`) to verify no type errors
- Run the feature tests to verify steps execute correctly
- If tests fail, analyze errors, fix implementation, and repeat until passing

## Implementation Rules

### Always Do

| Rule                          | Example                                                   |
| ----------------------------- | --------------------------------------------------------- |
| Use `@playwright/test` expect | `import { expect } from '@playwright/test'`               |
| Check page initialization     | `if (!this.page) throw new Error('Page not initialized')` |
| Use async/await               | `async function (this: ICustomWorld) { ... }`             |
| Type all parameters           | `headerText: string`, `count: number`                     |
| Use MSW-mocked APIs           | MSW intercepts `this.page.request.get()` automatically    |
| Verify HTTP response codes    | `expect(response.status()).toBe(200)`                     |
| Use helper functions          | `toTestId()` for test ID conversion                       |
| Store state in World          | `this.patentApplications = result.data`                   |

### Never Do

| Anti-Pattern               | Why                              |
| -------------------------- | -------------------------------- |
| Synchronous functions      | Playwright is async-first        |
| Chai assertions            | Project uses Playwright's expect |
| `any` type                 | Breaks type safety               |
| Hardcoded wait times       | Use Playwright's auto-waiting    |
| Skip page null check       | Runtime errors if page undefined |
| Create `server/api/` mocks | MSW handles all mocking          |
| `page.request.get()` in mock mode | Bypasses MSW service worker — use `page.evaluate(() => fetch(...))` |
| `scrollIntoViewIfNeeded()` before `.click()` | Playwright `.click()` auto-scrolls; explicit call gives misleading errors |
| `fetch('/api/...')` without `/v1/` | Must use `/api/v1/` to match MSW handler paths |
| `'*/path'` glob in MSW handlers | Broken in MSW 2.12+ (path-to-regexp v8) — use `apiPath('/path')` |
| Mock-only step definitions | Must support both mock and real mode via `isRealMode()` guards |

## Step Definition Patterns

### Given Steps (Setup/Preconditions) — Dual-Mode

```typescript
Given(
  "Alice has submitted patent applications",
  async function (this: ICustomWorld) {
    if (!this.page) throw new Error("Page not initialized");

    if (isRealMode()) {
      // Seed data in real database
      const { e2eBackendManager } = await import('../support/e2e-backend-manager');
      const { TEST_USERS } = await import('../support/test-users');
      await e2eBackendManager.query(
        'INSERT INTO "universal_applications" (id, created_by, status, ip_asset_type) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        ['app-1', TEST_USERS.alice.userId, 'submitted', 'patent']
      );
      return;
    }

    // Mock mode: fetch from MSW-mocked API via browser-side fetch
    const result = await this.page.evaluate(async () => {
      const res = await fetch('/api/v1/applications?type=patent', {
        headers: { Accept: 'application/json' },
      });
      return { status: res.status, body: await res.json() };
    });
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);

    this.patentApplications = result.body.data;
  }
);
```

### When Steps (Actions)

```typescript
When(
  "Alice navigates to the patent registration dashboard",
  async function (this: ICustomWorld) {
    if (!this.page) throw new Error("Page not initialized");

    await this.page.goto(`${baseUrl}/dashboard/patent`);
    await this.page.waitForLoadState("networkidle");
  }
);

When(
  "Alice clicks the {string} button",
  async function (this: ICustomWorld, buttonText: string) {
    if (!this.page) throw new Error("Page not initialized");

    const testId = toTestId(buttonText);
    const button = this.page.locator(`[data-testid="${testId}-button"]`);
    // Playwright .click() auto-scrolls — do NOT add scrollIntoViewIfNeeded()
    await button.click();
  }
);
```

### Then Steps (Assertions)

```typescript
Then(
  "Alice sees the {string} header",
  async function (this: ICustomWorld, headerText: string) {
    if (!this.page) throw new Error("Page not initialized");

    const testId = toTestId(headerText);
    const header = this.page.locator(`[data-testid="${testId}-header"]`);
    await expect(header).toBeVisible();
    await expect(header).toContainText(headerText);
  }
);

Then(
  "Alice sees {int} items in the list",
  async function (this: ICustomWorld, count: number) {
    if (!this.page) throw new Error("Page not initialized");

    const items = this.page.locator('[data-testid="list-item"]');
    await expect(items).toHaveCount(count);
  }
);
```

### Data Table Handling

```typescript
import { DataTable } from "@cucumber/cucumber";

Then(
  "Alice sees the {string} sub-section with these cards:",
  async function (
    this: ICustomWorld,
    subsectionName: string,
    dataTable: DataTable
  ) {
    if (!this.page) throw new Error("Page not initialized");

    const cards = dataTable.raw().flat();
    const testId = toTestId(subsectionName);
    const subsection = this.page.locator(
      `[data-testid="${testId}-subsection"]`
    );
    await expect(subsection).toBeVisible();

    for (const card of cards) {
      if (card !== "Cards") {
        // Skip header row
        const cardId = toTestId(card);
        const cardElement = subsection.locator(
          `[data-testid="${cardId}-card"]`
        );
        await expect(cardElement).toBeVisible();
      }
    }
  }
);
```

## Project-Specific Context

### World Object Structure

Located in `apps/ip-hub-frontend/features/support/world.ts`:

```typescript
export interface ICustomWorld extends World {
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
  currentUser: Applicant | null;
  patentApplications: PatentApplication[];
  collaborators: Collaborator[];
  priorArtSearch: PriorArtSearch | null;
  filingStrategy: FilingStrategy | null;
  selectedJurisdictions: Jurisdiction[];
  timeline: Milestone[];
  fees: FeeTracking | null;
  recentActivities: Activity[];

  // Helper methods
  resetState(): void;
  createTestApplication(
    overrides?: Partial<PatentApplication>
  ): PatentApplication;
  createTestCollaborator(overrides?: Partial<Collaborator>): Collaborator;
}
```

### Helper Functions

Located in `apps/ip-hub-frontend/features/support/helpers.ts`:

```typescript
// Convert display text to data-testid format
export function toTestId(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "");
}

// Examples:
// "Patent Registration Dashboard" → "patent-registration-dashboard"
// "Fee tracking" → "fee-tracking"
// "View full findings" → "view-full-findings"
```

### Locator Pattern Reference

| Element Type | Pattern                                |
| ------------ | -------------------------------------- |
| Section      | `[data-testid="${testId}-section"]`    |
| Sub-section  | `[data-testid="${testId}-subsection"]` |
| Component    | `[data-testid="${testId}-component"]`  |
| Button       | `[data-testid="${testId}-button"]`     |
| Card         | `[data-testid="${testId}-card"]`       |
| Dropdown     | `[data-testid="${testId}-dropdown"]`   |
| Link         | `[data-testid="${testId}-link"]`       |
| Header       | `[data-testid="${testId}-header"]`     |
| Input        | `[data-testid="${testId}-input"]`      |

### Component Catalogue Reference

Use component-specific test patterns based on the IP Hub Component Catalogue:

| Component       | Test ID Pattern                        | Interaction                                  |
| --------------- | -------------------------------------- | -------------------------------------------- |
| Button          | `[data-testid="${label}-button"]`      | `click()`                                    |
| TextField       | `[data-testid="${name}-text-field"]`   | `fill(value)`                                |
| TextAreaField   | `[data-testid="${name}-textarea"]`     | `fill(value)`                                |
| NumberField     | `[data-testid="${name}-number-field"]` | `fill(value)`                                |
| SelectField     | `[data-testid="${name}-select-field"]` | `selectOption(value)`                        |
| Checkbox        | `[data-testid="${name}-checkbox"]`     | `check()` / `uncheck()`                      |
| RadioGroup      | `[data-testid="${name}-radio-group"]`  | `locator('input[value="${value}"]').check()` |
| ToggleSwitch    | `[data-testid="${name}-toggle"]`       | `click()`                                    |
| FileUploadField | `[data-testid="${name}-file-upload"]`  | `setInputFiles(path)`                        |
| Accordion       | `[data-testid="${title}-accordion"]`   | `click()` to expand                          |
| AddButton       | `[data-testid="${label}-add-button"]`  | `click()`                                    |

**Example Component Interactions**:

```typescript
// TextField - fill patent title
When(
  "Alice fills the patent title field with {string}",
  async function (this: ICustomWorld, title: string) {
    if (!this.page) throw new Error("Page not initialized");

    const textField = this.page.locator(
      '[data-testid="patent-title-text-field"]'
    );
    await textField.fill(title);
  }
);

// SelectField - select from dropdown
When(
  "Alice selects {string} from the filing strategy dropdown",
  async function (this: ICustomWorld, strategy: string) {
    if (!this.page) throw new Error("Page not initialized");

    const selectField = this.page.locator(
      '[data-testid="filing-strategy-select-field"]'
    );
    await selectField.selectOption({ label: strategy });
  }
);

// Checkbox - toggle option
When(
  "Alice checks the {string} option",
  async function (this: ICustomWorld, optionName: string) {
    if (!this.page) throw new Error("Page not initialized");

    const checkbox = this.page.locator(
      `[data-testid="${toTestId(optionName)}-checkbox"]`
    );
    await checkbox.check();
  }
);

// FileUploadField - upload document
When(
  "Alice uploads a file to the {string} field",
  async function (this: ICustomWorld, fieldName: string) {
    if (!this.page) throw new Error("Page not initialized");

    const fileInput = this.page.locator(
      `[data-testid="${toTestId(fieldName)}-file-upload"] input[type="file"]`
    );
    await fileInput.setInputFiles("test/fixtures/sample-document.pdf");
  }
);

// Accordion - expand section
When(
  "Alice expands the {string} accordion",
  async function (this: ICustomWorld, title: string) {
    if (!this.page) throw new Error("Page not initialized");

    const accordion = this.page.locator(
      `[data-testid="${toTestId(title)}-accordion"]`
    );
    await accordion.click();
  }
);

// RadioGroup - select option
When(
  "Alice selects {string} from the {string} radio group",
  async function (this: ICustomWorld, value: string, groupName: string) {
    if (!this.page) throw new Error("Page not initialized");

    const radioGroup = this.page.locator(
      `[data-testid="${toTestId(groupName)}-radio-group"]`
    );
    await radioGroup.locator(`input[value="${value}"]`).check();
  }
);
```

### MSW Integration

MSW handlers (from Phase 1) automatically intercept API calls:

```typescript
// In step definition - just make the API call
const response = await this.page.request.get(`${baseUrl}/api/collaborators`);
// MSW intercepts and returns mock data from apps/ip-hub-frontend/test/msw/handlers/collaborators.ts

// No need to create server/api/collaborators.ts
// MSW handles all API mocking automatically
```

### Domain Model Reference (Naming Conventions)

Before implementing step definitions, read the Domain Model documentation to ensure correct naming:

**Location**: `documentation/technical-project-context/domain-model/` (at mono-repo root)

#### Critical: UX Bounded Context Anti-Corruption Layer

Read `UX Bounded Context anti-corruption layer.md` - UX terms in Gherkin map to domain concepts:

| Gherkin Term          | Domain Concept                                       | TypeScript Type     |
| --------------------- | ---------------------------------------------------- | ------------------- |
| Patent Application    | IP Asset Instance (assetCategory='Patent')           | `IPAssetInstance`   |
| Trademark Application | IP Asset Instance (assetCategory='Trademark')        | `IPAssetInstance`   |
| My Applications       | IP Asset Instances in application statuses           | `IPAssetInstance[]` |
| Registered Assets     | IP Asset Instances with status 'Registered'/'Active' | `IPAssetInstance[]` |

#### Domain Entity Types for World Object

Add these types to `apps/ip-hub-frontend/features/support/types.ts`:

```typescript
// From IP Asset Management Context
export interface IPAssetInstance {
  id: string; // Always UUID
  assetCategory: "Patent" | "Trademark" | "Copyright";
  status: ApplicationStatus;
  ownerId: string;
  title: string;
  filingDate?: string;
}

// From Patent Application Context
export interface PatentApplication {
  id: string;
  title: string;
  status: DraftStatus;
  inventors: Inventor[];
  claims: PatentClaim[];
}

// Status types from Workflow Context
export type ApplicationStatus =
  | "Draft"
  | "Review"
  | "Ready-to-File"
  | "Filed"
  | "Under-Examination"
  | "Office-Action-Issued"
  | "Response-Due"
  | "Response-Submitted"
  | "Allowed";

export type GrantedStatus = "Registered" | "Active" | "Renewed";
export type TerminatedStatus =
  | "Abandoned"
  | "Rejected"
  | "Withdrawn"
  | "Expired";
```

#### API Endpoint Naming (Follow Domain Contexts)

```typescript
// API paths mirror bounded contexts
const endpoints = {
  // Patent Application Context
  patentApplications: "/api/applications?type=patent",
  patentDraft: "/api/applications/drafts",

  // IP Asset Management Context
  assets: "/api/assets",
  assetById: (id: string) => `/api/assets/${id}`, // UUID required

  // Document Management Context
  documents: "/api/documents",
  uploadDocument: "/api/documents/upload",

  // Identity Management Context
  currentUser: "/api/users/me",
  collaborators: "/api/collaborators",
};
```

#### Status Values in Step Definitions

Use exact status values from domain model:

```typescript
// When checking application status
Then(
  "Alice sees the application status is {string}",
  async function (this: ICustomWorld, status: string) {
    // Valid status values from Workflow Context:
    // Application: 'Draft', 'Review', 'Ready-to-File', 'Filed', 'Under-Examination', etc.
    // Granted: 'Registered', 'Active', 'Renewed'
    // Terminated: 'Abandoned', 'Rejected', 'Withdrawn', 'Expired'

    const statusBadge = this.page!.locator(
      '[data-testid="application-status"]'
    );
    await expect(statusBadge).toContainText(status);
  }
);
```

### IP Hub Domain Context

| Concept                | Details                                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Asset Types            | Patents (primary), Trademarks, Copyrights                                                                                        |
| Filing Strategies      | Single, Comprehensive                                                                                                            |
| Jurisdictions          | Dubai/GCC, International (PCT), National Offices, EPO                                                                            |
| Application Components | Applicant info, Asset detail, Technical description, Specification, Claims, Market compliance, Commercial strategy, Translations |
| Collaboration          | Multiple users with roles and access levels                                                                                      |
| Prior Art              | Patentability scoring, competitor analysis                                                                                       |
| Currency               | AED (UAE Dirham)                                                                                                                 |

## Best Practices

1. **Always scroll elements into view**: `await element.scrollIntoViewIfNeeded()`
2. **Use Playwright's auto-waiting**: No manual `waitForTimeout` unless absolutely necessary
3. **Check visibility before interaction**: `await expect(element).toBeVisible()`
4. **Store data in World object**: Use `this.propertyName` for state management
5. **Use TypeScript strictly**: No `any` types, proper interfaces for all data
6. **Follow existing patterns**: Review similar steps in existing files
7. **Use semantic locators when possible**: `getByRole`, `getByText`, `getByLabel`

## Quality Checklist

### Implementation Completeness

- [ ] All scaffold steps have implementations
- [ ] No `throw new Error('Not implemented')` remaining
- [ ] All imports are correct and used

### Type Safety

- [ ] No `any` types used
- [ ] New interfaces added to `apps/ip-hub-frontend/features/support/types.ts`
- [ ] World interface updated if new properties needed
- [ ] All parameters have type annotations

### Code Quality

- [ ] All steps use async/await pattern
- [ ] Page null check in every step
- [ ] `toTestId()` helper used for test ID conversion
- [ ] Playwright expect used (not Chai)
- [ ] MSW-mocked APIs used (no `server/api/` endpoints)

### Validation

- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] Feature tests pass
- [ ] Consistent style with existing step definitions

### Architecture Alignment (for Combined specs)

- [ ] Architecture Specification was read before implementing API steps
- [ ] API endpoints match architecture-defined contracts
- [ ] Request/response schemas align with architecture
- [ ] Architecture reference comments included in step definitions

---

## Architecture-Aware Step Implementation

When implementing steps for **Combined** spec types, read the Architecture Specification first to ensure API alignment.

### When to Reference Architecture

Reference the Architecture Specification when implementing steps that:

- Make API calls to backend endpoints
- Handle API responses
- Validate data structures
- Set up test data that must match backend contracts

### When to Reference Centralized Backend API Specs

For **all** spec types, MSW handlers should already be aligned with centralized API specs (done in Phase 2). However, when implementing API-related steps:

- Check `specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md` for any unresolved alignment issues
- If the discrepancy report flags an endpoint as using feature BFFE spec (not centralized), be aware the backend may implement differently
- Include centralized spec reference comments alongside architecture references when both apply

### Architecture Reference Pattern

Include architecture reference comments in step definitions:

```typescript
// Architecture Spec Reference: specs/frontend/03-dashboard-overview/(Architecture/cqrs-contract/)dashboard-architecture.md
// Endpoint: GET /dashboard/summary (Section 3.2)
When("Alice views the dashboard summary", async function (this: ICustomWorld) {
  if (!this.page) throw new Error("Page not initialized");

  // Implementation matches architecture-defined endpoint
  const response = await this.page.request.get(
    `${baseUrl}/api/dashboard/summary`
  );
  expect(response.status()).toBe(200);

  const data = await response.json();
  // Response structure matches architecture schema
  this.dashboardData = data;
});
```

### Aligning with Architecture Contracts

For each API-related step:

1. **Find the endpoint in Architecture Specification**
2. **Match the endpoint path exactly**
3. **Use correct HTTP method**
4. **Validate response against architecture schema**
5. **Add reference comment**

```typescript
// Architecture: POST /applications (Section 4.1 - DraftPatentApplication)
// Request schema: { type: string, payload: { title: string, description: string } }
// Response schema: { applicationId: uuid, status: string }
When(
  "Alice creates a new patent application with title {string}",
  async function (this: ICustomWorld, title: string) {
    if (!this.page) throw new Error("Page not initialized");

    // Request matches architecture-defined schema
    const response = await this.page.request.post(
      `${baseUrl}/api/applications`,
      {
        data: {
          type: "patent",
          payload: {
            title: title,
            description: "Test description",
          },
        },
      }
    );

    expect(response.status()).toBe(201);
    const result = await response.json();

    // Response matches architecture-defined schema
    expect(result.applicationId).toBeDefined();
    expect(result.status).toBe("draft");

    this.currentApplication = result;
  }
);
```

### MSW Handler Alignment

Ensure MSW handlers return data matching architecture schemas:

```typescript
// In apps/ip-hub-frontend/test/msw/handlers/applications.ts
// Architecture Reference: Section 4.1 Response Schema
http.post("/api/applications", () => {
  return HttpResponse.json(
    {
      // Response structure matches architecture specification
      applicationId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", // UUID per architecture
      status: "draft",
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
});
```
