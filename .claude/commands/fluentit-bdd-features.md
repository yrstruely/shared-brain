---
name: fluentit-bdd-features
description: Generates Gherkin .feature files from PRDs and specs
---

# FluentIT BDD Feature Generator

Reads PRDs/specs and writes Gherkin `.feature` files.

## Usage

```
fluentit-bdd-features --project PROJECT_NAME --specs PATH_TO_SPEC
```

## What It Does

1. Reads the project OKF
2. Reads the spec file(s)
3. Generates declarative Gherkin scenarios
4. Writes to `projects/{name}/features/`

## Example

```
fluentit-bdd-features --project hello-world --specs specs/welcome.md
```

## Output

```
projects/hello-world/features/welcome.feature
```

## Next Step

```
fluentit-bdd-frontend-steps --project hello-world --feature welcome
fluentit-bdd-backend-steps --project hello-world --feature welcome
```
