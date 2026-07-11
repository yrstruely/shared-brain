# BDD Backend Red Phase Validator Agent - Verify Step Definitions Fail Correctly

## Purpose

Verify that newly implemented step definitions fail correctly before the actual backend implementation exists. This is the **Red** phase of TDD/BDD workflow, confirming that tests are properly wired, setup works, and assertions are correct. Tests should fail for expected reasons (404, empty data) not due to step definition bugs.

## Initial Input Prompt

**IMPORTANT**: if any of the `Initial Input Prompt` variables are not clear from the prompt, clarify with the user before continuing

```json
{
  "featureFiles": "apps/<<APP-NAME>>/test/e2e/features/<<FEATURE-FOLDER>>/*.feature",
  "stepDefinitionFiles": "apps/<<APP-NAME>>/test/e2e/step-definitions/<<DOMAIN>>-steps.ts",
  "supportFiles": "apps/<<APP-NAME>>/test/e2e/support/",
  "reportDirectory": "reports/",
  "testFramework": "axios",
  "bddFramework": "cucumber",
  "projectType": "nestjs-e2e",
  "language": "typescript"
}
```

## Why This Step Matters

In TDD/BDD workflow, after implementing step definitions but **before** implementing the actual backend functionality, we run the tests expecting them to **fail**. This confirms:

| Confirmation | What It Means |
|--------------|---------------|
| Step definitions are correctly wired | Steps are found and executed |
| Test setup works | Database, HTTP client, authentication setup |
| Assertions are correct | Tests fail for the right reasons |
| No false positives | Tests don't pass when they shouldn't |

## Agent Behavior (Step-by-Step)

### 1. Ensure Prerequisites

Verify the test environment is ready:

```bash
# Ensure Docker is available (for Testcontainers)
docker info

# Or if using external services, ensure they're running
docker-compose up -d

# Optional: Start backend in background for integration tests
pnpm nx serve <<APP-NAME>>-backend --watch=false &
```

### 2. Run TypeScript Compilation Check

```bash
# Verify no type errors before running tests
npx tsc --noEmit
```

### 3. Run Cucumber Dry Run

```bash
# Verify all steps are defined
pnpm nx test:e2e <<APP-NAME>> --dry-run
```

### 4. Run Cucumber Tests

```bash
# Run the E2E tests for the specific feature
pnpm nx test:e2e <<APP-NAME>>

# Or run with more verbose output
npx cucumber-js apps/<<APP-NAME>>/test/e2e/features/<<FEATURE>>/*.feature \
  --format progress-bar \
  --format json:reports/cucumber_report.json \
  --format html:reports/cucumber_report.html
```

### 5. Analyze Failure Types

Categorize each failure:

**Expected Failures (Ready for Backend Implementation)**:
| Failure Type | Meaning |
|--------------|---------|
| `404 Not Found` | API endpoint not implemented yet |
| `501 Not Implemented` | Method stub exists but not implemented |
| Empty response | Query handler not implemented |
| `AssertionError: expected 0 to equal 5` | Business logic not implemented |

**Unexpected Failures (Step Definition Issues)**:
| Failure Type | Meaning |
|--------------|---------|
| `TypeError` | Code error in step definition |
| `Step not defined` | Missing step definition |
| `401 Unauthorized` | Authentication not set up correctly |
| `500 Internal Server Error` | Server-side crash |
| Connection errors | Server not running or wrong URL |

### 6. Document Results and Validate

- Categorize each failing scenario
- If unexpected failures found, fix step definitions and repeat
- Generate HTML report for developers

## Failure Analysis Examples

### Example 1: Expected Failure (404 - Endpoint Not Implemented)

```
Scenario: User views dashboard summary
  Given Alice is authenticated         # ✓ Passed - Setup works
  When Alice requests the dashboard    # ✗ Failed
    Error: Request failed with status code 404

Analysis: EXPECTED FAILURE ✓
- Step definition is correct
- API endpoint doesn't exist yet
- Ready for backend implementation
```

### Example 2: Step Definition Bug (TypeError)

```
Scenario: User dismisses alert
  Given Alice has active alerts        # ✓ Passed
  When Alice dismisses an alert        # ✗ Failed
    TypeError: Cannot read property 'id' of undefined

Analysis: STEP DEFINITION BUG ✗
- Bug in step definition code
- Fix: Ensure Given step sets up this.context.alerts correctly
```

### Example 3: Setup Issue (Connection Refused)

```
Scenario: User views applications
  Given Alice has applications         # ✗ Failed
    Error: connect ECONNREFUSED 127.0.0.1:3000

Analysis: SETUP ISSUE ✗
- Server not running or wrong BASE_URL
- Fix: Start backend server or configure correct URL
```

### Example 4: Authentication Issue (401)

```
Scenario: User creates application
  Given Alice is authenticated         # ✓ Passed
  When Alice creates an application    # ✗ Failed
    Error: Request failed with status code 401

Analysis: AUTHENTICATION ISSUE ✗
- Token not being sent or invalid
- Fix: Verify this.authToken is set and included in headers
```

## Common Issues and Fixes

### Issue: Steps Not Found

```
Error: Step implementation not found for: "..."
```

**Fix**: Check step definition file is in the correct location and cucumber config includes it.

### Issue: Wrong Base URL

```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Fix**: Set correct `BASE_URL` environment variable or configure in World constructor.

### Issue: Missing Auth Token

```
Error: Request failed with status code 401
```

**Fix**: Ensure Given step authenticates user and sets `this.authToken`.

### Issue: Testcontainer Not Starting

```
Error: Container startup failed
```

**Fix**: Ensure Docker daemon is running and has enough resources.

### Issue: Database Not Cleaned

```
Error: Duplicate key violation
```

**Fix**: Ensure After hook cleans database between scenarios.

### Issue: Factory Not Creating Data

```
AssertionError: expected [] to have length 5
```

**Fix**: Verify factory is called in Given step and data is committed to database.

## Test Execution Commands

```bash
# Check TypeScript errors first
npx tsc --noEmit

# Check for undefined steps
pnpm nx test:e2e <<APP-NAME>> --dry-run

# Run all E2E tests with verbose output
pnpm nx test:e2e <<APP-NAME>> --verbose

# Run specific feature file
npx cucumber-js apps/<<APP-NAME>>/test/e2e/features/<<FEATURE>>.feature

# Run with fail-fast (stop on first failure)
npx cucumber-js --fail-fast

# Generate HTML report
npx cucumber-js --format html:reports/cucumber_report.html

# View the report
open reports/cucumber_report.html
```

## Red-Green-Refactor Workflow

This agent completes the **Red** phase of TDD:

```
┌─────────────────────────────────────────────────────────────┐
│  1. RED (This Step)                                         │
│     Tests fail because backend implementation doesn't exist │
│     ↓                                                       │
│  2. GREEN (Next Step)                                       │
│     Implement backend to make tests pass                    │
│     ↓                                                       │
│  3. REFACTOR (Later)                                        │
│     Clean up code while keeping tests green                 │
└─────────────────────────────────────────────────────────────┘
```

## Handoff to Backend Developers

After verifying failures are correct, provide developers with:

1. **List of failing scenarios** - What needs to be implemented
2. **Expected implementations** - Endpoints, handlers, queries needed
3. **Test report location** - `reports/cucumber_report.html` for tracking progress
4. **API contracts** - BFFE spec and CQRS contracts for implementation details

## Quality Checklist

### Prerequisites Verified

- [ ] Docker daemon running (for Testcontainers)
- [ ] Backend server accessible (if using external server)
- [ ] Database connection configured
- [ ] Environment variables set (BASE_URL, etc.)

### Compilation and Syntax

- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] All step definitions found (no "undefined" steps)
- [ ] No import errors or missing dependencies

### Test Execution

- [ ] All scenarios executed
- [ ] No runtime errors in step definition code
- [ ] Authentication setup works (Given steps pass)
- [ ] HTTP client configuration correct

### Failure Analysis

- [ ] All failures categorized (expected vs. unexpected)
- [ ] Expected failures are due to missing backend implementation
- [ ] No step definition bugs remaining
- [ ] No setup/infrastructure issues remaining

### Documentation

- [ ] HTML report generated at `reports/cucumber_report.html`
- [ ] Failure reasons documented
- [ ] Ready for handoff to backend implementation phase
