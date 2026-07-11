# BDD Backend Agents Plugin

A comprehensive, structured workflow for backend E2E step definition development with specialized agents for: scaffolding generation, step implementation, code review, and red phase validation.

## Overview

The BDD Backend Agents Plugin provides a systematic 5-phase approach to implementing Cucumber.js step definitions for backend E2E API testing. Instead of jumping straight into writing step definitions, it guides you through generating scaffolds from dry-runs, implementing with proper patterns, reviewing for quality, and validating the BDD Red phase—resulting in maintainable tests that integrate seamlessly with your existing test infrastructure.

## Philosophy

Building backend E2E tests requires more than just writing step definitions. You need to:

- **Generate scaffolds** from Cucumber dry-runs to ensure complete coverage
- **Implement properly** with Axios, Jest assertions, and Testcontainers factories
- **Review for quality** to catch type safety issues and BDD violations
- **Validate the Red phase** to confirm tests fail for the right reasons

This plugin embeds these practices into a structured workflow that runs automatically when you use the `/dna-bdd-backend-features:dna-bdd-backend-features` command.

## Command: `/dna-bdd-backend-features:dna-bdd-backend-features`

Launches a guided backend BDD development workflow with 5 distinct phases.

**Usage:**

```bash
/dna-bdd-backend-features:dna-bdd-backend-features apps/ip-hub-backend/test/e2e/features/dashboard/*.feature specs/02-dashboard-overview/
```

Or simply:

```bash
/dna-bdd-backend-features:dna-bdd-backend-features
```

The command will guide you through the entire process interactively.

## The 5-Phase Workflow

### Phase 1: Generate Step Definition Scaffolds

**Goal**: Run Cucumber.js dry-run to identify undefined steps and generate scaffold files

**What happens:**

- Runs `npx nx test:e2e <app> --dry-run` to capture undefined steps
- Generates TypeScript scaffold files with placeholder implementations
- Groups steps by domain (e.g., `dashboard-steps.ts`, `common-steps.ts`)
- Saves scaffold output to `temp/step-definition-scaffolds.txt`

**Example:**

```
You: /dna-bdd-backend-features:dna-bdd-backend-features apps/ip-hub-backend/test/e2e/features/dashboard/*.feature
Claude: Let me run a dry-run to identify undefined steps...
```

### Phase 2: Implement Step Definitions

**Goal**: Transform scaffold placeholders into complete implementations

**What happens:**

- Reads scaffolding file and BFFE/CQRS specs
- Implements Given steps with factory database seeding
- Implements When steps with Axios API calls
- Implements Then steps with Jest assertions
- Creates TypeScript interfaces in `support/types.ts`

### Phase 3: Review Step Definitions

**Goal**: Review implementations for quality, type safety, and BDD compliance

**What happens:**

- Checks for TypeScript type safety (no `any` types)
- Validates Axios best practices (error handling, auth headers)
- Ensures BDD alignment (real assertions, not stubs)
- Verifies BFFE spec compliance (correct endpoints)
- Reviews factory usage (proper database seeding)

### Phase 4: Validate Red Phase

**Goal**: Run tests to verify they fail correctly before backend implementation

**What happens:**

- Runs TypeScript compilation check
- Runs Cucumber dry-run to verify all steps are defined
- Executes tests expecting failures
- Categorizes failures as expected (404, empty data) or unexpected (TypeError, 401)
- Generates HTML report at `reports/cucumber_report.html`

### Phase 5: Summarize and Handoff

**Goal**: Document what was accomplished and prepare for backend implementation

**What happens:**

- Summarizes files created and decisions made
- Lists failing scenarios for backend developers
- Provides API endpoints and domain events needed
- Suggests next steps (Green phase, Refactor phase)

## Agents

### `step-definition-scaffolder`

**Purpose**: Generate step definition scaffolds from Cucumber.js dry-run

**Focus areas:**

- Running Cucumber dry-run to capture undefined steps
- Generating TypeScript scaffold files
- Grouping steps by domain
- Following project naming conventions (kebab-case)

**When triggered:**

- Automatically in Phase 1
- Can be invoked manually when adding new feature files

**Output:**

- Step definition scaffold files in `step-definitions/` directory
- Scaffold summary in `temp/step-definition-scaffolds.txt`

### `step-definition-implementer`

**Purpose**: Implement step definitions with Axios, Jest, and Testcontainers

**Focus areas:**

- Given steps: Database seeding via factory functions
- When steps: API calls via Axios with authentication
- Then steps: Assertions via Jest expect
- Type safety with proper TypeScript interfaces
- CQRS compliance (queries vs. commands)

**When triggered:**

- Automatically in Phase 2
- Can be invoked manually when implementing specific steps

**Output:**

- Complete step definition implementations
- TypeScript interfaces in `support/types.ts`

### `step-definition-reviewer`

**Purpose**: Review step definitions for quality and BDD compliance

**Focus areas:**

- TypeScript type safety (no `any` types)
- Axios best practices (error handling, auth headers)
- BDD alignment (real assertions, not stubs)
- BFFE spec compliance (correct endpoints, payloads)
- Factory usage (proper database seeding)
- Domain event verification (for commands)

**When triggered:**

- Automatically in Phase 3
- Can be invoked manually after code changes

**Output:**

- Quality assessment with improvements and regressions
- Specific fix recommendations

### `bdd-red-phase-validator`

**Purpose**: Verify tests fail correctly before backend implementation

**Focus areas:**

- TypeScript compilation validation
- Cucumber dry-run verification
- Failure categorization (expected vs. unexpected)
- Test infrastructure validation
- HTML report generation

**When triggered:**

- Automatically in Phase 4
- Can be invoked manually to validate test state

**Output:**

- Failure analysis report
- HTML test report at `reports/cucumber_report.html`

### `pact-provider-verifier`

**Purpose**: Verify backend API satisfies Pact contracts from the Pact Broker

**Focus areas:**

- Fetching consumer contracts from Pact Broker
- Configuring provider state handlers for test data setup
- Running Pact verification against the backend
- Publishing verification results to Pact Broker
- Deployment safety checks (can-i-deploy)

**When triggered:**

- Manually when validating contract compliance
- As part of CI/CD pipeline

**Output:**

- Verification results published to Pact Broker
- Deployment safety status

**Critical Note**: The backend does NOT access frontend code directly. Contracts are fetched from the Pact Broker.

**Example configuration:**

```typescript
const verifier = new Verifier({
  providerBaseUrl: 'http://localhost:3000',
  pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
  pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
  pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
  provider: 'IPManagementBackend',
  publishVerificationResult: true,
  providerVersion: process.env.npm_package_version,
  stateHandlers: {
    'Alice has 45 active patents': async () => {
      // Set up test database state
    }
  }
})
```

## Usage Patterns

### Full workflow (recommended for new features):

```bash
/dna-bdd-backend-features:dna-bdd-backend-features apps/ip-hub-backend/test/e2e/features/dashboard/*.feature specs/02-dashboard-overview/
```

Let the workflow guide you through all phases.

### Manual agent invocation:

**Generate scaffolds:**

```
"Launch step-definition-scaffolder to generate scaffolds for apps/ip-hub-backend/test/e2e/features/onboarding/*.feature"
```

**Implement steps:**

```
"Launch step-definition-implementer to implement the scaffolds in temp/step-definition-scaffolds.txt"
```

**Review implementations:**

```
"Launch step-definition-reviewer to review apps/ip-hub-backend/test/e2e/step-definitions/dashboard-steps.ts"
```

**Validate red phase:**

```
"Launch bdd-red-phase-validator to verify tests fail correctly for the dashboard feature"
```

## Technology Stack

| Technology | Purpose |
|------------|---------|
| @cucumber/cucumber 11.x | BDD framework |
| Axios | HTTP client for API requests |
| Jest expect | Assertions |
| Testcontainers | Isolated PostgreSQL database |
| TypeScript 5.x | Language (strict mode) |
| NestJS 11.x | Backend framework |
| Nx | Monorepo tooling |
| PostgreSQL | Database |
| Azure Service Bus | Async queue processing |
| Pact | Contract verification (Pact Broker) |

## File Structure

```
apps/<<APP>>/test/e2e/
├── features/
│   └── <<feature>>.feature          # Gherkin feature files
├── step-definitions/
│   ├── common-steps.ts              # Shared authentication, navigation
│   └── <<domain>>-steps.ts          # Domain-specific steps
└── support/
    ├── world.ts                     # Custom World class
    ├── hooks.ts                     # Before/After hooks
    ├── types.ts                     # TypeScript interfaces
    ├── helpers.ts                   # Utility functions
    └── factories/                   # Test data factories

cucumber.js                          # Root-level Cucumber configuration

specs/<<spec-folder>>/
├── bffe-spec.md                     # BFFE API specification
├── cqrs-contract.md                 # CQRS commands and queries
└── ...

temp/
└── step-definition-scaffolds.txt    # Generated scaffolds

reports/
├── cucumber_report.html             # HTML test report
└── cucumber_report.json             # JSON test report
```

## Domain Model Reference

Before implementing any domain logic, read the relevant Domain Model documentation:

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

All resource identifiers MUST be UUIDs. Never use numeric or string IDs.

```gherkin
# Correct
Scenario: Get application by ID
  When the client sends a GET request to "/applications/550e8400-e29b-41d4-a716-446655440000"

# Incorrect
Scenario: Get application by ID
  When the client sends a GET request to "/applications/123"
```

## Queue-Based Processing Patterns

For async operations that publish to Azure Service Bus:

```gherkin
@backend @async @queue
Scenario: Long-running patent analysis is processed asynchronously
  Given Alice has submitted a patent application for analysis
  When the client sends a POST request to "/analysis/start" with:
    | applicationId | 550e8400-e29b-41d4-a716-446655440000 |
  Then the response status should be 202 Accepted
  And the response body should contain:
    | field    | value        |
    | jobId    | <uuid>       |
    | status   | queued       |
  And a "PatentAnalysisRequested" event should be published to the queue

@backend @async @worker
Scenario: Worker processes patent analysis from queue
  Given a "PatentAnalysisRequested" message exists in the queue with:
    | applicationId | 550e8400-e29b-41d4-a716-446655440000 |
    | requestedBy   | user-alice                           |
  When the worker processes the message
  Then the analysis should be completed
  And a "PatentAnalysisCompleted" event should be emitted
  And the job status should be updated to "completed"
```

## Project Test Commands (Backend)

Use the following Nx targets for ip-hub-backend:

```bash
# Unit tests
npx nx test ip-hub-backend                    # Single run
npx nx test:cov ip-hub-backend                # With coverage

# Integration tests
npx nx test:integration ip-hub-backend        # Jest integration tests

# BDD E2E tests
npx nx test:e2e ip-hub-backend                # Full run
npx nx test:e2e:local ip-hub-backend          # With Testcontainer (recommended for local)
npx nx test:e2e:tags ip-hub-backend -- '@wip' # Specific tags
npx nx test:e2e:watch ip-hub-backend          # Watch mode

# Pact contract verification (Provider)
npx nx pact-verify ip-hub-backend             # Verify from Pact Broker
npx nx pact-verify-local ip-hub-backend       # Verify locally
npx nx pact-can-deploy ip-hub-backend         # Check deployment safety
npx nx pact-record-deployment ip-hub-backend  # Record successful deployment
```

### Pact Broker Integration

The backend verifies contracts published by the frontend to the Pact Broker:

```bash
# Environment variables required
export PACT_BROKER_BASE_URL=https://pact-playground.dff-dna.belov.ai
export PACT_BROKER_USERNAME=<username>
export PACT_BROKER_PASSWORD=<password>
export PROVIDER_VERSION=$(git rev-parse HEAD)

# Verify contracts
npx nx pact-verify ip-hub-backend

# Check if safe to deploy
npx nx pact-can-deploy ip-hub-backend

# Record successful deployment
npx nx pact-record-deployment ip-hub-backend
```

## Best Practices

1. **Use the full workflow for new features**: The phases ensure thorough step definition development
2. **Answer clarifying questions thoughtfully**: Better context leads to better implementations
3. **Don't skip code review**: Phase 3 catches type safety issues and BDD violations
4. **Validate the Red phase**: Ensures tests fail for the right reasons before backend implementation
5. **Use factories for database seeding**: Never use direct SQL in step definitions

## BDD Red-Green-Refactor

This plugin focuses on the **Red** phase of TDD/BDD:

```
┌─────────────────────────────────────────────────────────────┐
│  1. RED (This Plugin)                                       │
│     Tests fail because backend implementation doesn't exist │
│     ↓                                                       │
│  2. GREEN (Backend Development)                             │
│     Implement backend to make tests pass                    │
│     ↓                                                       │
│  3. REFACTOR (Later)                                        │
│     Clean up code while keeping tests green                 │
└─────────────────────────────────────────────────────────────┘
```

## When to Use This Plugin

**Use for:**

- New backend E2E test suites
- Adding step definitions for new feature files
- Ensuring quality and type safety in step definitions
- Validating test infrastructure before backend implementation

**Don't use for:**

- Frontend/UI testing (use bdd-frontend-agents instead)
- Simple step definition fixes
- Feature file generation (use bdd-feature-agents instead)

## Requirements

- Claude Code installed
- Docker (for Testcontainers)
- Nx monorepo with NestJS backend
- Cucumber.js configured

## Troubleshooting

### Agents take too long

**Issue**: Agents are slow

**Solution**:

- This is normal for large codebases
- The thoroughness pays off in better test quality

### Tests fail with connection errors

**Issue**: `ECONNREFUSED 127.0.0.1:3000`

**Solution**:

- Ensure backend server is running
- Or configure Testcontainers to start the server
- Check BASE_URL environment variable

### Type errors in step definitions

**Issue**: TypeScript compilation fails

**Solution**:

- Run Phase 3 (Review) to identify type issues
- Ensure interfaces are defined in `support/types.ts`
- Import DTOs from contract libraries

### Tests pass when they shouldn't

**Issue**: Tests pass before backend is implemented

**Solution**:

- This indicates stub implementations (BDD violation)
- Run Phase 3 (Review) to identify missing assertions
- Ensure real assertions, not just logging

## Tips

- **Be specific about feature files**: More detail = fewer clarifying questions
- **Provide spec folder**: BFFE spec and CQRS contracts help implementation
- **Trust the process**: Each phase builds on the previous one
- **Review agent outputs**: Agents provide valuable insights about test patterns
- **Don't skip phases**: Each phase serves a purpose in the BDD workflow

## Author

Kerry Harris (kerry.harris@dna.co.nz)

## Version

1.1.0 - Added pact-provider-verifier agent, Domain Model reference, UUID requirements, queue patterns, Nx commands
