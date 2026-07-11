# Pact Contract Generator Agent - Generate Consumer-Driven Contracts from MSW Handlers

## Purpose

Generate Pact contracts from MSW handlers to establish consumer-driven contracts between frontend and backend. Pact contracts define what the frontend NEEDS from the backend API, enabling contract testing and ensuring API compatibility.

## Initial Input Prompt

**IMPORTANT**: if any of the `Initial Input Prompt` variables are not clear from the prompt, clarify with the user before continuing

```json
{
  "mswHandlersDirectory": "apps/ip-hub-frontend/test/msw/handlers/",
  "pactOutputDirectory": "apps/ip-hub-frontend/test/pact/pacts/",
  "bffeSpec": "specs/frontend/<<FEATURE-FOLDER>>/bffe-spec.md",
  "backendApiSpecs": "specs/backend/api/",
  "discrepancyReport": "specs/backend/api/<<CURRENT-FEATURE>>/api-spec-discrepancies.md",
  "handlersIndexFile": "apps/ip-hub-frontend/test/msw/handlers/index.ts",
  "generationScript": "apps/ip-hub-frontend/scripts/generate-pact-from-msw.ts"
}
```

## Prerequisites

- MSW handlers must exist (by MSW Handler Generator Agent)
- Step definitions must be implemented
- BFFE specification must be available for cross-referencing

## Agent Behavior (Step-by-Step)

### 1. Verify Prerequisites

- Confirm MSW handlers exist in `apps/ip-hub-frontend/test/msw/handlers/`
- Confirm all handlers are exported in `apps/ip-hub-frontend/test/msw/handlers/index.ts`
- Verify tests are running (even if failing due to missing frontend code)

### 2. Generate Pact Contracts

Execute the generation command:

```bash
pnpm --filter @ip-hub/frontend pact:generate
```

The script:
1. Reads MSW handlers from `apps/ip-hub-frontend/test/msw/handlers/`
2. Analyzes each HTTP handler (http.get, http.post, etc.)
3. Extracts request patterns and response structures
4. Generates Pact interactions in standard format
5. Writes contracts to `apps/ip-hub-frontend/test/pact/pacts/`

### 3. Review Generated Contracts

- Check files in `apps/ip-hub-frontend/test/pact/pacts/`
- Verify interaction descriptions are clear
- Ensure request/response structures are accurate
- Confirm all MSW handlers are represented

### 4. Cross-Check Against Centralized Backend API Specs AND Feature BFFE Spec

- **First**: Read centralized API specs from `specs/backend/api/*.yaml`
- **Second**: Read feature BFFE spec from `specs/frontend/<<FEATURE-FOLDER>>/bffe-spec.md`
- For each generated Pact interaction:
  - **Search centralized specs** for the endpoint path
  - **If found in centralized spec**:
    - Verify endpoint path matches exactly
    - Verify response schema matches centralized spec
    - Note: centralized spec is authoritative
  - **If NOT found in centralized spec**:
    - Verify against feature BFFE spec instead
    - Flag as new endpoint needing centralized spec update
  - **Note any discrepancies** between Pact contracts and specs
  - **Report mismatches** for resolution
- Document which spec was authoritative for each interaction

### 5. Validate and Report

- List generated contract files
- Show interaction count
- Report BFFE spec compliance status
- If discrepancies exist, document them for the developer

## Generated Contract Structure

Example Pact contract:

```json
{
  "consumer": {
    "name": "ip-hub-frontend"
  },
  "provider": {
    "name": "ip-hub-backend"
  },
  "interactions": [
    {
      "description": "GET dashboard summary",
      "request": {
        "method": "GET",
        "path": "/api/dashboard"
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "success": true,
          "data": {
            "summary": {
              "activePatents": 45,
              "pendingApplications": 23,
              "trademarks": 67
            }
          }
        },
        "matchingRules": {
          "body": {
            "$.data.summary.activePatents": {
              "matchers": [{ "match": "type" }]
            }
          }
        }
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "2.0.0"
    }
  }
}
```

## Pact Matchers Reference

Pact uses matchers to define flexible contract validation:

| Matcher | Purpose | Example Use |
|---------|---------|-------------|
| `match: type` | Validates field exists and is correct type | Numbers, strings that can vary |
| `match: equality` | Validates exact value | Status codes, fixed strings |
| `match: regex` | Validates pattern | IDs, dates, emails |

**Example Type Matcher**:
```json
{
  "$.data.summary.activePatents": {
    "matchers": [{ "match": "type" }]
  }
}
```
Means: `activePatents` must be a number, but can be any value (45, 100, 0, etc.)

## Project-Specific Context

### File Locations

| File Type | Location |
|-----------|----------|
| MSW Handlers (Input) | `apps/ip-hub-frontend/test/msw/handlers/*.ts` |
| Pact Contracts (Output) | `apps/ip-hub-frontend/test/pact/pacts/*.json` |
| Generation Script | `apps/ip-hub-frontend/scripts/generate-pact-from-msw.ts` |
| Validation Script | `apps/ip-hub-frontend/scripts/validate-msw-pact-sync.ts` |

### Package.json Scripts

```json
{
  "pact:generate": "tsx scripts/generate-pact-from-msw.ts",
  "pact:validate": "tsx scripts/validate-msw-pact-sync.ts",
  "pact:workflow": "pnpm --filter @ip-hub/frontend pact:generate && pnpm --filter @ip-hub/frontend pact:validate"
}
```

### Contract Naming

| Component | Value |
|-----------|-------|
| File Format | `{consumer}-{provider}-consumer.json` |
| Example | `frontend-backend-consumer.json` |

## Consumer-Driven Contracts Concept

| Aspect | Description |
|--------|-------------|
| What Pact defines | What **frontend NEEDS** from backend |
| Backend responsibility | Implement to **match the contract** |
| Contract direction | Consumer-driven (frontend defines, backend implements) |
| NOT | Backend-first design where frontend adapts |

## Contract Quality Checklist

Generated contracts should include:

- [ ] Clear interaction descriptions
- [ ] Accurate request paths and methods
- [ ] Query parameters where applicable
- [ ] Expected response status codes
- [ ] Response body structures
- [ ] Matching rules (type matchers for flexible validation)
- [ ] All MSW handlers represented

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "MSW handlers not found" | Verify handlers exist in `apps/ip-hub-frontend/test/msw/handlers/` and are exported |
| Some endpoints missing | Check handler is registered in `apps/ip-hub-frontend/test/msw/handlers/index.ts` |
| Contract structure incorrect | Review MSW handler response format - should match `{ success: boolean, data: T }` |
| Matchers not generated | Generation script creates type matchers automatically |
| BFFE spec mismatch | Update MSW handlers to match BFFE spec, then regenerate |

## Important Rules

### Do

- Auto-generate contracts from MSW (no manual writing)
- Use contracts to define what frontend NEEDS
- Cross-check against BFFE spec
- Proceed to validation step after generation

### Don't

- Manually edit generated Pact files (update MSW instead)
- Skip the validation step
- Ignore BFFE spec mismatches
- Create contracts that don't match MSW handlers

## Success Output Format

```
✅ Pact Contract Generation Successful

Generated Contracts:
  - apps/ip-hub-frontend/test/pact/pacts/frontend-backend-consumer.json

Interactions Generated:
  - GET /api/dashboard (200)
  - GET /api/dashboard/recent-activity (200)
  - GET /api/applications (200)
  - GET /api/applications/:id (200)
  - POST /api/applications (201)
  - GET /api/collaborators (200)
  - GET /api/assets (200)

Total Interactions: 12
Pact Specification Version: 2.0.0

BFFE Spec Compliance: ✅ All endpoints match

Contracts written to: apps/ip-hub-frontend/test/pact/pacts/
```

## Cross-App Regression Check

After generating contracts, run local Pact provider verification to check for regressions:

```bash
pnpm run pact:verify:local-to-local
```

**Interpret results with outside-in context**:

- **Existing contract passes** -- Backend still satisfies previous frontend contracts (good)
- **Existing contract fails** -- REGRESSION - backend broke a previous contract (investigate)
- **New contract fails** -- EXPECTED - backend hasn't implemented this yet (this is the backend's Red phase roadmap)

Report the new failing contracts as the "Backend Implementation Roadmap" in the summary.

## Quality Checklist

### Generation Verification

- [ ] Contract file exists in `apps/ip-hub-frontend/test/pact/pacts/`
- [ ] All MSW endpoints represented as interactions
- [ ] Interaction count matches expected endpoints
- [ ] Request methods and paths are correct
- [ ] Response status codes are appropriate
- [ ] Response bodies include expected structures

### Contract Quality

- [ ] Matching rules present for flexible fields
- [ ] Consumer and provider names are correct
- [ ] Contract is valid JSON
- [ ] Interaction descriptions are clear

### BFFE Spec Compliance

- [ ] Endpoint paths match BFFE spec exactly
- [ ] Response schemas match BFFE spec definitions
- [ ] Any discrepancies documented
- [ ] Ready for validation step

### Centralized API Spec Compliance
- [ ] Each Pact interaction cross-checked against centralized spec
- [ ] Interactions for existing endpoints match centralized spec
- [ ] New endpoints flagged for centralized spec update
