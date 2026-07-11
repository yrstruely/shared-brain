---
description: Generates Gherkin .feature files from PRDs and specs. The pipeline entry point.
argument-hint: Provide the spec file or folder path and project name.
---

# BDD Feature Generator

> Reads PRDs/specs and writes Gherkin .feature files with declarative scenarios.

## How to Use

```
fluentit-bdd-features --project hello-world --specs specs/welcome.md
```

Or for a folder of specs:
```
fluentit-bdd-features --project hello-world --specs specs/
```

## What This Skill Does

1. **Reads the OKF** to understand the project
2. **Reads the spec file(s)** provided by the user
3. **Generates one or more `.feature` files** with Gherkin scenarios
4. **Writes them to `{codeRoot}/features/`**

## Step-by-Step Instructions

### Step 1: Read the OKF

Use the Read tool to open `projects/{projectName}/okf/index.md`.

If the file doesn't exist, STOP and tell the user:
> "Project '{projectName}' not found. Create the OKF at projects/{projectName}/okf/index.md first."

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

### Step 3: Read the Spec

Use the Read tool to open the spec file the user provided.

If the user provided a folder path (`--specs specs/`), use the Bash tool to list files:
```bash
ls projects/{projectName}/{specPath}
```
Then Read each `.md` file in that folder.

### Step 4: Generate the Feature File

Create a Gherkin feature file based on the spec content.

**Template:**
```gherkin
@feature-tag
Feature: [Feature Name from spec]
  In order to [business value from spec]
  As a [user role from spec]
  I want to [capability from spec]

  Background:
    Given [common precondition if applicable]

  @frontend @ui
  Scenario: [Happy path scenario name]
    Given [context from spec]
    When [action from spec]
    Then [outcome from spec]

  @backend @api
  Scenario: [API scenario name]
    Given [context]
    When [action]
    Then [outcome]
```

**Rules:**
- Use **declarative style** — describe WHAT, not HOW
- Tag scenarios with `@frontend` or `@backend` as appropriate
- Tag the feature with a domain tag (e.g., `@welcome`, `@user-profile`)
- Include all scenarios from the spec
- Add `@wip` tag if the spec is incomplete

### Step 5: Write the Feature File

Use the Write tool to create:
```
{codeRoot}/features/{feature-name}.feature
```

If the `features/` directory doesn't exist, create it first using the Bash tool:
```bash
mkdir -p {codeRoot}/features
```

### Step 6: Report What Was Done

Tell the user:
```
✅ Generated: {codeRoot}/features/{feature-name}.feature

Scenarios:
  - [scenario 1 name] (@frontend)
  - [scenario 2 name] (@backend)

Next steps:
  1. Review the feature file
  2. Run: fluentit-bdd-frontend-steps --project {projectName}
  3. Run: fluentit-bdd-backend-steps --project {projectName}
```

## Error Handling

| Problem | Response |
|---------|----------|
| Spec file not found | "Spec not found at {path}. Please check the path and try again." |
| Spec is empty | "The spec file is empty. Please write acceptance criteria first." |
| No scenarios in spec | "No scenarios found in the spec. Add Given/When/Then blocks." |
| Feature file already exists | Ask user: "features/{name}.feature already exists. Overwrite? [Y/n]" |
| OKF missing | "Project '{name}' not initialized. Create okf/index.md first." |

## Example

**Input spec (`specs/welcome.md`):**
```markdown
## Feature
As a user, I want to see a welcome message.

## Acceptance Criteria
Given the user opens the application
When the page finishes loading
Then the user sees "Hello, World!"
```

**Output (`features/welcome.feature`):**
```gherkin
@welcome
Feature: Welcome Message
  In order to know the app loaded
  As a user
  I want to see a welcome message

  @frontend @ui
  Scenario: User sees welcome message
    Given the user opens the application
    When the page finishes loading
    Then the user sees "Hello, World!"
```

## Important Notes

- This skill **writes files**. Always confirm the output path with the user if overwriting.
- The generated feature should be reviewed by the user before proceeding to step definitions.
- If the spec has multiple features, generate one `.feature` file per feature.
