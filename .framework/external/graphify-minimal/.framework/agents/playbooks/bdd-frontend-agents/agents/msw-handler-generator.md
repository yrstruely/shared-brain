# MSW Handler Generator Agent - Create Mock Service Worker Handlers from API Analysis

## Purpose

Create Mock Service Worker (MSW) handlers from API requirements analysis. This agent reads the analysis file (produced by the API Requirements Analyzer) and BFFE specifications to generate TypeScript MSW handlers with environment-specific mock data for test, development, and CI environments.

## Initial Input Prompt

**IMPORTANT**: if any of the `Initial Input Prompt` variables are not clear from the prompt, clarify with the user before continuing

```json
{
  "analysisFile": "temp/api-requirements-analysis.md",
  "bffeSpec": "specs/frontend/<<FEATURE-FOLDER>>/bffe-spec.md",
  "backendApiSpecs": "specs/backend/api/",
  "discrepancyReport": "specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md",
  "domain": "dashboard",
  "outputDirectory": "apps/ip-hub-frontend/test/msw/handlers/",
  "handlersIndexFile": "apps/ip-hub-frontend/test/msw/handlers/index.ts",
  "language": "typescript"
}
```

## Agent Behavior (Step-by-Step)

### 1. Read API Requirements Analysis and BFFE Spec

- Read the analysis file from the previous step (API Requirements Analyzer)
- **Read BFFE spec** for authoritative response schemas
- Extract endpoint definitions
- **Cross-reference with BFFE spec** for exact paths, methods, and response structures
- Identify environment-specific data requirements
- Note error scenarios that need handlers

### 1.5 Cross-Reference Centralized Backend API Specs

- Read the discrepancy report from `specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md` (created by API Requirements Analyzer)
- For each endpoint to implement:
  - If centralized spec defines it: **use centralized spec schemas as authoritative**
  - If NOT in centralized spec: use feature BFFE spec, add comment noting this is a new endpoint
- Add spec reference comments to each handler (see pattern below)

**Priority**: Centralized API Spec > Feature BFFE Spec > Scenario-derived requirements

**Spec Reference Comment Pattern** (add to every handler):
```typescript
// ============================================================================
// SPEC REFERENCE
// Centralized: specs/backend/api/ipams.yaml - GET /universal-applications
// Feature BFFE: specs/frontend/<FEATURE>/bffe-spec.md - Section X.Y
// Decision: Using centralized spec (authoritative for existing endpoints)
// ============================================================================
```

For new endpoints not in centralized spec:
```typescript
// ============================================================================
// SPEC REFERENCE
// Centralized: NOT FOUND - New endpoint for this feature
// Feature BFFE: specs/frontend/<FEATURE>/bffe-spec.md - Section X.Y
// Action: Add to specs/backend/api/ipams.yaml (see discrepancy report)
// ============================================================================
```

### 2. Create MSW Handler File

- Location: `apps/ip-hub-frontend/test/msw/handlers/[domain].ts`
- Import required MSW functions: `http`, `HttpResponse`, `delay`
- Import config: `MSW_CONFIG`, `getEnvironmentData`
- **Use BFFE spec response schemas** as the authoritative structure for all responses

### 3. Implement Environment-Specific Data

Define mock data using `getEnvironmentData({ test, 'dev.local', ci })`:

| Environment | Data Strategy | Volume |
|-------------|---------------|--------|
| `test` | Minimal data for specific test assertions | 1-2 items |
| `dev.local` | Rich data using exact values from Cucumber scenarios | 5-20 items |
| `ci` | Deterministic, reproducible data | 3-5 items |

### 4. Implement Handler Functions

For each endpoint:
- Create handler matching BFFE spec path exactly
- **Use `apiPath()` helper** to prefix all API paths (see Path Registration section below)
- Add realistic response delay: `await delay(MSW_CONFIG.delay)`
- Return structured response: `HttpResponse.json({ success, data })`
- Handle path parameters (e.g., `:id`)
- Handle query parameters for filtering
- Implement error scenarios with appropriate status codes

### CRITICAL: Path Registration with `apiPath()`

MSW handlers run in the browser service worker where paths must match the **full URL path** the browser sends. The Nuxt app uses `apiBase: '/api/v1'`, so browser requests go to `/api/v1/health`, `/api/v1/auth/status`, etc.

**Always use `apiPath()` from `../config`** to prefix API paths:

```typescript
import { MSW_CONFIG, getEnvironmentData, apiPath } from '../config';

// ✅ CORRECT — matches browser request to /api/v1/health
http.get(apiPath('/health'), async () => { ... })

// ❌ WRONG — only matches /health, browser sends /api/v1/health
http.get('/health', async () => { ... })
```

**Exceptions** (do NOT use `apiPath()`):
- `/oauth2/auth`, `/oauth2/start` — oauth2-proxy paths, not API endpoints
- External URLs like `https://:account.blob.core.windows.net/...`

### CRITICAL: No Glob Patterns (`*/path`)

MSW 2.12+ uses `path-to-regexp` v8 which **rejects** the `*` glob syntax. The `*` expands to `(.*)` which v8 treats as an invalid group.

```typescript
// ❌ BROKEN in MSW 2.12+ — causes TypeError in path-to-regexp v8
http.get('*/health', async () => { ... })

// ✅ CORRECT — use apiPath() for API routes
http.get(apiPath('/health'), async () => { ... })

// ✅ CORRECT — use plain path for non-API routes
http.get('/oauth2/auth', async () => { ... })

// ✅ CORRECT — for external URLs that need wildcard matching, use named params
http.put('https://:account.blob.core.windows.net/:container/:blob', async () => { ... })
```

### 5. Register Handler

- Export handler array: `export const [domain]Handlers = [...]`
- Update `apps/ip-hub-frontend/test/msw/handlers/index.ts` to import and spread new handlers

### 6. Validate Implementation

- Run TypeScript compiler (`tsc --noEmit`) to verify no type errors
- Verify all endpoints from analysis are implemented
- Confirm handlers are registered in index file
- If issues found, fix and repeat until validation passes

## MSW Handler Template

```typescript
// apps/ip-hub-frontend/test/msw/handlers/[domain].ts
import { http, HttpResponse, delay } from 'msw'
import { MSW_CONFIG, getEnvironmentData, apiPath } from '../config'

// Define environment-specific mock data
const dashboardData = getEnvironmentData({
  test: {
    // Minimal data for specific test assertions
    summary: {
      activePatents: 1,
      pendingApplications: 0,
      trademarks: 0
    }
  },
  'dev.local': {
    // Rich, varied data for UI development
    // Use values from Cucumber scenarios
    summary: {
      activePatents: 45,  // ← From scenario: "Alice has 45 active patents"
      pendingApplications: 23,  // ← From scenario
      trademarks: 67
    },
    recentActivity: [
      {
        id: 'ACT-001',
        type: 'application_submitted',
        title: 'Dubai Patent Application',
        timestamp: '2024-01-15T10:30:00Z',
        user: 'Alice Johnson'
      },
      {
        id: 'ACT-002',
        type: 'collaborator_invited',
        title: 'Bob Smith joined as Patent Agent',
        timestamp: '2024-01-14T15:20:00Z',
        user: 'Alice Johnson'
      }
    ]
  },
  ci: {
    // Deterministic data for CI/CD
    summary: {
      activePatents: 10,
      pendingApplications: 5,
      trademarks: 15
    }
  }
})

export const dashboardHandlers = [
  // GET /dashboard/summary - Main dashboard summary
  http.get(apiPath('/dashboard/summary'), async () => {
    await delay(MSW_CONFIG.delay)

    return HttpResponse.json({
      success: true,
      data: dashboardData
    })
  }),

  // GET /dashboard/recent-activity - Activity feed
  http.get(apiPath('/dashboard/recent-activity'), async () => {
    await delay(MSW_CONFIG.delay)

    return HttpResponse.json({
      success: true,
      data: dashboardData.recentActivity || [],
      meta: {
        total: dashboardData.recentActivity?.length || 0
      }
    })
  })
]
```

## Handler Pattern Examples

### Path Parameters

```typescript
// GET /applications/:id
http.get(apiPath('/applications/:id'), async ({ params }) => {
  await delay(MSW_CONFIG.delay)

  const application = applicationsData.find(app => app.id === params.id)

  if (!application) {
    return HttpResponse.json(
      {
        success: false,
        error: 'Not Found',
        message: 'Application not found'
      },
      { status: 404 }
    )
  }

  return HttpResponse.json({
    success: true,
    data: application
  })
})
```

### Query Parameters

```typescript
// GET /applications?type=patent&status=in_progress
http.get(apiPath('/applications'), async ({ request }) => {
  await delay(MSW_CONFIG.delay)

  const url = new URL(request.url)
  const type = url.searchParams.get('type')
  const status = url.searchParams.get('status')

  let filtered = applicationsData

  if (type) {
    filtered = filtered.filter(app => app.type === type)
  }

  if (status) {
    filtered = filtered.filter(app => app.status === status)
  }

  return HttpResponse.json({
    success: true,
    data: filtered,
    meta: {
      total: filtered.length,
      filters: { type, status }
    }
  })
})
```

### POST with Request Body

```typescript
// POST /applications
http.post(apiPath('/applications'), async ({ request }) => {
  await delay(MSW_CONFIG.delay)

  const body = await request.json()

  // Validate required fields
  if (!body.title || !body.type) {
    return HttpResponse.json(
      {
        success: false,
        error: 'Validation Error',
        message: 'Title and type are required'
      },
      { status: 400 }
    )
  }

  // Create new application
  const newApplication = {
    id: `APP-${Date.now()}`,
    ...body,
    status: 'draft',
    createdAt: new Date().toISOString()
  }

  return HttpResponse.json(
    {
      success: true,
      data: newApplication
    },
    { status: 201 }
  )
})
```

### Error Scenario

```typescript
// Conditional error for testing error handling
http.get('/applications', async () => {
  await delay(MSW_CONFIG.delay)

  if (MSW_CONFIG.env === 'error-test') {
    return HttpResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        message: 'Database connection failed'
      },
      { status: 500 }
    )
  }

  return HttpResponse.json({
    success: true,
    data: applicationsData
  })
})
```

## Register Handler in Index

Update `apps/ip-hub-frontend/test/msw/handlers/index.ts`:

```typescript
import { dashboardHandlers } from './dashboard'
import { applicationsHandlers } from './applications'
import { assetsHandlers } from './assets'
import { collaboratorsHandlers } from './collaborators'

export const handlers = [
  ...dashboardHandlers,
  ...applicationsHandlers,
  ...assetsHandlers,
  ...collaboratorsHandlers
]
```

---

## CRITICAL: Handler Route Ordering

**MSW matches routes in the order they are defined. The first matching route wins.**

### Rule: More Specific Routes MUST Come BEFORE Less Specific Routes

This is a common source of bugs. If a less specific route is defined first, it will match requests intended for more specific routes.

### Correct Order Examples

```typescript
export const orgsHandlers = [
  // ✅ CORRECT ORDER: Most specific routes FIRST

  // 1. Routes with multiple path segments (most specific)
  http.get(apiPath('/orgs/:orgId/members/:memberId'), async ({ params }) => {
    // Specific member in specific org
  }),

  // 2. Routes with single path parameter + additional segment
  http.get(apiPath('/orgs/:orgId/members'), async ({ params }) => {
    // All members for specific org
  }),

  http.get(apiPath('/orgs/:orgId/settings'), async ({ params }) => {
    // Settings for specific org
  }),

  // 3. Routes with single path parameter (less specific)
  http.get(apiPath('/orgs/:id'), async ({ params }) => {
    // Specific org by ID
  }),

  // 4. Base collection routes (least specific) - MUST BE LAST
  http.get(apiPath('/orgs'), async () => {
    // List all orgs
  }),

  http.post(apiPath('/orgs'), async ({ request }) => {
    // Create new org
  }),
]
```

### Incorrect Order (WILL CAUSE BUGS)

```typescript
export const orgsHandlers = [
  // ❌ WRONG ORDER: Less specific routes first

  http.get(apiPath('/orgs'), async () => {
    // This will INCORRECTLY match /api/orgs/123
    // because MSW stops at first match!
  }),

  http.get(apiPath('/orgs/:id'), async ({ params }) => {
    // This will NEVER be reached for /api/orgs/123
    // because the route above already matched
  }),
]
```

### Ordering Rules Summary

| Priority | Route Pattern | Example |
|----------|---------------|---------|
| 1 (First) | Multiple params + segments | `/api/orgs/:orgId/members/:memberId` |
| 2 | Single param + segment | `/api/orgs/:orgId/members` |
| 3 | Single param only | `/api/orgs/:id` |
| 4 (Last) | Base collection (no params) | `/api/orgs` |

### Common Patterns to Watch

```typescript
// Applications - CORRECT ORDER
export const applicationsHandlers = [
  http.get(apiPath('/applications/:id/documents/:docId'), ...),  // Most specific
  http.get(apiPath('/applications/:id/documents'), ...),
  http.get(apiPath('/applications/:id/status'), ...),
  http.get(apiPath('/applications/:id'), ...),
  http.get(apiPath('/applications'), ...),                       // Least specific (LAST)
  http.post(apiPath('/applications'), ...),
]

// Assets - CORRECT ORDER
export const assetsHandlers = [
  http.get(apiPath('/assets/:id/history'), ...),
  http.get(apiPath('/assets/:id'), ...),
  http.get(apiPath('/assets'), ...),  // LAST
]
```

### Debugging Route Matching Issues

If requests are being handled by the wrong handler:

1. **Check handler order** - most specific routes must be first
2. **Log which handler is matching** - add console.log to each handler temporarily
3. **Verify path patterns** - ensure parameter names match (`:id` vs `:orgId`)

```typescript
// Debugging helper
http.get(apiPath('/orgs/:id'), async ({ params }) => {
  console.log('[MSW] Matched /api/orgs/:id with params:', params)
  // ...
})
```

## Project-Specific Context

### File Locations

| File Type | Location |
|-----------|----------|
| Handlers | `apps/ip-hub-frontend/test/msw/handlers/[domain].ts` |
| Config | `apps/ip-hub-frontend/test/msw/config.ts` |
| Index | `apps/ip-hub-frontend/test/msw/handlers/index.ts` |
| Server Setup | `apps/ip-hub-frontend/test/msw/server.ts` |

### MSW Configuration

Located in `apps/ip-hub-frontend/test/msw/config.ts`:

```typescript
export const MSW_CONFIG = {
  delay: process.env.MSW_DELAY ? parseInt(process.env.MSW_DELAY) : 100,
  env: process.env.MSW_ENV || 'dev.local'
}

export function getEnvironmentData<T>(environments: {
  test: T
  'dev.local': T
  ci: T
}): T {
  const env = MSW_CONFIG.env as keyof typeof environments
  return environments[env] || environments['dev.local']
}
```

### Response Patterns

**Success Response**:
```typescript
{ success: true, data: T }
```

**Success with Metadata**:
```typescript
{ success: true, data: T[], meta: { total: number, page?: number, pageSize?: number } }
```

**Error Response**:
```typescript
{ success: false, error: string, message: string }
```

### Domain Organization

| Handler File | Domain Coverage |
|--------------|-----------------|
| `dashboard.ts` | Dashboard, recent activity, summaries |
| `applications.ts` | Patent/trademark/copyright applications |
| `assets.ts` | IP assets, portfolio management |
| `collaborators.ts` | Team members, access control |
| `prior-art.ts` | Prior art searches, patentability |
| `fees.ts` | Fee tracking, payments |

### Shared Types

> **Note**: When defining response types for MSW handlers, check if shared DTOs exist in `@ip-hub-backend/api-contracts` (located at `libs/api-contracts/src/dto/`). Importing from shared packages ensures type consistency between frontend mocks and backend implementations.

## Best Practices

### Do

- **Order routes from most specific to least specific** (CRITICAL - see Route Ordering section)
- **Use BFFE spec schemas** as authoritative response structure
- **Match exact endpoint paths** from BFFE spec
- Use environment-specific data via `getEnvironmentData()`
- Return production-like response structures
- Include realistic data variations
- Add response delays for realistic testing
- Handle both success and error scenarios
- Use values from Cucumber scenarios for `dev.local` data
- Export handler array with descriptive name

### Don't

- **Define less specific routes before more specific ones** (e.g., `/api/orgs` before `/api/orgs/:id`)
- Add test-specific query parameters (e.g., `?scenario=test`)
- Hardcode test-specific data in handlers
- Return minimal data (enrich with realistic variations)
- Forget to add handler to index.ts
- Skip error scenario handlers
- Use different response structures than BFFE spec
- Deviate from BFFE endpoint paths

## Centralized API Spec Alignment

### Schema Priority When Specs Conflict

| Priority | Source | When to Use |
|----------|--------|-------------|
| 1 (Highest) | Centralized API Spec (`specs/backend/api/*.yaml`) | Endpoint exists in centralized spec |
| 2 | Feature BFFE Spec (`specs/frontend/<FEATURE>/bffe-spec.md`) | New endpoint not yet in centralized spec |
| 3 (Lowest) | Scenario-derived | Neither spec defines the endpoint |

### After Creating Handlers

Append MSW alignment findings to the discrepancy report at `specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md`:

````markdown
## Section 2: MSW Handler Alignment Decisions
*Generated by: MSW Handler Generator Agent*

| Handler File | Endpoint | Spec Used | Reason |
|-------------|----------|-----------|--------|
| `dashboard.ts` | `GET /dashboard/summary` | Centralized (`ipams.yaml`) | Endpoint exists in centralized spec |
| `dashboard.ts` | `GET /dashboard/widgets` | Feature BFFE | New endpoint, not in centralized spec |
````

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MSW not intercepting requests | Check MSW server is started in `apps/ip-hub-frontend/features/support/hooks.ts` |
| Wrong data returned | Verify `MSW_ENV` environment variable is set correctly |
| Handler not found | Ensure handler is exported and imported in `index.ts` |
| TypeScript errors | Define interfaces for data structures, use proper types |
| **Wrong handler matching** | **Check route ordering - more specific routes must come FIRST** |
| `/api/orgs/123` returns list | Route ordering issue - `/api/orgs` is before `/api/orgs/:id` |
| Path params not captured | Ensure more specific route is defined before base route |

## Quality Checklist

### Handler Implementation

- [ ] Handler file created in `apps/ip-hub-frontend/test/msw/handlers/[domain].ts`
- [ ] All endpoints from analysis are implemented
- [ ] Endpoint paths match BFFE spec exactly
- [ ] Response structures match BFFE spec schemas

### Route Ordering (CRITICAL)

- [ ] **Most specific routes are defined FIRST** in the handler array
- [ ] Routes with multiple path params come before single path params
- [ ] Routes with path params come before base collection routes
- [ ] Example: `/orgs/:id/members` before `/orgs/:id` before `/orgs`

### Environment Data

- [ ] Environment-specific data defined (test, dev.local, ci)
- [ ] Scenario values used for dev.local environment
- [ ] Minimal data for test environment
- [ ] Deterministic data for ci environment

### Handler Quality

- [ ] Response delay added (`await delay(MSW_CONFIG.delay)`)
- [ ] Success responses return `{ success: true, data: T }`
- [ ] Error scenarios return appropriate status codes
- [ ] Path parameters handled correctly
- [ ] Query parameters filtered correctly
- [ ] POST handlers validate request bodies

### Registration

- [ ] Handler exported as named array (`[domain]Handlers`)
- [ ] Handler registered in `apps/ip-hub-frontend/test/msw/handlers/index.ts`
- [ ] TypeScript compiles without errors

### Centralized API Spec Alignment
- [ ] Each handler has spec reference comment identifying source
- [ ] Centralized spec used where endpoint exists
- [ ] New endpoints flagged in discrepancy report
- [ ] Discrepancy report updated with MSW alignment decisions (Section 2)
