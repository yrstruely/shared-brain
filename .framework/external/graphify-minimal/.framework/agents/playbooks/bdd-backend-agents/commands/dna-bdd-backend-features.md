---
description: Guided backend E2E step definition development with BDD workflow (scaffold, implement, review, validate)
argument-hint: Provide the feature file path and optional spec folder (e.g., apps/ip-hub-backend/test/e2e/features/dashboard/*.feature specs/02-dashboard-overview/)
---

# Backend BDD Step Definition Development

See context/monorepo-context.md for mono-repo paths and commands.

You are helping a developer implement backend E2E step definitions for Cucumber.js tests. Follow the systematic BDD workflow: scaffold undefined steps, implement them with Axios and Testcontainers, review for quality, and validate the Red phase (tests should fail until backend is implemented).

## Core Principles

- **Ask clarifying questions**: Identify all ambiguities about feature files, API endpoints, and test data setup. Ask specific questions rather than making assumptions. Wait for user answers before proceeding.
- **Understand before acting**: Read and comprehend existing step definition patterns, World object structure, and support files first
- **Read files identified by agents**: When launching agents, ask them to return lists of important files to read. After agents complete, read those files to build detailed context.
- **Architecture Specification as Primary Source**: For Technical/Combined specs, Architecture Specification defines API contracts
- **BDD Red-Green-Refactor**: Tests MUST fail (Red) before backend implementation. No stub implementations that just log and pass.
- **Use TodoWrite**: Track all progress throughout each phase
- **Type Safety**: All step definitions must use proper TypeScript types, no `any`
- **Factory Pattern**: Use Testcontainers factories for database seeding, never direct SQL
- **No auth endpoints**: Authentication is handled by oauth2-proxy at ingress. Step definitions should include `x-forwarded-access-token` header but NEVER test backend auth implementation.

---

## Phase 0: Detect Spec Type and Load Architecture

**Goal**: Determine spec type and load Architecture Specification from feature's spec folder

**Actions**:

1. **Read BDD Guidelines** (REQUIRED before any other work):

   - Read `documentation/technical-project-context/backend-testing/BDD-GUIDELINES.md` — Defines what to test at BDD level (API E2E only, no separate CQRS features, no perf SLAs) and what belongs in unit tests instead
   - Read `documentation/technical-project-context/backend-testing/bdd_feature_writing_guidelines.md` — Gherkin best practices, step definition patterns, atomic test pattern, tagging strategy
   - Pass these guidelines context to all subsequent agents

2. **Detect Spec Type** by checking folders in `specs/backend/<FEATURE-FOLDER>/`:

   - Check for `(Architecture/cqrs-contract/)` folder → indicates Technical or Combined
   - Check for `UI/` folder → indicates UI or Combined
   - Check if feature files have `@architecture-aligned` tag

3. **Verify Self-Contained Spec Folder**:
   - Architecture specs should be in `specs/backend/<FEATURE-FOLDER>/(Architecture/cqrs-contract/)`
   - If `(Architecture/cqrs-contract/)` folder is missing but needed, prompt user to copy from master:
     ```
     cp documentation/Architecture\ Specification/<feature>-architecture.md \
        specs/backend/<FEATURE-FOLDER>/(Architecture/cqrs-contract/)
     ```
   - Note: `documentation/` is located at the mono-repo root

2.5. **Check Centralized Backend API Specs**:

- Check if `specs/backend/api/` folder exists
- List all `.yaml` files available
- Identify which spec files contain endpoints relevant to this feature
- Check for existing discrepancy report at `specs/backend/api/<FEATURE>/api-spec-discrepancies.md`
- If discrepancy report exists (created by frontend workflow): read it and understand prior findings
- Pass `backendApiSpecs` path and discrepancy report path to subsequent phases

3. **For Technical/Combined Specs**:

   - **Read Architecture Specification FIRST** from `specs/backend/<FEATURE-FOLDER>/(Architecture/cqrs-contract/)`
   - Extract:
     - API endpoints and contracts
     - CQRS command/query definitions
     - Domain event catalog
     - Error response formats
   - This context guides ALL subsequent phases

4. **Report to User**:
   - Display detected spec type
   - List files in `specs/backend/<FEATURE-FOLDER>/(Architecture/cqrs-contract/)` folder
   - Confirm before proceeding

---

## Phase 1: Generate Step Definition Scaffolds

**Goal**: Run Cucumber.js dry-run to identify undefined steps and generate scaffold files

**User Prompt**: Feature file path and optional spec folder: $ARGUMENTS

**Agent**: Use the BDD Backend Step Definition Scaffolder Agent for this Phase

**Actions**:

1. Create todo list with all phases
2. If feature file path is unclear, ask user for:
   - Which feature file(s) to scaffold?
   - Which app's E2E directory? (e.g., `apps/ip-hub-backend/test/e2e/`)
   - What domain name for step definition files? (e.g., `dashboard`, `application`)
3. Run Cucumber.js dry-run to capture undefined steps
4. Generate scaffold files with placeholder implementations
5. Summarize:
   - Number of undefined steps found
   - Files created in `step-definitions/` directory
   - Scaffold output saved to `temp/step-definition-scaffolds.txt`
6. Ask user to review scaffold output before implementation
7. **Wait for confirmation before proceeding to Phase 2**

---

## Phase 2: Implement Step Definitions

**Goal**: Transform scaffold placeholders into complete step definition implementations using Axios, Jest, and Testcontainers

**User Prompt**: Scaffold file and spec documents (if not given, use from Phase 1): $ARGUMENTS

**Agent**: Use the BDD Backend Step Definition Implementer Agent for this Phase

**Actions**:

1. Read specifications in priority order:
   1. **Centralized API Specs** (`specs/backend/api/*.yaml`) — For existing endpoints
   2. **Frontend Pact Contracts** — What frontend actually needs
   3. **Feature BFFE Spec** (`specs/backend/<FEATURE>/bffe-spec.md`) — Feature-specific requirements
   4. **CQRS Contract** — Command/query patterns
   5. **Frontend discrepancy report** (`specs/backend/api/<FEATURE>/api-spec-discrepancies.md`) — Prior findings
2. If any specs are missing or unclear, ask user for:
   - Where is the BFFE spec? (e.g., `specs/backend/02-dashboard-overview/bffe-spec.md`)
   - What API base URL should be used?
   - Any authentication requirements?
3. Implement each step definition:
   - Given steps: Database seeding via factories
   - When steps: API calls via Axios with authentication
   - Then steps: Assertions via Jest expect
4. Create/update TypeScript interfaces in `support/types.ts`
5. Summarize:
   - Number of steps implemented
   - Files created/modified
   - Any assumptions made
6. Ask user to review implementations
7. **Wait for confirmation before proceeding to Phase 3**

---

## Phase 3: Review Step Definitions

**Goal**: Review implemented step definitions for quality, type safety, and BDD compliance

**CRITICAL**: DO NOT SKIP this phase. Quality review is essential for maintainable tests.

**User Prompt**: Step definition files to review (if not given, use from Phase 2): $ARGUMENTS

**Agent**: Use the BDD Backend Step Definition Reviewer Agent for this Phase

**Actions**:

1. Review all implemented step definition files for:
   - TypeScript type safety (no `any` types)
   - Axios best practices (error handling, auth headers)
   - BDD alignment (real assertions, not stubs)
   - BFFE spec compliance (correct endpoints, payloads)
   - Factory usage (proper database seeding)
2. If user hasn't provided specific feedback, do your own review
3. Create todo list with all issues found
4. Fix issues or provide specific recommendations
5. Summarize:
   - Improvements made
   - Remaining issues (if any)
   - Quality assessment
6. **Wait for confirmation before proceeding to Phase 4**

If the user says "whatever you think is best", provide your recommendations and get explicit confirmation.

---

## Phase 4: Validate Red Phase

**Goal**: Run tests to verify step definitions fail correctly (before backend implementation exists)

**User Prompt**: Feature files to validate (if not given, use from Phase 1): $ARGUMENTS

**Agent**: Use the BDD Backend Red Phase Validator Agent for this Phase

**Actions**:

1. Ensure prerequisites:
   - Docker running (for Testcontainers)
   - TypeScript compiles (`tsc --noEmit`)
   - No undefined steps (dry-run passes)
2. Run Cucumber tests expecting failures
3. Analyze each failure:
   - **Expected failures**: 404, empty data, assertion mismatches (Ready for backend)
   - **Unexpected failures**: TypeError, 401, 500 (Step definition bugs)
4. If unexpected failures found:
   - Document the issues
   - Return to Phase 3 to fix step definitions
5. Generate HTML report at `reports/cucumber_report.html`
6. Summarize:
   - Total scenarios and failure breakdown
   - Which scenarios are ready for backend implementation
   - Any issues requiring attention
7. **Wait for confirmation before proceeding to Phase 5**

---

## Phase 4.5: Review API Spec Alignment

**Goal**: Ensure backend implementation aligns with centralized API specs and resolve any remaining Pact contract discrepancies

**Actions**:

1. Read the discrepancy report at `specs/backend/api/<FEATURE>/api-spec-discrepancies.md`
2. Verify backend step definition implementations align with resolution decisions documented in the report
3. If new discrepancies were found during implementation:
   - Append them to the discrepancy report (Section 4)
   - Document proposed centralized spec updates
4. Present the complete discrepancy report to the user:
   - Endpoints aligned with centralized spec
   - Endpoints diverging from centralized spec (with reasons)
   - Proposed centralized spec YAML updates
   - Pact contracts that may need frontend updates
5. Ask user to confirm resolution decisions
6. **Wait for confirmation before proceeding to Phase 5**

---

## Phase 5: Summarize and Handoff

**Goal**: Document what was accomplished and prepare handoff for backend implementation

**Actions**:

1. Mark all todos complete
2. Summarize:
   - **What was built**: Step definition files created
   - **Key decisions made**: Patterns used, assumptions documented
   - **Files modified**: List all created/modified files
   - **Test status**: Red phase validated, ready for backend
   - **API spec alignment**: Discrepancy report at `specs/backend/api/<FEATURE>/api-spec-discrepancies.md`
3. Prepare handoff documentation:
   - List of failing scenarios (what backend needs to implement)
   - API endpoints needed (from BFFE spec)
   - Domain events to emit (from CQRS contract)
   - Test report location: `reports/cucumber_report.html`
   - Discrepancy report with all backend implementation decisions
   - Proposed updates to centralized API specs (`specs/backend/api/*.yaml`)
   - Any Pact contracts requiring frontend updates
4. Suggested next steps:
   - Backend implementation to make tests pass (Green phase)
   - Re-run tests after each endpoint is implemented
   - Refactor once all tests pass (Refactor phase)
   - Apply proposed centralized API spec updates via PR
   - Share discrepancy report with frontend team if Pact updates needed

---

## Quick Reference: Agent Selection

| Phase | Agent                       | Purpose                               |
| ----- | --------------------------- | ------------------------------------- |
| 1     | Step Definition Scaffolder  | Generate scaffolds from dry-run       |
| 2     | Step Definition Implementer | Implement with Axios/Jest/Factories   |
| 3     | Step Definition Reviewer    | Review for quality and BDD compliance |
| 4     | Red Phase Validator         | Verify tests fail correctly           |

---

## File Structure Reference

```
apps/<<APP>>/test/e2e/
├── features/
│   └── <<feature>>.feature          # Gherkin feature files
├── step-definitions/
│   ├── common-steps.ts              # Shared authentication, navigation
│   ├── <<domain>>-steps.ts          # Domain-specific steps
│   └── ...
└── support/
    ├── world.ts                     # Custom World class
    ├── hooks.ts                     # Before/After hooks
    ├── types.ts                     # TypeScript interfaces
    ├── helpers.ts                   # Utility functions
    └── factories/                   # Test data factories

cucumber.js                          # Root-level Cucumber configuration

specs/backend/<<spec-folder>>/
├── bffe-spec.md                     # BFFE API specification
├── cqrs-contract.md                 # CQRS commands and queries
├── core-services-spec.md            # Core service specifications
├── non-functional-requirements.md   # NFR specifications
└── (Architecture/cqrs-contract/)                    # Architecture specifications
    └── <<feature>>-architecture.md

specs/backend/api/
├── README.md                        # API specs overview
├── existing_cleanup.yaml            # Current backend API (legacy)
├── ipams.yaml                       # Application Builder BFFE
├── submissions.yaml                 # Submission & Packaging BFFE
├── swagger.html                     # Swagger UI viewer
└── <<CURRENT-FEATURE>>/            # Per-feature discrepancy reports
    └── api-spec-discrepancies.md    # Alignment report for this feature

temp/
└── step-definition-scaffolds.txt    # Generated scaffolds

reports/
├── cucumber_report.html             # HTML test report
└── cucumber_report.json             # JSON test report
```
