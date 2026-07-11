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

### Step 2: Find the Feature File

```bash
find projects/{projectName}/features -name "*{featureName}*.feature"
```

Read the feature file. Focus on `@backend` scenarios.

### Step 3: Generate Step Definitions

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
```
projects/{projectName}/{backendPath}/test/e2e/step-definitions/{featureName}.steps.ts
```

### Step 4: Report

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
