---
description: Generates backend E2E step definitions from Gherkin features. Creates API test steps.
argument-hint: Provide project name and feature name.
---

# Backend BDD Step Definitions

> Reads Gherkin feature files and generates backend API E2E step definitions.

## How to Use

```
fluentit-bdd-backend-steps --project hello-world --feature welcome
```

## What This Skill Does

1. Reads the feature file
2. Generates backend step definition TypeScript file
3. Writes it to the backend test directory

## Step-by-Step

### Step 1: Read the OKF

Read `projects/{projectName}/okf/index.md` to find:
- `paths.backend` — backend source path
- `techStack.backend` — NestJS, Express, etc.

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

Read the feature file. Focus on `@backend` scenarios.

### Step 4: Generate Step Definitions

For each `@backend` scenario, generate API test steps.

**For NestJS/Jest + supertest:**
```typescript
import { Given, When, Then } from '@cucumber/cucumber'
import * as request from 'supertest'

Given('the backend service is running', () => {
  // App is already initialized in beforeAll
})

When('a GET request is made to {string}', async (path: string) => {
  this.response = await request(app.getHttpServer()).get(path)
})

Then('the response status is {int}', (status: number) => {
  expect(this.response.status).toBe(status)
})

Then('the response body contains {string}', (bodyText: string) => {
  expect(this.response.body).toMatchObject(JSON.parse(bodyText))
})
```

Use Write to create:

**⚠️ Verify the write path:**
- The resolved codeRoot is: {codeRoot}
- This step file MUST be written to: `{codeRoot}/{backendPath}/test/e2e/step-definitions/{featureName}.steps.ts`
- DO NOT write to `projects/{projectName}/...`
```
{codeRoot}/{backendPath}/test/e2e/step-definitions/{featureName}.steps.ts
```

### Step 5: Report

```
✅ Generated backend step definitions: {path}

Next: fluentit-tdd-backend --project {name} --feature {feature}
```

## Error Handling

| Problem | Response |
|---------|----------|
| No feature file | "Run fluentit-bdd-features first." |
| No backend test directory | "Create {backendPath}/test/e2e/ first." |
| supertest not installed | "Install dev dependency: npm install -D supertest" |
