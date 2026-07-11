---
name: fluentit-tdd-frontend
description: Implements frontend features from BDD specs using TDD
---

# FluentIT Frontend TDD

Red → Green → Clean cycle for frontend features.

## Usage

```
fluentit-tdd-frontend --project PROJECT_NAME --feature FEATURE_NAME
```

## What It Does

1. Reads the feature file
2. Generates failing tests
3. Implements the Vue/React component
4. Confirms tests pass

## Example

```
fluentit-tdd-frontend --project hello-world --feature welcome
```

## Output

- Test file: `frontend/src/components/WelcomeMessage.spec.ts`
- Component: `frontend/src/components/WelcomeMessage.vue`

## Next Step

```
fluentit-review --project hello-world
```
