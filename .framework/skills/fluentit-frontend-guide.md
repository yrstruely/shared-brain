---
description: Guides frontend feature implementation from specs to delivery. Adapts to Vue/React/Angular.
argument-hint: Provide feature name and project name.
---

# Frontend Development Guide

> Guides frontend feature implementation from requirements to delivery.

## How to Use

```
fluentit-frontend-guide --project hello-world --feature welcome
```

## What This Skill Does

1. Reads the OKF for frontend framework info
2. Reads the feature file
3. Implements pages, components, and composables
4. Runs tests and build

## Step-by-Step

### Step 1: Read Context

- OKF: `projects/{projectName}/okf/index.md`
- Feature: `projects/{projectName}/features/{featureName}.feature`

### Step 2: Plan Implementation

Identify what to build:
- Pages needed
- Components needed
- API calls needed
- State management needed

Present plan to user. Wait for confirmation.

### Step 3: Implement

Create files one at a time:
1. Types/interfaces
2. API service/composable
3. Components
4. Pages
5. Tests

After each file, run tests:
```bash
cd projects/{projectName}/{frontendPath} && npm test
```

### Step 4: Validate

```bash
cd projects/{projectName}/{frontendPath} && npm run build
```

## Error Handling

| Problem | Response |
|---------|----------|
| No feature file | "Run fluentit-bdd-features first." |
| Build fails | Fix TypeScript errors, missing imports |
| Tests fail | Debug component rendering, mock API calls |
