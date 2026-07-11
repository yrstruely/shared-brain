# BDD Red Phase Validator Agent - Verify Step Definitions Fail Before Implementation

## Purpose

Verify that newly implemented step definitions fail appropriately before application code exists. This is the BDD "Red" phase - failures are expected and indicate what needs to be implemented. Any step that fails for unexpected reasons (syntax errors, environment issues, etc.) must be fixed before proceeding.

## Initial Input Prompt

**IMPORTANT**: if any of the `Initial Input Prompt` variables are not clear from the prompt, clarify with the user before continuing

```json
{
  "featureFiles": "apps/ip-hub-frontend/features/<<FEATURE-FOLDER>>/*.feature",
  "stepDefinitionFiles": "apps/ip-hub-frontend/features/step-definitions/*.ts",
  "supportFiles": "apps/ip-hub-frontend/features/support/**/*.ts",
  "testFramework": "playwright",
  "bddFramework": "cucumber",
  "language": "typescript"
}
```

## Prerequisites

- Step definitions must be implemented (by Step Definition Implementer Agent)
- MSW handlers must be in place (by MSW Handler Generator Agent)
- No application code should exist yet (this validates the "Red" phase)

## Agent Behavior (Step-by-Step)

### 1. Execute Cucumber.js Tests

Run the test suite against the feature files:

```bash
export NODE_OPTIONS='--import=tsx' && npx cucumber-js apps/ip-hub-frontend/features/<<FEATURE-FOLDER>>/*.feature --format progress --import 'apps/ip-hub-frontend/features/support/**/*.ts' --import 'apps/ip-hub-frontend/features/step-definitions/**/*.ts'
```

- Collect all test execution results
- Capture failure messages and stack traces
- Note which scenarios pass (unexpected) and which fail (expected)

### 2. Analyze Failure Reasons

Categorize each failure:

| Category | Type | Meaning |
|----------|------|---------|
| Expected Failures | ✅ Good | Missing application code - BDD Red phase working correctly |
| Unexpected Failures | ❌ Bad | Test issues that need fixing before proceeding |
| Unexpected Passes | ⚠️ Warning | Tests passing without real implementation - investigate |

### 3. Validate Each Failure

For each failure:
- Compare failure message to BDD step intent
- Confirm failure is due to missing application code (not test bugs)
- Identify the specific feature/component that needs implementation
- Document what needs to be built

### 4. Handle Unexpected Passes

If a step passes unexpectedly, investigate:
- Is there existing application code?
- Is a mock returning success without real implementation?
- Is the assertion too weak?
- Verify the pass is legitimate or tighten the test

### 5. Report and Validate

- List all tests with their results
- Categorize failures as expected or unexpected
- Provide clear guidance on what to implement next
- If unexpected failures exist, they must be fixed before proceeding

## Expected Failure Categories (BDD Red Phase - GOOD)

### Page/Route Not Found (404)

```
Error: Page navigation to '/dashboard/patent' returned 404
```

| Aspect | Value |
|--------|-------|
| Valid Red Phase | ✅ Yes - Route doesn't exist yet |
| Next Action | Create `apps/ip-hub-frontend/app/pages/dashboard/patent.vue` |

---

### Element Not Found

```
Error: locator.waitFor: Timeout 30000ms exceeded
Element with data-testid="patent-registration-dashboard-header" not found
```

| Aspect | Value |
|--------|-------|
| Valid Red Phase | ✅ Yes - Component/element not implemented |
| Next Action | Add element with `data-testid` to the page component |

---

### Missing Component

```
Error: Cannot find component 'PatentDashboard'
```

| Aspect | Value |
|--------|-------|
| Valid Red Phase | ✅ Yes - Component doesn't exist |
| Next Action | Create `apps/ip-hub-frontend/app/components/PatentDashboard.vue` |

---

### Missing Composable

```
Error: Cannot find module '~/composables/usePatentApplication'
```

| Aspect | Value |
|--------|-------|
| Valid Red Phase | ✅ Yes - Composable not implemented |
| Next Action | Create composable in project |

---

### Assertion Failure (Missing Content)

```
AssertionError: Expected element to contain text "Patent Registration Dashboard" but got ""
```

| Aspect | Value |
|--------|-------|
| Valid Red Phase | ✅ Yes - Content not rendered yet |
| Next Action | Implement content rendering in component |

## Unexpected Failure Categories (Fix Before Proceeding)

### TypeScript Compilation Error

```
Error: TS2304: Cannot find name 'ICustomWorld'
```

| Problem | Fix |
|---------|-----|
| Missing type import | Import from `apps/ip-hub-frontend/features/support/world.ts` |

---

### Import Error

```
Error: Cannot find module '@playwright/test'
```

| Problem | Fix |
|---------|-----|
| Module not found | Check imports, ensure module is installed |

---

### Wrong Assertion Library

```
Error: expect(...).to is not a function
```

| Problem | Fix |
|---------|-----|
| Using Chai instead of Playwright | Change to `import { expect } from '@playwright/test'` |

---

### Page Not Initialized

```
Error: Cannot read property 'locator' of null
```

| Problem | Fix |
|---------|-----|
| Missing page check | Add `if (!this.page) throw new Error('Page not initialized')` |

---

### Browser Launch Failure

```
Error: browserType.launch: Executable doesn't exist
```

| Problem | Fix |
|---------|-----|
| Browsers not installed | Run `npx playwright install` |

---

### Timeout Due to Test Issue

```
Error: Timeout waiting for element that will never appear
```

| Problem | Fix |
|---------|-----|
| Wrong selector or testid | Check if test is looking for wrong element |

## BDD Red Phase Validation Checklist

### Expected Conditions (All Should Be True)

- [ ] Most or all scenarios fail
- [ ] Failures are due to missing application code
- [ ] Error messages clearly indicate what's missing
- [ ] No TypeScript compilation errors
- [ ] No import/module resolution errors
- [ ] Playwright browser launches successfully
- [ ] MSW mock APIs work correctly
- [ ] Test code is syntactically correct

### Red Flags (Fix These Before Proceeding)

- [ ] Tests passing when application code doesn't exist
- [ ] Syntax errors in step definitions
- [ ] Import errors
- [ ] TypeScript compilation failures
- [ ] Browser launch failures
- [ ] Environment configuration issues
- [ ] Wrong assertion library being used
- [ ] Test timeouts due to test bugs (not missing features)

## Implementation Guidance from Failures

### What Failures Tell Us to Build

| Failure | What to Build |
|---------|---------------|
| Element `data-testid="xyz-header"` not found | Add `<h1 data-testid="xyz-header">` to page |
| Navigation to `/dashboard/patent` returns 404 | Create `apps/ip-hub-frontend/app/pages/dashboard/patent.vue` |
| Component `PatentStrategy` not found | Create `apps/ip-hub-frontend/app/components/PatentStrategy.vue` |
| Composable `usePatentApplication` not found | Create `composables/usePatentApplication.ts` |

### Example Implementation from Failure

**Failure**: Element `data-testid="patent-registration-dashboard-header"` not found

**Build**:
```vue
<!-- apps/ip-hub-frontend/app/pages/dashboard/patent.vue -->
<template>
  <div>
    <h1 data-testid="patent-registration-dashboard-header">
      Patent Registration Dashboard
    </h1>
  </div>
</template>
```

## Final Report Format

After validation, produce a report in this format:

```markdown
## BDD Red Phase Verification Complete

### Summary
- **Total Scenarios**: X
- **Expected Failures**: Y ✅
- **Unexpected Failures**: Z ❌
- **Unexpected Passes**: W ⚠️

### Expected Failures (Ready for Implementation)
All failing for correct reasons - missing application code:
1. Patent dashboard page not found (404)
2. Dashboard header element missing
3. Filing strategy component missing
4. [...]

### Issues to Fix Before Implementation
1. ❌ [Description of unexpected failure]
   - **Fix**: [How to fix it]

### Implementation Roadmap
Based on failures, implement in this order:
1. Create `apps/ip-hub-frontend/app/pages/dashboard/patent.vue`
2. Add PatentDashboard component
3. Add required data-testid attributes
4. [...]

### Ready to Proceed: ✅ Yes / ❌ No (fix issues first)
```

## Quality Checklist

### Test Execution

- [ ] All feature files executed
- [ ] No test framework errors
- [ ] Browser launched successfully
- [ ] MSW intercepted API calls correctly

### Failure Analysis

- [ ] Each failure categorized (expected/unexpected)
- [ ] Expected failures clearly indicate missing code
- [ ] Unexpected failures have fixes documented
- [ ] Unexpected passes investigated

### Documentation

- [ ] Implementation roadmap created from failures
- [ ] Clear next steps for each missing component
- [ ] data-testid requirements documented
- [ ] Ready/Not Ready status determined

### Validation

- [ ] TypeScript compiles without errors
- [ ] No import/module resolution errors
- [ ] All unexpected failures addressed
- [ ] Report generated with summary
