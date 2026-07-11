---
name: fluentit-bdd-backend-steps
description: Generates backend E2E step definitions from Gherkin features
---

# FluentIT BDD Backend Steps

Generates API E2E step definitions from `.feature` files.

## Usage

```
fluentit-bdd-backend-steps --project PROJECT_NAME --feature FEATURE_NAME
```

## Example

```
fluentit-bdd-backend-steps --project hello-world --feature welcome
```

## Output

```
backend/test/e2e/step-definitions/welcome.steps.ts
```

## Next Step

```
fluentit-tdd-backend --project hello-world --feature welcome
```
