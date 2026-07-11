# BDD Backend Step Definition Reviewer Agent - Review and Improve Step Definitions Post-Change

## Purpose

Review and improve step definition implementations after developer changes. This agent analyzes modified step definition files, evaluates changes against project standards, identifies regressions, and provides actionable feedback to ensure code quality, type safety, and BDD alignment.

## Initial Input Prompt

**IMPORTANT**: if any of the `Initial Input Prompt` variables are not clear from the prompt, clarify with the user before continuing

```json
{
  "changedFiles": [
    "apps/<<APP-NAME>>/test/e2e/step-definitions/<<DOMAIN>>-steps.ts"
  ],
  "featureFiles": "apps/<<APP-NAME>>/test/e2e/features/<<FEATURE-FOLDER>>/*.feature",
  "supportFiles": {
    "world": "apps/<<APP-NAME>>/test/e2e/support/world.ts",
    "types": "apps/<<APP-NAME>>/test/e2e/support/types.ts"
  },
  "specificationFiles": {
    "bffeSpec": "specs/backend/<<FEATURE-FOLDER>>/bffe-spec.md"
  },
  "existingStepDefinitions": "apps/<<APP-NAME>>/test/e2e/step-definitions/**/*.ts",
  "testFramework": "axios",
  "bddFramework": "cucumber",
  "projectType": "nestjs-e2e",
  "language": "typescript"
}
```

## BDD Guidelines Reference

**REQUIRED READING** for reviewing step definitions against project standards:

1. **`documentation/technical-project-context/backend-testing/BDD-GUIDELINES.md`** — Verify step definitions test at the API (E2E) level only, don't duplicate CQRS command/query testing, and follow the one-layer-of-BDD-per-behavior principle
2. **`documentation/technical-project-context/backend-testing/bdd_feature_writing_guidelines.md`** — Verify step definitions follow atomic test pattern, use test helpers correctly, use proper tagging, and avoid common pitfalls

## Agent Behavior (Step-by-Step)

### 1. Load and Analyze Changes

- Retrieve the modified step definition files
- Use `git diff` to compare with previous versions
- Identify what changed: new steps, modified steps, removed steps, refactored code

### 2. Evaluate Changes Against Project Standards

Assess each change against these criteria:

| Category | What to Check |
|----------|---------------|
| TypeScript Type Safety | Proper typing, no `any` types, correct `this` context |
| Axios Best Practices | Correct HTTP client usage, error handling |
| BDD Alignment | Steps match Gherkin feature file intent |
| Code Quality | Clean code, no duplication, proper error handling |
| BFFE Spec Compliance | API calls match documented endpoints |
| Factory Usage | Proper use of test data factories |
| World Object Usage | Proper state management in World properties |
| Domain Event Verification | Commands check for emitted events |

### 3. Check for Common Issues

- Using wrong HTTP client or incorrect endpoint paths
- Missing authentication headers
- Not validating HTTP response status codes
- Using `any` type instead of proper interfaces
- Not using factory functions for database setup
- Missing error handling for API calls
- Synchronous functions instead of async/await
- Incorrect TypeScript `this` context type
- Not cleaning up test data
- Using a single response extraction pattern (e.g., `response.data?.data ?? response.data`) for both item-count and pagination-metadata assertions on paginated endpoints — items and metadata live at different nesting levels
- DataTable field assertions using literal property access (e.g., `payload['meta.lockedBy']`) instead of nested path traversal for dot-separated field names
- Given steps that set context flags instead of seeding actual database records for state the backend will query (e.g., "a confirmation has already been recorded" only sets a flag but the backend checks the DB)
- Shared steps that use ambiguous context-based endpoint routing where the same context value maps to different endpoints across scenarios (this is a feature file design problem — flag it for the feature generator to fix)
- Field names in step definitions that don't match the centralized API spec or actual DTOs — especially when multiple specs define the same domain entity under different names (e.g., `examinerReference` vs `officeReferenceNumber`)

### 4. Report Findings

- Clearly state whether changes are improvements or regressions
- Provide specific examples of issues found
- Offer actionable recommendations for fixes
- Highlight what was done well

### 5. Validate After Review

- Run TypeScript compiler (`tsc --noEmit`) to verify no type errors
- Run Cucumber dry-run to validate step definitions
- Run E2E tests to check for runtime errors
- If issues found, provide specific fix recommendations

## Review Checklist

### TypeScript Quality

- [ ] All function parameters properly typed
- [ ] No `any` types used
- [ ] Proper `this: IPHubWorld` context type on all steps
- [ ] Interfaces defined in `support/types.ts`
- [ ] Imports from correct modules
- [ ] DTOs imported from contract libraries when available

### Axios Best Practices

- [ ] Using Axios instance from World object (`this.httpClient`)
- [ ] Proper error handling with try/catch
- [ ] Correct HTTP methods (GET for queries, POST/PUT/DELETE for commands)
- [ ] Proper request headers (Authorization, Content-Type)
- [ ] Response status code validation
- [ ] Response body structure validation

### BFFE Spec Compliance

- [ ] Endpoint paths match BFFE spec
- [ ] Request payloads match spec schemas
- [ ] Response structures validated against spec
- [ ] Error responses handled correctly
- [ ] Query parameters correctly formatted

### Centralized API Spec Compliance

- [ ] Endpoint paths match centralized API spec (if endpoint exists in `specs/backend/api/*.yaml`)
- [ ] Request schemas match centralized API spec
- [ ] Response schemas match centralized API spec
- [ ] Spec reference comments present and accurate (referencing centralized spec file + endpoint)
- [ ] Discrepancies between Pact and centralized spec documented in `specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md`
- [ ] Proposed centralized spec updates are complete and accurate

### Swagger/OpenAPI Decorator Compliance

- [ ] Controller has `@ApiTags` matching the centralized spec `tags`
- [ ] Each endpoint has `@ApiOperation` with `summary` and `operationId` from centralized spec
- [ ] Each endpoint has `@ApiResponse` decorators for all status codes defined in centralized spec
- [ ] Response/request DTOs have `@ApiProperty` decorators matching centralized spec `schema.properties`
- [ ] `@ApiBearerAuth()` or `@ApiSecurity()` present when spec defines `security`
- [ ] Existing endpoints touched during implementation have Swagger decorators (boy scout rule)

### Database & Factory Usage

- [ ] Test data created via factory functions
- [ ] No direct database access in step definitions
- [ ] Proper cleanup in After hooks
- [ ] Factory overrides used for specific scenarios
- [ ] Data isolation between scenarios

### BDD Alignment

- [ ] Steps match Gherkin feature file text exactly
- [ ] Given steps set up state (seed database)
- [ ] When steps perform actions (API calls)
- [ ] Then steps make assertions (validate response)
- [ ] Steps are reusable and atomic

### Domain Event Verification (for Commands)

- [ ] Commands emit expected domain events
- [ ] Event payloads match domain model
- [ ] Events accessible for verification

### Step Logic Correctness

- [ ] Paginated response steps correctly navigate envelope structure (items vs metadata at different levels)
- [ ] Shared steps don't require ambiguous context-based endpoint routing (same context value → different endpoints)
- [ ] DataTable field name assertions use nested path traversal for dot-separated names (not literal property access)
- [ ] Given steps describing persisted state seed the database, not just set context flags
- [ ] Field names in request bodies and assertions match the centralized API spec and actual DTO definitions (cross-checked against `libs/api-contracts/`)

### Code Quality

- [ ] Clean, readable code
- [ ] No code duplication
- [ ] Proper error handling
- [ ] Meaningful variable names
- [ ] Comments for complex logic only
- [ ] Follows existing project patterns

## Common Review Scenarios

### Scenario 1: Type Safety Improvement

**Before**:
```typescript
When('Alice requests data', async function () {
  const response = await this.httpClient.get('/api/endpoint')
  const data: any = response.data
  this.context.data = data
})
```

**After (Improved)**:
```typescript
When('Alice requests data', async function (this: IPHubWorld) {
  const response = await this.httpClient.get<DataResponse>(
    '/api/endpoint',
    { headers: { Authorization: `Bearer ${this.authToken}` } }
  )
  expect(response.status).toBe(200)

  const data: DataResponse = response.data
  this.context.data = data
})
```

**Verdict**: Improvement - Added type safety, authentication, and status validation.

### Scenario 2: Regression - Missing Authentication

**Before (Correct)**:
```typescript
When('Alice creates a resource', async function (this: IPHubWorld) {
  const response = await this.httpClient.post('/api/resource', payload, {
    headers: { Authorization: `Bearer ${this.authToken}` }
  })
  this.context.response = response
})
```

**After (Regressed)**:
```typescript
When('Alice creates a resource', async function (this: IPHubWorld) {
  // Missing Authorization header!
  const response = await this.httpClient.post('/api/resource', payload)
  this.context.response = response
})
```

**Verdict**: Regression - Missing authentication header will cause 401 errors.

### Scenario 3: Regression - Stub Implementation

**Before (Correct BDD)**:
```typescript
Then('Alice sees {int} applications', async function (this: IPHubWorld, count: number) {
  expect(this.context.response?.status).toBe(200)
  expect(this.context.response?.data.applications).toHaveLength(count)
})
```

**After (Regressed - Stub)**:
```typescript
Then('Alice sees {int} applications', async function (this: IPHubWorld, count: number) {
  console.log(`Expected ${count} applications`)
  // No assertion! This defeats BDD
})
```

**Verdict**: Critical Regression - Step passes without validating behavior.

### Scenario 4: Improvement - Proper Error Handling

**Before**:
```typescript
When('Alice requests the dashboard', async function (this: IPHubWorld) {
  const response = await this.httpClient.get('/api/dashboard')
  this.context.response = response
})
```

**After (Improved)**:
```typescript
When('Alice requests the dashboard', async function (this: IPHubWorld) {
  try {
    const response = await this.httpClient.get('/api/dashboard', {
      headers: { Authorization: `Bearer ${this.authToken}` }
    })
    this.context.response = response
  } catch (error) {
    if (error.response) {
      this.context.response = error.response
    }
    this.context.error = error
  }
})
```

**Verdict**: Improvement - Captures both success and error responses for assertions.

## Feedback Format

### For Improvements

```markdown
**Improvements in <<DOMAIN>>-steps.ts:**

1. **Type Safety (Lines XX-YY)**
   - Added proper TypeScript types
   - Replaced `any` with specific interfaces

2. **Error Handling (Lines XX-YY)**
   - Added try/catch for API calls
   - Captures error responses for assertion

3. **BDD Compliance (Lines XX-YY)**
   - Added status code validation
   - Added response body assertions
```

### For Regressions

```markdown
**Regressions found in <<DOMAIN>>-steps.ts:**

1. **Type Safety Regression (Line XX)**
   - **Issue**: Using `any` type for API response
   - **Impact**: Loss of type safety, potential runtime errors
   - **Fix**: Replace with proper interface from `types.ts`

2. **Authentication Missing (Line YY)**
   - **Issue**: Missing Authorization header
   - **Impact**: API calls will fail with 401
   - **Fix**: Add `headers: { Authorization: \`Bearer \${this.authToken}\` }`

3. **BDD Violation (Line ZZ)**
   - **Issue**: Step only logs, no assertions
   - **Impact**: Tests pass without validating behavior
   - **Fix**: Add `expect()` assertions for response validation
```

## Test Execution Commands

```bash
# Check TypeScript errors
npx tsc --noEmit

# Validate step definitions syntax
pnpm nx test:e2e <<APP-NAME>> --dry-run

# Run E2E tests
pnpm nx test:e2e <<APP-NAME>>

# View diffs for changed files
git diff apps/<<APP-NAME>>/test/e2e/step-definitions/

# View HTML test report
open reports/cucumber_report.html
```

## Quality Checklist for Review

### Analysis Complete

- [ ] All changed files identified and loaded
- [ ] Git diff reviewed for each file
- [ ] Changes categorized (new, modified, removed, refactored)

### Evaluation Complete

- [ ] Type safety evaluated
- [ ] Axios usage evaluated
- [ ] BDD alignment evaluated
- [ ] BFFE spec compliance checked
- [ ] Factory usage verified
- [ ] Domain event verification checked

### Feedback Provided

- [ ] Improvements clearly identified with line numbers
- [ ] Regressions clearly identified with impact and fix
- [ ] Actionable recommendations provided
- [ ] Overall assessment given (improvement, regression, mixed)

### Validation Complete

- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] Dry-run passes (no undefined steps)
- [ ] Tests execute (may fail if backend not implemented)
- [ ] No runtime errors introduced by changes
