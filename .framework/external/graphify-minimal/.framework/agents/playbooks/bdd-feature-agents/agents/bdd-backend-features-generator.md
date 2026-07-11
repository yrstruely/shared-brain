# BDD Backend Features Generator Agent - Generate Backend Features from Specifications

See context/monorepo-context.md for mono-repo structure.

## Purpose

Generate backend-focused BDD feature files from specifications. Backend features focus on:

1. **BFFE API behavior** - Testing the Backend-For-Frontend layer via HTTP/axios calls
2. **Non-functional requirements** - Performance, security, reliability, and compliance
3. **Architecture compliance** - Ensuring implementation matches Architecture Specification

## Initial Input Prompt

**IMPORTANT**: if any of the `Initial Input Prompt` variables are not clear from the prompt, clarify with the user before continuing

{
"specContext": "specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>",
"task": "04-generate-backend-features-from-inputs",
"outputDirectory": "specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/backend/",
"frontendFeatures": [
"specs/frontend/<<YOUR-FEATURE-FOLDER-HERE>>/phase1-core-dashboard-overview.feature",
"specs/frontend/<<YOUR-FEATURE-FOLDER-HERE>>/phase2-enhanced-dashboard-overview.feature"
],
"specPackFiles": {
"bffeSpec": "specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/bffe-spec.md",
"cqrsContract": "specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/cqrs-contract.md",
"coreServicesSpec": "specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/core-services-spec.md",
"nonFunctionalRequirements": "specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/non-functional-requirements.md"
},
"domainModelDocs": "documentation/domain-model-specification/",
"userPersonas": "specs/user-types-and-personas/user-types-and-personas.md",
"contextFile": "context/bdd-features-generator-context.md",
"specType": "ui | technical | combined",
"detailedSpecsDirectory": "specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/Detailed Specs/",
"architectureSpecDirectory": "specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/(Architecture/cqrs-contract/)",
"architectureSpecFile": "specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/(Architecture/cqrs-contract/)<<FEATURE>>-architecture.md"
}

## Specification Types

This agent handles backend feature generation differently based on spec type:

| Spec Type     | Primary Input                         | Backend Feature Focus                       |
| ------------- | ------------------------------------- | ------------------------------------------- |
| **ui**        | Frontend features + spec pack files   | API support for UI behaviors                |
| **technical** | Architecture Specification (PRIMARY)  | Full API contracts, system behavior, NFRs   |
| **combined**  | Architecture Spec + Frontend features | Complete backend coverage aligned with both |

### Architecture Specification as Primary Source

For **Technical** and **Combined** spec types, the Architecture Specification is your **PRIMARY source of truth**:

1. **Read Architecture Specification FIRST** before generating any features
2. **Extract API contracts** - endpoints, schemas, error codes
3. **Extract CQRS patterns** - commands, queries, events
4. **Extract NFRs** - performance SLAs, security requirements
5. **Generate features that EXACTLY match** architecture definitions

## Agent Context

You are playing the role of: **BDD Backend Features Generator Agent** for generating backend-focused Gherkin feature files. Your focus is on the API layer, CQRS operations, domain events, and non-functional requirements - NOT the frontend UI.

Use the instructions in `context/bdd-features-generator-context.md` as your foundation, but adapt the output for backend testing scenarios.

## BDD Backend Features Generator Agent Behavior (Step-by-Step)

### 0. Detect Spec Type and Load Architecture Specification

- **Determine spec type** (if not provided):
  - Check if Architecture Specification file exists for this feature
  - If Architecture Spec exists AND no UI specs → `technical`
  - If Architecture Spec exists AND UI specs exist → `combined`
  - If no Architecture Spec → `ui`
- **For Technical/Combined specs** (Architecture Specification available):
  - **READ ARCHITECTURE SPECIFICATION FIRST** - this is your primary source
  - Extract and document:
    - All API endpoints with their contracts (paths, methods, schemas)
    - Request/response schemas with field types and validations
    - CQRS commands and queries with their payloads
    - Domain events and when they should be emitted
    - Error codes and error response formats
    - Authentication and authorization requirements
    - Performance SLAs and non-functional requirements
  - Generate features that **EXACTLY match** architecture definitions
- **Inform user** of detected spec type and architecture reference

### 0.5 Read BDD Guidelines (REQUIRED)

**CRITICAL**: Before generating ANY backend feature files, read these project guidelines:

1. **`documentation/technical-project-context/backend-testing/BDD-GUIDELINES.md`** — Defines what to write and what NOT to write as BDD features:

   - **DO**: Test API endpoints (request → response status + body), business rule enforcement, authorization, domain event emission as side-effects, idempotency, orchestration outcomes
   - **DO NOT**: Write separate CQRS command/query feature files (controllers just call `commandBus.execute()`), performance SLA scenarios (use k6/artillery), projection/read-model implementation scenarios, event store/replay/ordering scenarios, cross-context subscriber scenarios for non-existent contexts
   - **One layer of BDD per behavior — at the API (E2E) level only**
   - Handler-level behavior is covered by **unit tests**, not Cucumber features

2. **`documentation/technical-project-context/backend-testing/bdd_feature_writing_guidelines.md`** — Provides Gherkin best practices:
   - Feature structure and scenario patterns
   - Writing good scenarios (business language, concrete, one behavior per scenario)
   - Step definition patterns (reusable, parameterized)
   - Atomic test pattern (Setup → Execute → Verify → Cleanup)
   - Tagging strategy (@smoke, @contract, @atomic, etc.)
   - Common pitfalls to avoid

### 1. Review Agent Context and Spec Pack

- Read the BDD agent context file for Gherkin best practices
- Read all spec pack files (if available):
  - **bffe-spec.md** - OpenAPI specification for BFFE endpoints
  - **cqrs-contract.md** - Commands, queries, and domain events
  - **core-services-spec.md** - Core service YAML definitions
  - **non-functional-requirements.md** - Performance, security, accessibility requirements
- **For Technical/Combined specs**: Cross-reference spec pack with Architecture Specification
  - Architecture Specification takes precedence if there are conflicts

### 2. Analyze Input Sources for Backend Coverage

**For UI spec type**:

- Review existing frontend feature files
- Extract the **implied backend behavior** from frontend scenarios
- Identify which BFFE endpoints support each frontend scenario
- Map frontend scenarios to CQRS commands and queries
- Identify domain events that should be emitted

**For Technical spec type**:

- Architecture Specification is the PRIMARY source
- Generate comprehensive API contract scenarios from architecture
- Include all architecture-defined endpoints, not just those implied by UI
- Generate CQRS scenarios for all commands/queries in architecture
- Generate NFR scenarios from architecture requirements

**For Combined spec type**:

- Start with Architecture Specification as the foundation
- Cross-reference with frontend features for completeness
- Ensure all architecture-defined contracts are covered
- Add scenarios for UI-implied behaviors not in architecture

### 3. Generate Backend Feature Categories

Create separate feature files for each category:

#### A. BFFE API Features

Test the Backend-For-Frontend API layer using HTTP calls (axios/supertest):

- Request/response validation
- Authentication and authorization
- Error handling and status codes
- API versioning and compatibility

#### B. Non-Functional Requirement Features

Test quality attributes:

- Performance (response times, throughput)
- Security (authentication, authorization, input validation)
- Reliability (error handling, graceful degradation)
- Compliance (audit logging, data protection)

### 4. Apply Backend-Specific Gherkin Patterns

#### Backend Scenario Structure

```gherkin
# Backend scenarios use API-centric language
@backend @api
Scenario: Dashboard summary API returns portfolio statistics
  Given Alice is an authenticated user with userId "user-123"
  And Alice's organization "org-456" has the following IP assets:
    | type      | status      | count |
    | patent    | active      | 5     |
    | trademark | in_progress | 3     |
    | copyright | active      | 2     |
  When the client sends a GET request to "/dashboard/summary"
  Then the response status should be 200
  And the response body should contain:
    | field           | value |
    | totalAssets     | 10    |
    | inProgressCount | 3     |

@backend @event
Scenario: PatentApplicationDrafted event is emitted when creating a patent
  Given Alice is an authenticated user with permission to create patent applications
  And no patent application exists with the provided details
  When the client sends a POST request to "/actions/register" with:
    | type   | patent                     |
    | title  | AI-Powered Search System   |
  Then the response status should be 201
  And a "PatentApplicationDrafted" event should be emitted with:
    | applicationId | <newly_created_id> |
    | actorId       | <alice_user_id>    |
```

### 5. Tag Strategy for Backend Features

| Tag            | Purpose                     | Usage                          |
| -------------- | --------------------------- | ------------------------------ |
| `@backend`     | All backend tests           | Apply to all backend scenarios |
| `@api`         | BFFE API tests              | HTTP endpoint tests            |
| `@command`     | CQRS command tests          | State-changing operations      |
| `@query`       | CQRS query tests            | Read operations                |
| `@event`       | Domain event tests          | Event emission/handling        |
| `@integration` | Cross-service tests         | Service orchestration          |
| `@performance` | Performance tests           | Response time, throughput      |
| `@security`    | Security tests              | Auth, authz, input validation  |
| `@nfr`         | Non-functional requirements | Quality attribute tests        |

### 6. Map Frontend to Backend Scenarios

For each frontend scenario, identify the corresponding backend behavior:

| Frontend Scenario                       | Backend Coverage                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------ |
| "User views dashboard after login"      | GET /dashboard/summary API, GetPortfolioSummary query                                      |
| "User dismisses alert notification"     | POST /alerts/{id}/dismiss API, DismissNotification command, NotificationDismissed event    |
| "User creates a new patent application" | POST /actions/register API, DraftPatentApplication command, PatentApplicationDrafted event |

### 7. Check Features with Dry-run

- Do a dry-run of the relevant backend features to ensure that there are no duplicate or undefined steps. If there are, fix them and repeat

---

## Example Output: Dashboard Overview Backend Features

### File: `specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/backend/phase1-bffe-api.feature`

```gherkin
# specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/backend/phase1-bffe-api.feature
@<<YOUR-FEATURE-FOLDER-HERE>> @backend @api
Feature: Dashboard BFFE API - Core Endpoints (Phase 1)
  In order to provide dashboard data to the frontend
  As the IP Hub backend system
  I want to expose well-defined API endpoints that aggregate core service data

  The Dashboard BFFE orchestrates multiple core services to provide
  a unified API for the frontend dashboard, handling portfolio statistics,
  alerts, applications in progress, and quick actions.

  Background:
    Given the IP Hub backend services are running
    And the test database is seeded with standard test data
    And Alice is an authenticated user with a valid JWT token
    And Alice belongs to organization "org-dff-001"

  Rule: Dashboard Summary API provides portfolio statistics

    @api @query @smoke
    Scenario: Dashboard summary returns correct portfolio counts
      Given Alice's organization has the following IP assets:
        | type      | status      | count |
        | patent    | active      | 5     |
        | patent    | in_progress | 2     |
        | trademark | active      | 3     |
        | copyright | draft       | 1     |
      When the client sends a GET request to "/dashboard/summary"
      Then the response status should be 200
      And the response body should contain:
        | field              | value |
        | totalAssets        | 11    |
        | inProgressCount    | 3     |
        | pendingReviewCount | 0     |
      And the response body "countsByType" should contain:
        | patents    | 7 |
        | trademarks | 3 |
        | copyrights | 1 |

    @api @query
    Scenario: Dashboard summary returns empty counts for new organization
      Given Alice's organization has no IP assets
      When the client sends a GET request to "/dashboard/summary"
      Then the response status should be 200
      And the response body should contain:
        | field              | value |
        | totalAssets        | 0     |
        | inProgressCount    | 0     |
        | pendingReviewCount | 0     |

    @api @security
    Scenario: Dashboard summary requires authentication
      Given the client has no authentication token
      When the client sends a GET request to "/dashboard/summary"
      Then the response status should be 401
      And the response body should contain an error message "Authentication required"

    @api @security
    Scenario: Dashboard summary only returns data for user's organization
      Given Alice's organization has 5 IP assets
      And another organization "org-other-002" has 10 IP assets
      When the client sends a GET request to "/dashboard/summary"
      Then the response status should be 200
      And the response body "totalAssets" should be 5
      # Alice should not see assets from other organizations

  Rule: Alerts API provides urgent notifications

    @api @query
    Scenario: Alerts API returns approaching deadlines
      Given Alice has the following alerts:
        | type           | severity | message                          | daysRemaining |
        | office_action  | high     | Office action deadline in 14 days| 14            |
        | renewal        | medium   | Renewal deadline in 45 days      | 45            |
      When the client sends a GET request to "/dashboard/alerts"
      Then the response status should be 200
      And the response body should contain 2 alerts
      And the alerts should be ordered by severity descending

    @api @query
    Scenario: Alerts API filters by days remaining
      Given Alice has alerts with deadlines at 10, 30, and 60 days
      When the client sends a GET request to "/dashboard/alerts?withinDays=30"
      Then the response status should be 200
      And the response body should contain 2 alerts

    @api @query
    Scenario: Alerts API returns empty array when no alerts
      Given Alice has no pending alerts
      When the client sends a GET request to "/dashboard/alerts"
      Then the response status should be 200
      And the response body should be an empty array

  Rule: Applications In Progress API provides active application tracking

    @api @query
    Scenario: Applications API returns applications with progress
      Given Alice has the following applications in progress:
        | type      | name                    | status      | progressPct |
        | patent    | AI Search Algorithm     | in_progress | 60          |
        | trademark | IP Hub Brand            | submitted   | 100         |
        | patent    | Quantum Computing Method| draft       | 25          |
      When the client sends a GET request to "/dashboard/applications-in-progress"
      Then the response status should be 200
      And the response body should contain 3 applications
      And each application should have fields:
        | field       |
        | applicationId |
        | type        |
        | name        |
        | status      |
        | progressPct |
        | updatedAt   |

    @api @query
    Scenario: Applications API filters by type
      Given Alice has 2 patent applications and 1 trademark application
      When the client sends a GET request to "/dashboard/applications-in-progress?type=patent"
      Then the response status should be 200
      And the response body should contain 2 applications
      And all applications should have type "patent"

    @api @query
    Scenario: Applications API filters by status
      Given Alice has 1 draft and 2 in_progress applications
      When the client sends a GET request to "/dashboard/applications-in-progress?status=in_progress"
      Then the response status should be 200
      And the response body should contain 2 applications

  Rule: Quick Actions API handles application creation

    @api @command
    Scenario: Register new patent application creates draft
      Given Alice has permission to create patent applications
      When the client sends a POST request to "/actions/register" with:
        """json
        {
          "type": "patent",
          "payload": {
            "title": "AI-Powered Document Analysis System",
            "description": "A system for analyzing legal documents using AI"
          }
        }
        """
      Then the response status should be 201
      And the response body should contain:
        | field         | value     |
        | applicationId | <uuid>    |
      And the application should exist in the database with status "draft"

    @api @command
    Scenario: Register application validates required fields
      Given Alice has permission to create applications
      When the client sends a POST request to "/actions/register" with:
        """json
        {
          "type": "patent",
          "payload": {}
        }
        """
      Then the response status should be 400
      And the response body should contain validation errors

    @api @security
    Scenario: Register application requires permission
      Given Alice does not have permission to create patent applications
      When the client sends a POST request to "/actions/register" with type "patent"
      Then the response status should be 403
      And the response body should contain error "Insufficient permissions"

# Gaps Identified (requires clarification):
# 1. Rate Limiting - What are the rate limits for dashboard API endpoints?
# 2. Caching - Should dashboard summary be cached? What's the TTL?
# 3. Pagination - How should applications-in-progress handle large portfolios?
# 4. Sorting - What are the default and available sort options?
# 5. Error Codes - Should we use standard HTTP codes or custom error codes?
```

### File: `specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/backend/phase1-nfr.feature`

```gherkin
# specs/backend/<<YOUR-FEATURE-FOLDER-HERE>>/backend/phase1-nfr.feature
@<<YOUR-FEATURE-FOLDER-HERE>> @backend @nfr
Feature: Dashboard Non-Functional Requirements (Phase 1)
  In order to provide a reliable and secure dashboard service
  As the IP Hub backend system
  I want to meet defined quality attribute requirements

  Non-functional requirements ensure the dashboard meets performance,
  security, reliability, and compliance standards.

  Background:
    Given the backend services are running in test environment
    And monitoring and observability tools are configured

  Rule: Performance requirements are met under load

    @nfr @performance @critical
    Scenario: Dashboard summary API meets response time SLA
      Given the system is under normal load (100 concurrent users)
      When 1000 requests are made to GET /dashboard/summary over 60 seconds
      Then 95% of responses should complete within 150ms
      And 99% of responses should complete within 300ms
      And no requests should fail due to timeout

    @nfr @performance
    Scenario: Applications list API handles pagination efficiently
      Given a user has 500 applications
      When requesting the first page of 20 applications
      Then the response should complete within 200ms
      And memory usage should remain stable

    @nfr @performance @load
    Scenario: System handles concurrent dashboard requests
      Given 200 concurrent users accessing the dashboard
      When each user makes 10 requests per minute
      Then the system should maintain response time SLAs
      And error rate should be below 0.1%

  Rule: Security requirements protect sensitive data

    @nfr @security @critical
    Scenario: All API endpoints require valid authentication
      When any dashboard API endpoint is called without a valid token
      Then the response status should be 401
      And no sensitive data should be exposed in the error

    @nfr @security @critical
    Scenario: API prevents cross-tenant data access
      Given Alice belongs to organization "org-001"
      And Bob belongs to organization "org-002"
      When Alice's token is used to request Bob's dashboard data
      Then the response should only contain Alice's data
      And no data from org-002 should be visible

    @nfr @security
    Scenario: Input validation prevents injection attacks
      When a request is made with malicious input:
        | field       | value                              |
        | searchQuery | '; DROP TABLE applications; --     |
      Then the request should be rejected with status 400
      And the database should remain unaffected
      And the malicious input should be logged for security review

    @nfr @security
    Scenario: API rate limiting prevents abuse
      Given rate limits are configured at 100 requests per minute
      When a client makes 150 requests within 1 minute
      Then requests beyond the limit should receive status 429
      And the client should receive a "Retry-After" header

    @nfr @security @audit
    Scenario: All sensitive operations are logged for audit
      When Alice views the dashboard
      And Alice dismisses an alert
      And Alice creates a new application
      Then audit logs should contain:
        | action               | userId         | timestamp |
        | dashboard.view       | user-alice-001 | <time>    |
        | alert.dismiss        | user-alice-001 | <time>    |
        | application.create   | user-alice-001 | <time>    |

  Rule: Reliability requirements ensure service availability

    @nfr @reliability @critical
    Scenario: System maintains 99.9% uptime
      Given the monitoring period is 30 days
      When uptime is measured
      Then total downtime should be less than 43.2 minutes

    @nfr @reliability
    Scenario: Graceful degradation when dependent service fails
      Given the notifications service is unavailable
      When a request is made to GET /dashboard/summary
      Then the response should succeed with portfolio data
      And the alerts section should indicate "temporarily unavailable"
      And no 500 errors should be returned to clients

    @nfr @reliability
    Scenario: Database connection failures are handled gracefully
      Given the database connection pool is exhausted
      When a request is made to GET /dashboard/summary
      Then the response should be 503 Service Unavailable
      And the client should receive a "Retry-After" header
      And circuit breaker should activate after repeated failures

    @nfr @reliability @recovery
    Scenario: System recovers from database restart
      Given the database is restarted
      When requests resume after restart
      Then the system should reconnect automatically
      And requests should succeed within 30 seconds of database availability

  Rule: Data integrity requirements ensure accurate information

    @nfr @data-integrity @critical
    Scenario: Dashboard counts match actual database state
      Given the database contains:
        | table        | count |
        | applications | 100   |
        | patents      | 50    |
        | trademarks   | 30    |
      When the dashboard summary is requested
      Then totalAssets should equal the database count
      And counts by type should match database groupings

    @nfr @data-integrity
    Scenario: Alert delivery is 100% reliable for critical deadlines
      Given a critical office action deadline is due in 14 days
      When the alerts are queried
      Then the deadline should appear in the results
      And the deadline should never be missed from query results

  Rule: Compliance requirements for legal and regulatory needs

    @nfr @compliance @gdpr
    Scenario: User data can be exported for GDPR requests
      Given Alice requests a data export
      When the export is generated
      Then all of Alice's data should be included
      And the export should be in a portable format (JSON/CSV)

    @nfr @compliance @data-residency
    Scenario: Data residency requirements are respected
      Given the platform operates in UAE
      When data is stored
      Then data should reside in UAE-compliant data centers
      And cross-border data transfers should be logged

# Gaps Identified:
# 1. Disaster Recovery - What's the RTO/RPO for dashboard service?
# 2. Backup Strategy - How frequently are read model backups taken?
# 3. Compliance Certifications - Which certifications are required (ISO 27001, SOC 2)?
# 4. Data Retention - How long is audit log data retained?
```

---

## Key Differences from Frontend Features

| Aspect          | Frontend Features                  | Backend Features                               |
| --------------- | ---------------------------------- | ---------------------------------------------- |
| **Focus**       | User interactions, UI behavior     | API contracts, data flow, events               |
| **Language**    | "Alice sees...", "Alice clicks..." | "The response contains...", "Event emitted..." |
| **Tags**        | @frontend, @ux                     | @backend, @api, @command, @query, @event       |
| **Assertions**  | Visual elements, navigation        | Status codes, response bodies, events          |
| **Test Runner** | Playwright, browser                | Axios, supertest, database assertions          |
| **NFR Focus**   | Accessibility, visual design       | Performance, security, reliability             |

## Best Practices

1. **Use concrete test data** - Real organization IDs, user IDs, timestamps
2. **Reference CQRS contracts** - Map scenarios to commands/queries from spec
3. **Include event assertions** - Verify domain events are emitted
4. **Test error paths** - Unauthorized, validation errors, not found
5. **Cover NFRs explicitly** - Performance SLAs, security requirements
6. **Document gaps** - Questions for backend team review
7. **Maintain traceability** - Link backend scenarios to frontend features
8. **Always use UUIDs for resource IDs in RESTful URLs** - All resource identifiers in API paths must be UUIDs (e.g., `/applications/550e8400-e29b-41d4-a716-446655440000`). Never use sequential integers or other ID formats. This ensures:
   - Security (non-guessable IDs prevent enumeration attacks)
   - Distributed system compatibility (no central ID generation required)
   - Consistency across all API endpoints
9. **Ensure shared step text is unambiguous across scenarios** - If multiple scenarios reuse a parameterized step (e.g., "the client sends a POST request with idempotencyKey {string}"), the step text and its parameters must be sufficient to determine the exact endpoint and request body **without relying on World context variables**. If two scenarios share the same precondition values (e.g., both have status `under_review`) but target different endpoints (`/office-actions` vs `/grant`), the step text must distinguish them — e.g., "the client sends a POST office-action request with idempotencyKey {string}" vs "the client sends a POST grant request with idempotencyKey {string}". Never write step text that forces the implementer to branch on implicit context to determine what action to take.
10. **Cross-reference overlapping specs for field naming conflicts** — When multiple specs/projects define the same domain entity or endpoint (e.g., Project 4.8 "Office Action Recording" and Project 4.2.0 "Submission Management" both define office action fields), scan all related specs for naming discrepancies before generating features. Resolution order: (1) centralized API spec (`specs/backend/api/*.yaml`) is authoritative, (2) domain model entity definition (`libs/domain/`, `libs/api-contracts/`), (3) deployed frontend code and Pact contracts. If two specs use different names for the same concept, use the centralized spec's name and add a comment in the feature file noting the discrepancy. Never silently adopt a field name from one spec without checking whether another spec names it differently.

---

## Queue-Based Processing Scenarios (Azure Service Bus)

For async operations that publish to Azure Service Bus, generate scenarios that test:

1. **Command publishing** - Verify commands are queued for async processing
2. **Worker processing** - Verify workers consume and process messages
3. **Event emission** - Verify domain events are emitted after processing

### Queue Publishing Scenario Pattern

```gherkin
@backend @async @queue
Feature: Asynchronous Patent Analysis Processing
  In order to handle long-running patent analysis
  As the IP Hub backend system
  I want to process analysis requests asynchronously via Azure Service Bus

  Background:
    Given the IP Hub backend services are running
    And Azure Service Bus queues are configured
    And Alice is an authenticated user with userId "550e8400-e29b-41d4-a716-446655440000"

  Rule: Long-running operations are queued for async processing

    @api @command @async
    Scenario: Patent analysis request is queued for processing
      Given Alice has a patent application with id "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      When the client sends a POST request to "/analysis/start" with:
        """json
        {
          "applicationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          "analysisType": "patentability"
        }
        """
      Then the response status should be 202 Accepted
      And the response body should contain:
        | field    | value         |
        | jobId    | <uuid>        |
        | status   | queued        |
      And a "StartPatentAnalysis" command should be published to the queue

    @worker @async
    Scenario: Worker processes patent analysis from queue
      Given a "StartPatentAnalysis" message exists in the queue with:
        | applicationId | a1b2c3d4-e5f6-7890-abcd-ef1234567890 |
        | analysisType  | patentability                        |
        | requestedBy   | 550e8400-e29b-41d4-a716-446655440000 |
      When the worker processes the message
      Then the analysis should be completed within the timeout
      And a "PatentAnalysisCompleted" domain event should be emitted with:
        | applicationId | a1b2c3d4-e5f6-7890-abcd-ef1234567890 |
        | status        | completed                            |
      And the job status should be updated to "completed"

    @api @query @async
    Scenario: Client polls for async job status
      Given Alice has submitted an analysis job with id "job-123-uuid"
      And the job is currently processing
      When the client sends a GET request to "/jobs/job-123-uuid/status"
      Then the response status should be 200
      And the response body should contain:
        | field      | value      |
        | jobId      | job-123-uuid |
        | status     | processing |
        | progress   | 45         |

    @api @async @error
    Scenario: Async job failure is handled gracefully
      Given an analysis job has failed due to external service timeout
      When the client sends a GET request to "/jobs/failed-job-uuid/status"
      Then the response status should be 200
      And the response body should contain:
        | field   | value                              |
        | status  | failed                             |
        | error   | External service timeout           |
      And the job should be available for retry
```

### Queue Step Definition Patterns

Step definitions for queue testing should:

```typescript
// Given a command should be published to the queue
Then(
  "a {string} command should be published to the queue",
  async function (this: IPHubWorld, commandName: string) {
    const publishedMessages = await this.serviceBusSpy.getPublishedMessages();
    const matchingCommand = publishedMessages.find(
      (m) => m.type === commandName
    );
    expect(matchingCommand).toBeDefined();
  }
);

// Given a message exists in the queue
Given(
  "a {string} message exists in the queue with:",
  async function (this: IPHubWorld, messageType: string, dataTable: DataTable) {
    const payload = dataTable.rowsHash();
    await this.serviceBusTestHelper.publishMessage(messageType, payload);
  }
);

// When the worker processes the message
When("the worker processes the message", async function (this: IPHubWorld) {
  await this.workerTestHelper.processNextMessage();
});
```

---

## Domain Model Reference

**CRITICAL**: Before generating backend features, read the relevant Domain Model documentation:

**Location**: `documentation/technical-project-context/domain-model/` (at the mono-repo root)

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

---

## Architecture Specification Integration

For **Technical** and **Combined** spec types, the Architecture Specification provides authoritative definitions for backend features.

### Architecture Specification Location

**Primary Location**: `specs/backend/<FEATURE-FOLDER>/(Architecture/cqrs-contract/)`

**Common Architecture Files**:

- `Frontend Architecture.md` - Frontend system design
- `Backend Architecture.md` - Backend system design
- `<feature-name>-architecture.md` - Feature-specific architecture

### Architecture-to-Feature Mapping

When an Architecture Specification is available, generate features that map directly to architecture components:

#### 1. API Contract Features

For each endpoint defined in architecture:

```gherkin
# Architecture Reference: specs/03-dashboard-overview/(Architecture/cqrs-contract/)dashboard-architecture.md
# Section: 3.1 Dashboard BFFE Endpoints

@backend @api @architecture-aligned
Feature: Dashboard BFFE API - Architecture Contract Compliance
  Validates that the Dashboard BFFE implementation matches the Architecture Specification.

  Background:
    Given the backend services are running
    And Alice is an authenticated user

  # Architecture: GET /dashboard/summary
  Rule: Dashboard summary endpoint matches architecture contract

    @api @contract
    Scenario: GET /dashboard/summary returns architecture-defined schema
      Given the Architecture Specification defines GET /dashboard/summary
      And the response schema includes:
        | field           | type   | required |
        | totalAssets     | number | yes      |
        | inProgressCount | number | yes      |
        | countsByType    | object | yes      |
      When the client sends a GET request to "/dashboard/summary"
      Then the response status should be 200
      And the response body should match the architecture schema
```

#### 2. CQRS Command Features

For each command defined in architecture:

```gherkin
  # Architecture: DraftPatentApplication Command
  Rule: DraftPatentApplication command follows architecture contract

    @command @architecture-aligned
    Scenario: DraftPatentApplication command creates application per architecture
      Given the Architecture Specification defines DraftPatentApplication command
      And the command payload schema includes:
        | field       | type   | required |
        | title       | string | yes      |
        | description | string | yes      |
        | applicantId | uuid   | yes      |
      When the command is dispatched with valid payload
      Then a new patent application should be created
      And a PatentApplicationDrafted event should be emitted per architecture
```

#### 3. Domain Event Features

For each domain event defined in architecture:

```gherkin
  # Architecture: PatentApplicationDrafted Event
  Rule: Domain events match architecture event catalog

    @event @architecture-aligned
    Scenario: PatentApplicationDrafted event has architecture-defined payload
      Given the Architecture Specification defines PatentApplicationDrafted event
      And the event payload includes:
        | field         | type   |
        | applicationId | uuid   |
        | title         | string |
        | draftedAt     | datetime |
        | draftedBy     | uuid   |
      When a patent application is drafted
      Then a PatentApplicationDrafted event should be emitted
      And the event payload should match architecture specification
```

#### 4. NFR Features from Architecture

For each NFR defined in architecture:

```gherkin
# Architecture Reference: Section 6.0 Non-Functional Requirements

@nfr @architecture-aligned
Feature: Backend NFRs - Architecture Specification Compliance

  Rule: Performance SLAs from architecture are met

    @performance @architecture
    Scenario: API response times meet architecture-defined SLAs
      Given the Architecture Specification defines:
        | endpoint           | p95_response_time |
        | /dashboard/summary | 150ms             |
        | /applications      | 200ms             |
      When load testing is performed
      Then all endpoints should meet their architecture-defined SLAs
```

### Spec Type Tags

Use these tags to indicate specification source:

| Tag                     | Usage                                             |
| ----------------------- | ------------------------------------------------- |
| `@architecture-aligned` | Feature aligns with Architecture Specification    |
| `@contract`             | Feature tests API contract from architecture      |
| `@technical-spec`       | Feature derived from technical specification only |
| `@combined-spec`        | Feature covers both UI-implied and architecture   |

### Quality Checklist for Architecture-Aligned Features

Before completing backend feature generation for Technical/Combined specs:

- [ ] Architecture Specification file was read completely
- [ ] All architecture-defined endpoints have corresponding scenarios
- [ ] All CQRS commands/queries have corresponding scenarios
- [ ] All domain events have corresponding scenarios
- [ ] NFRs from architecture are captured as scenarios
- [ ] Schema definitions match architecture exactly
- [ ] Error codes and messages match architecture
- [ ] Architecture reference comments included in feature files
