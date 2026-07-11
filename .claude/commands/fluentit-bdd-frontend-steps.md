---
name: fluentit-bdd-frontend-steps
description: Generates frontend E2E step definitions from Gherkin features
---

# FluentIT BDD Frontend Steps

Generates Playwright/Cypress step definitions from `.feature` files.

## Usage

```
fluentit-bdd-frontend-steps --project PROJECT_NAME --feature FEATURE_NAME
```

## Example

```
fluentit-bdd-frontend-steps --project hello-world --feature welcome
```

## Output

```
frontend/features/step-definitions/welcome.steps.ts
```

## Next Step

```
fluentit-tdd-frontend --project hello-world --feature welcome
```
