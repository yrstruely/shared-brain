---
description: Generates frontend E2E step definitions from Gherkin features. Creates Playwright/Cypress step files.
argument-hint: Provide project name and feature name.
---

# Frontend BDD Step Definitions

> Reads Gherkin feature files and generates Playwright/Cypress step definitions.

## How to Use

```
fluentit-bdd-frontend-steps --project hello-world --feature welcome
```

## What This Skill Does

1. Reads the feature file
2. Generates step definition TypeScript file
3. Writes it to the frontend test directory

## Step-by-Step

### Step 1: Read the OKF

Read `projects/{projectName}/okf/index.md` to find:
- `paths.frontend` — frontend source path
- `techStack.e2e` — Playwright, Cypress, etc.

### Step 2: Find the Feature File

```bash
find projects/{projectName}/features -name "*{featureName}*.feature"
```

Read the feature file.

### Step 3: Check Existing Step Definitions

```bash
find projects/{projectName} -path "*/step-definitions/*" -name "*.ts" 2>/dev/null
```

### Step 4: Generate Step Definitions

For each `@frontend` scenario in the feature file, generate step definitions.

**For Playwright:**
```typescript
import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

Given('the user opens the application', async () => {
  await page.goto('/')
})

When('the page finishes loading', async () => {
  await page.waitForLoadState('networkidle')
})

Then('the user sees {string} displayed on the screen', async (text: string) => {
  await expect(page.locator('body')).toContainText(text)
})
```

Use Write to create:
```
projects/{projectName}/{frontendPath}/features/step-definitions/{featureName}.steps.ts
```

### Step 5: Report

```
✅ Generated step definitions: {path}

Steps:
  - Given: [count]
  - When: [count]
  - Then: [count]

Next: fluentit-tdd-frontend --project {name} --feature {feature}
```

## Error Handling

| Problem | Response |
|---------|----------|
| No feature file | "Run fluentit-bdd-features first." |
| No frontend tests directory | "Create {frontendPath}/features/step-definitions/ first." |
| Step definitions exist | Ask: "Overwrite? [Y/n]" |
