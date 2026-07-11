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

### Step 2: Resolve the Code Path

Check if the OKF has a `codePaths` field.

**If `codePaths` is present:**
1. Determine the machine identifier in this priority:
   - Environment variable `FLUENTIT_MACHINE`
   - Local config file `~/.fluentit/machine.json` (read with Bash: `cat ~/.fluentit/machine.json 2>/dev/null || echo "{}"`)
   - Hostname: `hostname` command
2. Find the entry in `codePaths` where `machine` matches the identifier.
3. If found, set `{codeRoot}` to that entry's `path`.
4. If not found, STOP and tell the user:
   > "No code path configured for machine '{machineId}' in project '{projectName}'. Please provide the path, or add this to the OKF:\n> codePaths:\n>   - machine: '{machineId}'\n>     path: '<your path here>'"

**If `codePaths` is absent:**
- The project is vault-local. Set `{codeRoot}` = `projects/{projectName}/`.

**From now on, use:**
- `projects/{projectName}/` for OKF, specs, and documentation (vault side)
- `{codeRoot}/` for features, code, tests, and git operations (code side)

### Step 3: Find the Feature File

```bash
find {codeRoot}/features -name "*{featureName}*.feature"
```

Read the feature file.

### Step 4: Check Existing Step Definitions

```bash
find {codeRoot} -path "*/step-definitions/*" -name "*.ts" 2>/dev/null
```

### Step 5: Generate Step Definitions

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
{codeRoot}/{frontendPath}/features/step-definitions/{featureName}.steps.ts
```

### Step 6: Report

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
