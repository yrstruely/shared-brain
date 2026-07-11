# TDD Backend Agents Plugin

A comprehensive, structured workflow for Test-Driven Development (TDD) with NestJS backends using CQRS and Domain-Driven Design (DDD) patterns. Specialized agents guide you through: generating failing tests, implementing code to pass, validating results, and refactoring for quality.

## Overview

The TDD Backend Agents Plugin provides a systematic Red-Green-Clean approach to building backend features. Instead of jumping straight into implementation, it guides you through writing tests first, implementing minimal code to pass, and then refactoring—resulting in well-tested, maintainable code that follows DDD best practices.

## Philosophy

Building backend features with TDD requires discipline:

- **Write tests first** (Red) before any implementation
- **Implement minimally** (Green) just enough to pass tests
- **Validate thoroughly** before declaring success
- **Refactor safely** (Clean) while tests protect you
- **Follow DDD patterns** for maintainable architecture

This plugin embeds these practices into a structured workflow that runs automatically when you use the `/dna-tdd-backend:dna-tdd-backend` command.

## Command: `/dna-tdd-backend:dna-tdd-backend`

Launches a guided TDD development workflow with 7 distinct phases.

**Usage:**

```bash
/dna-tdd-backend:dna-tdd-backend apps/ip-hub-backend/test/e2e/features/dashboard.feature "View dashboard summary"
```

Or simply:

```bash
/dna-tdd-backend:dna-tdd-backend
```

The command will guide you through the entire process interactively.

## The 7-Phase Workflow

### Phase 1: Red - Generate Failing Tests

**Goal**: Analyze the BDD scenario and generate comprehensive tests that will fail

**What happens:**

- Reads the feature file and analyzes the scenario
- Asks clarifying questions about requirements
- Generates unit tests for value objects, entities, handlers, mappers
- Generates integration tests for API endpoints
- Creates/updates test factories
- Runs tests to confirm Red state (all fail)

**Example:**

```
You: /dna-tdd-backend:dna-tdd-backend apps/ip-hub-backend/test/e2e/features/dashboard.feature "View summary"
Claude: Let me analyze this scenario and generate failing tests...
```

### Phase 2: Review Generated Tests

**Goal**: Review and refine generated tests based on user feedback

**What happens:**

- Presents generated tests for review
- Incorporates user feedback
- Identifies missing edge cases
- Confirms final test suite

### Phase 3: Green - Implement Code

**Goal**: Implement minimal code to make all failing tests pass

**What happens:**

- Implements Domain Layer (value objects, entities, interfaces)
- Implements Infrastructure Layer (ORM entities, mappers, repositories)
- Implements Application Layer (handlers, DTO mappers)
- Implements API Layer (controllers, module registration)
- Runs tests after each layer

### Phase 4: Validate - Confirm Green Status

**Goal**: Comprehensively validate all tests pass and DDD architecture is correct

**What happens:**

- Validates DDD architecture compliance
- Runs all test suites (unit, integration, E2E)
- Checks for regressions in existing features
- Generates validation report

### Phase 5: Clean - Refactor Code (Optional)

**Goal**: Improve code quality while maintaining test compliance

**What happens:**

- Analyzes code for refactoring opportunities
- Generates prioritized refactoring plan
- Executes refactorings incrementally with test verification
- Documents suggested tests for future Red phases

### Phase 6: Validate After Refactoring

**Goal**: Confirm all tests still pass after refactoring

**What happens:**

- Runs full test suite
- Verifies test counts match pre-refactor baseline
- Generates comparison report

### Phase 7: Summarize

**Goal**: Document what was accomplished

**What happens:**

- Generates comprehensive summary report
- Lists all files created/modified
- Documents key decisions
- Suggests next steps

## Agents

### `tdd-red-test-generator`

**Purpose**: Generates comprehensive failing tests from BDD scenarios

**Focus areas:**

- BDD scenario analysis
- Unit test generation (value objects, entities, handlers, mappers)
- Integration test generation (API endpoints)
- Test factory creation
- DDD architecture compliance

**When triggered:**

- Automatically in Phase 1
- Can be invoked manually for additional test scenarios

**Output:**

- Unit test files (`*.spec.ts`)
- Integration test files (`*.integration.spec.ts`)
- Test factories

### `tdd-green-implementer`

**Purpose**: Implements minimal code to make tests pass following DDD patterns

**Focus areas:**

- Domain Layer implementation (value objects, entities, repository interfaces)
- Infrastructure Layer implementation (ORM entities, mappers, repositories)
- Application Layer implementation (handlers, DTO mappers)
- API Layer implementation (controllers, modules)
- Strict DDD architecture compliance

**When triggered:**

- Automatically in Phase 3
- Can be invoked manually for implementation work

**Output:**

- Domain entities and value objects
- Infrastructure components
- CQRS handlers
- API controllers and modules

### `tdd-green-validator`

**Purpose**: Validates all tests pass and architecture is correct

**Focus areas:**

- DDD architecture validation
- Comprehensive test execution
- Regression detection
- Code quality checks (TypeScript, lint)

**When triggered:**

- Automatically in Phases 4 and 6
- Can be invoked manually to validate current state

**Output:**

- Validation report with test results
- Architecture compliance status
- Regression analysis

### `tdd-clean-refactorer`

**Purpose**: Refactors code while maintaining test compliance

**Focus areas:**

- Handler simplification (extract to domain services)
- Primitive obsession → value objects
- Anemic → rich domain model
- Domain event extraction
- Specification pattern for complex queries
- Repository query extraction

**When triggered:**

- Automatically in Phase 5 (if user opts in)
- Can be invoked manually for refactoring work

**Output:**

- Refactored code with improved structure
- Suggested tests for discovered edge cases
- Refactoring report

## Usage Patterns

### Full workflow (recommended for new features):

```bash
/dna-tdd-backend:dna-tdd-backend apps/ip-hub-backend/test/e2e/features/dashboard.feature "View dashboard summary"
```

Let the workflow guide you through all phases.

### Workflow shortcuts:

```bash
# Full TDD cycle (Phases 1-7)
/dna-tdd-backend:dna-tdd-backend feature.feature "scenario" --shortcut=full

# Tests exist, implement only (Phases 3-4, 7)
/dna-tdd-backend:dna-tdd-backend feature.feature "scenario" --shortcut=implement

# Just run validation (Phase 4 only)
/dna-tdd-backend:dna-tdd-backend feature.feature "scenario" --shortcut=validate

# Tests pass, refactor only (Phases 5-6, 7)
/dna-tdd-backend:dna-tdd-backend feature.feature "scenario" --shortcut=refactor
```

### Manual agent invocation:

**Generate tests for a scenario:**

```
"Launch tdd-red-test-generator to create tests for the dashboard summary scenario"
```

**Implement code to pass tests:**

```
"Launch tdd-green-implementer to implement the dashboard feature"
```

**Validate current state:**

```
"Launch tdd-green-validator to check if all tests pass"
```

**Refactor existing code:**

```
"Launch tdd-clean-refactorer to improve the dashboard handler"
```

## DDD Architecture Enforced

The plugin enforces proper Domain-Driven Design patterns:

| Layer | Location | Components |
|-------|----------|------------|
| Domain | `libs/domain/src/` | Entities, Value Objects, Repository Interfaces, Events |
| Infrastructure | `app/{domain}/infrastructure/` | ORM Entities, Mappers, Repository Implementations |
| Application | `app/{domain}/` | Commands, Queries, Handlers, DTO Mappers |
| API | `bffe/` | Controllers |

**Key Rules:**

- Handlers use `@Inject(IRepository)` NOT `@InjectRepository`
- Value objects for all status/type fields
- Domain entities have behavior (not anemic)
- No imports from `test/` in production code

## Best Practices

1. **Follow the Red-Green-Clean cycle**: Tests first, implementation second, refactoring third
2. **Answer clarifying questions thoughtfully**: Better context leads to better tests
3. **Don't skip validation**: Confirms tests pass for the right reasons
4. **Refactor incrementally**: One change at a time with test verification
5. **Review suggested tests**: Edge cases discovered during refactoring are valuable

## When to Use This Plugin

**Use for:**

- New backend features following TDD
- API endpoints with complex business logic
- Features requiring DDD architecture
- Scenarios where test coverage is critical

**Don't use for:**

- Simple CRUD operations
- Trivial configuration changes
- Urgent hotfixes
- Features with existing comprehensive tests

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

# Code quality
npx tsc --noEmit -p apps/ip-hub-backend/tsconfig.app.json
npx nx lint ip-hub-backend
```

## Code Coverage Validation

Run coverage and verify thresholds:

```bash
npx nx test:cov ip-hub-backend
```

Coverage targets (from project standards):
- **Unit Tests**: >= 95% (business logic)
- **Integration Tests**: >= 90% (critical paths)
- **Contract Tests**: 100% (all inter-service APIs)

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

```typescript
// Correct - using UUID
const applicationId = '550e8400-e29b-41d4-a716-446655440000'
await this.applicationRepository.findById(applicationId)

// Incorrect - never use numeric IDs
const applicationId = 123
```

## Requirements

- Claude Code installed
- NestJS project with CQRS setup
- Jest/Vitest for testing
- Testcontainers for integration tests
- Cucumber for E2E tests
- Git repository

## Troubleshooting

### Tests fail unexpectedly

**Issue**: Tests that should pass are failing

**Solution:**

- Check if module is registered in AppModule
- Verify ORM entity is in test-database.ts ALL_ENTITIES
- Confirm module is in test-app-factory.ts

### DDD validation errors

**Issue**: Validator reports architecture issues

**Solution:**

- Ensure handlers use `@Inject(IRepository)` not `@InjectRepository`
- Move ORM entities from `test/shared/entities/` to `app/{domain}/infrastructure/`
- Add value objects for status/type fields

### Integration tests timeout

**Issue**: Tests take too long or hang

**Solution:**

- Ensure Testcontainers is properly configured
- Check database cleanup between tests
- Verify `@database` tag is on feature files

## Tips

- **Be specific in your scenario**: More detail = fewer clarifying questions
- **Trust the Red-Green-Clean cycle**: Each phase builds on the previous one
- **Review generated tests**: Agents provide comprehensive coverage
- **Don't skip validation**: Confirms architecture compliance
- **Use refactoring wisely**: Only when code quality improvements are needed

## Author

Kerry Harris (kerry.harris@dna.co.nz)

## Version

1.1.0 - Added Domain Model reference, UUID requirements, coverage validation, Nx commands
