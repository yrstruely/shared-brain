---
description: Guided frontend feature implementation with MSW mocking, step definitions, and Pact contract generation
argument-hint: Provide the relevant feature files (e.g., apps/ip-hub-frontend/features/dashboard/*.feature) and BFFE spec location
---

> **Mono-repo context**: See `context/monorepo-context.md` for workspace layout and cross-app conventions.

# Frontend Feature Implementation

You are helping a developer implement BDD step definitions for existing Gherkin feature files. Follow a systematic approach: analyze API requirements, create MSW handlers, scaffold and implement step definitions, validate the BDD red phase, and generate Pact contracts for backend coordination.

## Core Principles

- **Ask clarifying questions**: Identify all ambiguities about feature files, BFFE specs, or implementation details. Ask specific, concrete questions rather than making assumptions. Wait for user answers before proceeding.
- **Understand before acting**: Read and comprehend existing feature files, BFFE specs, and step definition patterns first
- **Read files identified by agents**: When launching agents, ask them to return lists of the most important files to read. After agents complete, read those files to build detailed context before proceeding.
- **Use BFFE spec as authoritative source**: All MSW handlers and Pact contracts must match the BFFE specification
- **For Combined specs**: Also reference Architecture Specification for API contract alignment
- **Use TodoWrite**: Track all progress throughout
- **Validate at each phase**: Ensure each phase completes successfully before proceeding

---

## Phase 0: Detect Spec Type

**Goal**: Determine if Architecture Specification should be referenced

**Actions**:

1. **Check for Architecture Specification**:

   - Check for `specs/frontend/<FEATURE-FOLDER>/(Architecture/cqrs-contract/)` folder
   - If found, this is a **Combined** spec type
   - If not found, this is a **UI** spec type

2. **For Combined specs**:

   - Read the Architecture Specification file
   - Extract API contracts that MSW handlers must match
   - Note this context for later phases

3. **Report to User**:

   - Inform user of detected spec type
   - If Architecture Specification found, confirm it should be used

4. **Check for Centralized Backend API Specs**:

   - Check if `specs/backend/api/` folder exists in the target project
   - If found, list all `.yaml` files available
   - Confirm with user which spec files are relevant to this feature
   - Create the feature's discrepancy report folder: `specs/backend/api/<<CURRENT-FEATURE>>/`
   - Pass `backendApiSpecs` path to all subsequent agents

5. **Report to User**:
   - Inform user of detected spec type
   - List centralized API spec files found
   - If Architecture Specification found, confirm it should be used
   - **Proceed to Phase 1**

---

## Phase 1: Analyze API Requirements

**Goal**: Extract API requirements from Gherkin scenarios and cross-reference with BFFE spec

**User Prompt**: Initial request and user specified: feature files and BFFE spec location: $ARGUMENTS

**Agent**: Use the API Requirements Analyzer Agent for this Phase

**Actions**:

1. Create todo list with all phases
2. If feature files or BFFE spec location is unclear, ask user for:
   - Which feature files to analyze?
   - Where is the BFFE specification?
   - What domain/area are we implementing?
3. Run the API Requirements Analyzer Agent to extract API requirements
4. Review the generated `temp/api-requirements-analysis.md`
5. Verify all scenarios are covered and endpoints match BFFE spec
   5.5. Review the centralized API spec alignment findings in the analysis
   5.6. Check that `specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md` was created with initial findings
6. Ask the user to review the analysis for accuracy
7. **Wait for answers before proceeding to Phase 2**

---

## Phase 2: Generate MSW Handlers

**Goal**: Create Mock Service Worker handlers from the API requirements analysis

**CRITICAL**: DO NOT SKIP this phase. MSW handlers are required for step definitions to work.

**User Prompt**: Initial request and user specified: feature files and BFFE spec location (if not given use the ones from Phase 1): $ARGUMENTS

**Agent**: Use the MSW Handler Generator Agent for this Phase

**Actions**:

1. If the API requirements analysis doesn't exist, return to Phase 1
2. Run the MSW Handler Generator Agent to create handlers
3. Verify handlers are created in `apps/ip-hub-frontend/test/msw/handlers/`
4. Confirm handlers are registered in `apps/ip-hub-frontend/test/msw/handlers/index.ts`
5. Run TypeScript compiler (`tsc --noEmit`) to verify no type errors
6. Summarize the created handlers and ask user to review
7. **Wait for answers before proceeding to Phase 3**

If the user says "whatever you think is best", provide your recommendation and get explicit confirmation.

---

## Phase 3: Scaffold Step Definitions

**Goal**: Generate step definition scaffolds from feature files by running Cucumber.js dry-run

**User Prompt**: Initial request and user specified: feature files (if not given use the ones from Phase 2): $ARGUMENTS

**Agent**: Use the Step Definition Scaffolder Agent for this Phase

**Actions**:

1. Run the Step Definition Scaffolder Agent
2. Review the dry-run output to identify undefined steps
3. Verify scaffolds are created in `apps/ip-hub-frontend/features/step-definitions/`
4. Check scaffolds are grouped by domain appropriately
5. Run TypeScript compiler to verify scaffolds compile
6. Summarize the scaffolds and ask user to review
7. **Wait for answers before proceeding to Phase 4**

---

## Phase 4: Implement Step Definitions

**Goal**: Implement step definitions with Playwright using MSW-mocked APIs

**CRITICAL**: DO NOT SKIP this phase. Implementation is the core of BDD test automation.

**User Prompt**: Initial request and user specified: scaffold files and feature files (if not given use the ones from Phase 3): $ARGUMENTS

**Agent**: Use the Step Definition Implementer Agent for this Phase

**Actions**:

1. If scaffolds don't exist, return to Phase 3
2. Run the Step Definition Implementer Agent
3. Verify all scaffolds have implementations (no `throw new Error('Not implemented')` remaining)
4. Ensure proper use of:
   - `@playwright/test` expect (NOT Chai)
   - `toTestId()` helper for data-testid conversion
   - MSW-mocked APIs (NOT `server/api/` endpoints)
   - Proper TypeScript types (no `any`)
5. Run TypeScript compiler to verify no type errors
6. Summarize implementations and ask user to review
7. **Wait for answers before proceeding to Phase 5**

If the user says "whatever you think is best", provide your recommendation and get explicit confirmation.

---

## Phase 5: Review Step Definitions

**Goal**: Review and improve step definitions based on user feedback or self-review

**CRITICAL**: DO NOT SKIP this phase. User review and refinement is essential.

**User Prompt**: Initial request and user specified: changed step definition files (if not given use the ones from Phase 4): $ARGUMENTS

**Agent**: Use the Step Definition Reviewer Agent for this Phase

**Actions**:

1. Review the relevant step definition files for comments/changes (if the user hasn't provided any changes do your own review, provide your recommendation and get explicit confirmation.)
2. If any user comments/changes are unclear, ask user for clarifications
3. Create todo list with all review items
4. Evaluate changes against project standards:
   - TypeScript type safety
   - Playwright best practices
   - BDD alignment
   - Code quality
5. Apply improvements or fix regressions
6. Summarize the review findings and changes
7. **Wait for answers before proceeding to Phase 6**

If the user says "whatever you think is best", provide your recommendation and get explicit confirmation.

---

## Phase 6: Validate BDD Red Phase

**Goal**: Verify step definitions fail appropriately before application code exists (BDD "Red" phase)

**User Prompt**: Initial request and user specified: feature files (if not given use the ones from Phase 5): $ARGUMENTS

**Agent**: Use the BDD Red Phase Validator Agent for this Phase

**Actions**:

1. Run the BDD Red Phase Validator Agent
2. Analyze failure categories:
   - **Expected Failures**: Missing application code (good - BDD Red phase working)
   - **Unexpected Failures**: Test issues that need fixing
   - **Unexpected Passes**: Tests passing without real implementation (investigate)
3. If unexpected failures exist, fix them before proceeding
4. Generate implementation roadmap from expected failures
5. Summarize the validation results
6. Ask user to confirm ready to proceed to Pact generation
7. **Wait for answers before proceeding to Phase 7**

---

## Phase 7: Generate Pact Contracts

**Goal**: Generate consumer-driven contracts from MSW handlers for backend coordination

**User Prompt**: Initial request and user specified: MSW handlers directory and BFFE spec (if not given use the ones from previous phases): $ARGUMENTS

**Agent**: Use the Pact Contract Generator Agent for this Phase

**Actions**:

1. Verify MSW handlers exist and are registered
2. Run the Pact Contract Generator Agent
3. Review generated contracts in `apps/ip-hub-frontend/test/pact/pacts/`
4. Cross-check contracts against BFFE spec for compliance
5. Summarize the generated contracts
6. Ask the user to review the contracts
7. **Wait for answers before proceeding to Phase 8**

---

## Phase 8: Validate MSW-Pact Sync

**Goal**: Validate that MSW handlers and Pact contracts are in sync with BFFE spec

**CRITICAL**: DO NOT SKIP this phase. Validation ensures contract accuracy before publication.

**User Prompt**: Initial request and user specified: MSW handlers and Pact contracts (if not given use the ones from Phase 7): $ARGUMENTS

**Agent**: Use the Pact Sync Validator Agent for this Phase

**Actions**:

1. Run the Pact Sync Validator Agent
2. Review validation results:
   - All structures match between MSW and Pact
   - BFFE spec cross-validation passed
3. If mismatches found:
   - Fix MSW handlers to match BFFE spec
   - Regenerate Pact contracts
   - Re-validate
4. On success, provide:
   - Version management guidance
   - Publication instructions
   - Backend team notification template
5. Summarize validation status
6. **Wait for answers before proceeding to Phase 9**

If the user says "whatever you think is best", provide your recommendation and get explicit confirmation.

### Cross-App Pact Verification (Regression Check)

After MSW-Pact sync passes, run local Pact provider verification:

```bash
pnpm run pact:verify:local-to-local
```

**Interpret results with outside-in context**:

- **Existing contract passes** → Backend still satisfies previous frontend contracts (good)
- **Existing contract fails** → REGRESSION - backend broke a previous contract (investigate)
- **New contract fails** → EXPECTED - backend hasn't implemented this yet (this is the backend's Red phase roadmap)

Report the new failing contracts as the "Backend Implementation Roadmap" in the summary.

---

## Phase 8.5: Review API Spec Discrepancies

**Goal**: Review and resolve discrepancies between centralized API specs, feature BFFE specs, and Pact contracts

**Actions**:

1. Read the discrepancy report at `specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md`
2. Present findings to user categorized by action type:
   - **MSW handlers to update**: Endpoints where MSW/Pact doesn't match centralized spec
   - **Centralized API specs to update**: New endpoints or schema changes needed in `specs/backend/api/*.yaml`
   - **Feature BFFE specs to update**: Outdated feature specs that need alignment
3. Ask user to confirm resolution approach for each category
4. If MSW handlers need updating:
   - Return to Phase 2 to update handlers
   - Regenerate Pact contracts (Phase 7)
   - Re-validate (Phase 8)
5. Document final resolution decisions in the discrepancy report
6. **Wait for answers before proceeding to Phase 9**

---

## Phase 9: Summarize

**Goal**: Document what was accomplished

**Actions**:

1. Mark all todos complete
2. Summarize:
   - What was built (MSW handlers, step definitions, Pact contracts)
   - Key decisions made
   - Files created/modified
   - API spec discrepancy report (`specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md`)
   - Required updates to centralized API specs
   - Implementation roadmap (what frontend code needs to be built)
   - Suggested next steps:
     - Implement frontend application code to make tests pass (BDD Green phase)
     - Publish Pact contracts for backend team
     - Run full test suite after implementation
     - The new Pact contracts define what backend needs to implement
     - Use `dna-bdd-backend-features` to scaffold backend step definitions
     - Use `dna-tdd-backend` to implement backend code to satisfy the contracts
     - Review and apply centralized API spec updates documented in discrepancy report
     - Share discrepancy report with backend team alongside Pact contracts

---
