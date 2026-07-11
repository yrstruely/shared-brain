---
name: fluentit-tdd-backend
description: Implements backend features from BDD specs using TDD
---

# FluentIT Backend TDD

Red → Green → Clean cycle for backend features.

## Usage

```
fluentit-tdd-backend --project PROJECT_NAME --feature FEATURE_NAME
```

## What It Does

1. Reads the feature file
2. Generates failing controller tests
3. Implements NestJS/Express controller + service
4. Confirms tests pass

## Example

```
fluentit-tdd-backend --project hello-world --feature welcome
```

## Output

- Controller: `backend/src/welcome/welcome.controller.ts`
- Service: `backend/src/welcome/welcome.service.ts`
- Tests: `backend/src/welcome/welcome.controller.spec.ts`

## Next Step

```
fluentit-review --project hello-world
```
