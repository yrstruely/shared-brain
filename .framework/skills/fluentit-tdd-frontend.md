---
description: Implements frontend features from BDD specs using TDD (Red → Green → Clean). Generates tests, then implements Vue/React components.
argument-hint: Provide the project name and feature name (e.g., --project hello-world --feature welcome)
---

# Frontend TDD Implementation

> Red → Green → Clean cycle for frontend features. Generates tests, then implements the component.

## How to Use

```
fluentit-tdd-frontend --project hello-world --feature welcome
```

## What This Skill Does

1. **Reads the OKF** to understand the project tech stack
2. **Reads the feature file** to understand what to implement
3. **Generates failing tests** (Red)
4. **Implements the component** to make tests pass (Green)
5. **Runs tests** to confirm

## Step-by-Step Instructions

### Step 1: Read the OKF

Use the Read tool to open `projects/{projectName}/okf/index.md`.

Extract:
- `techStack.frontend` — Vue, React, Angular, etc.
- `paths.frontend` — where frontend code lives
- `paths.tests` — where tests live

If OKF doesn't exist, STOP and tell the user to create it.

### Step 2: Find the Feature File

Use the Bash tool to find the feature file:
```bash
find projects/{projectName}/features -name "*{featureName}*.feature" 2>/dev/null
```

Use the Read tool to read the matching `.feature` file.

If no feature file found, STOP and tell the user:
> "No feature file found for '{featureName}'. Run fluentit-bdd-features first."

### Step 3: Check Existing Code

Use the Bash tool to see what already exists:
```bash
# Check for existing component
find projects/{projectName}/{frontendPath} -name "*{featureName}*.vue" -o -name "*{featureName}*.tsx" 2>/dev/null

# Check for existing tests
find projects/{projectName}/{frontendPath} -name "*{featureName}*.spec.*" 2>/dev/null
```

### Step 4: Generate Tests (Red)

Based on the feature file scenarios, generate a test file.

**For Vue/Vitest:**
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import WelcomeMessage from '../components/WelcomeMessage.vue'

describe('WelcomeMessage', () => {
  it('displays welcome message', () => {
    const wrapper = mount(WelcomeMessage, {
      global: { plugins: [createPinia()] }
    })
    expect(wrapper.text()).toContain('Hello, World!')
  })
})
```

**For React/Testing Library:**
```typescript
import { render, screen } from '@testing-library/react'
import WelcomeMessage from '../components/WelcomeMessage'

describe('WelcomeMessage', () => {
  it('displays welcome message', () => {
    render(<WelcomeMessage />)
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
  })
})
```

Use the Write tool to create the test file at:
```
projects/{projectName}/{frontendPath}/components/{FeatureName}.spec.ts
```

### Step 5: Run Tests (Confirm Red)

Use the Bash tool:
```bash
cd projects/{projectName}/{frontendPath} && npm test -- {FeatureName}.spec.ts 2>&1
```

The tests should **fail** because the component doesn't exist yet. If they pass, something is wrong.

### Step 6: Implement Component (Green)

Create the component that makes the tests pass.

**For Vue:**
```vue
<template>
  <div class="{kebab-case-feature}">
    <!-- Implementation here -->
  </div>
</template>

<script setup lang="ts">
// Component logic
</script>

<style scoped>
/* Component styles */
</style>
```

**For React:**
```tsx
export default function {FeatureName}() {
  return (
    <div className="{kebab-case-feature}">
      {/* Implementation */}
    </div>
  )
}
```

Use the Write tool to create the component at:
```
projects/{projectName}/{frontendPath}/components/{FeatureName}.vue
```

### Step 7: Run Tests (Confirm Green)

```bash
cd projects/{projectName}/{frontendPath} && npm test -- {FeatureName}.spec.ts 2>&1
```

Tests should now **pass**.

### Step 8: Report Results

Tell the user:
```
✅ Frontend TDD Complete: {featureName}

Tests: PASS
Component: projects/{projectName}/{frontendPath}/components/{FeatureName}.vue

Next steps:
  - Review the component
  - Run: fluentit-review --project {projectName}
  - Or proceed to: fluentit-tdd-backend --project {projectName} --feature {featureName}
```

## Error Handling

| Problem | Response |
|---------|----------|
| Feature file not found | "Run fluentit-bdd-features first to create the feature file." |
| Component already exists | Ask: "Component already exists. Overwrite? [Y/n]" |
| Tests already pass | "Tests already passing. Component may already be implemented." |
| Tests fail after implementation | Debug and fix. Check component props, rendering, data-testid. |
| Build fails | Check TypeScript types, imports, and framework-specific syntax. |
| No test framework configured | "No test framework found. Configure Vitest/Jest first." |

## Important Notes

- This skill **writes files** (tests + component).
- The component should be minimal — just enough to make tests pass.
- Add `data-testid` attributes for testability.
- Use the project's tech stack (Vue, React, etc.) based on the OKF.
- If the project uses a specific component library (Vuetify, shadcn, etc.), use those components.
