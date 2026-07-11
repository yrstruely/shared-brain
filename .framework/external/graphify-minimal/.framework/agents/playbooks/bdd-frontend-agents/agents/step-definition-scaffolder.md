# Step Definition Scaffolder Agent - Generate Cucumber Step Definition Scaffolds

## Purpose

Generate step definition scaffolding from Gherkin feature files by running Cucumber.js in dry-run mode. This agent identifies undefined steps in feature files and creates TypeScript scaffold files that can be implemented in the next phase.

## Initial Input Prompt

**IMPORTANT**: if any of the `Initial Input Prompt` variables are not clear from the prompt, clarify with the user before continuing

```json
{
  "featureFiles": "apps/ip-hub-frontend/features/<<FEATURE-FOLDER>>/*.feature",
  "outputDirectory": "apps/ip-hub-frontend/features/step-definitions/",
  "scaffoldOutputFile": "temp/step-definition-scaffolds.txt",
  "existingStepDefinitions": "apps/ip-hub-frontend/features/step-definitions/**/*.ts",
  "testFramework": "playwright",
  "bddFramework": "cucumber",
  "projectType": "nuxt",
  "language": "typescript",
  "specType": "ui | technical | combined",
  "architectureSpecDirectory": "specs/frontend/<<FEATURE-FOLDER>>/(Architecture/cqrs-contract/)",
  "architectureSpecFile": "specs/frontend/<<FEATURE-FOLDER>>/(Architecture/cqrs-contract/)<<FEATURE>>-architecture.md"
}
```

## Specification Type Awareness

Spec type affects scaffold generation patterns:

| Spec Type     | Architecture Spec | Scaffold Considerations           |
| ------------- | ----------------- | --------------------------------- |
| **ui**        | Not used          | Standard Playwright scaffolds     |
| **technical** | Rarely used       | Frontend typically not involved   |
| **combined**  | Reference for API | Include API-related step patterns |

## Agent Behavior (Step-by-Step)

### 1. Run Cucumber.js Dry Run

Execute the dry-run command to identify undefined step definitions:

```bash
export NODE_OPTIONS='--import=tsx' && npx cucumber-js apps/ip-hub-frontend/features/<<FEATURE-FOLDER>>/*.feature --dry-run --format progress --import 'apps/ip-hub-frontend/features/support/**/*.ts' --import 'apps/ip-hub-frontend/features/step-definitions/**/*.ts'
```

- Capture the output showing missing/undefined steps
- Note which steps are already implemented (to avoid duplicates)

### 2. Analyze Undefined Steps

- Parse the dry-run output to extract undefined step patterns
- Group steps by domain/feature area
- Identify common step patterns that can be parameterized
- Determine which file(s) should contain each step

### 3. Generate Step Definition Scaffolds

Create TypeScript step definition files in `apps/ip-hub-frontend/features/step-definitions/`:

- Use async/await pattern for all steps
- Import required types from `@cucumber/cucumber` and `@playwright/test`
- Follow project naming conventions (kebab-case for files)
- Group related steps by domain/feature
- Include placeholder implementation with `throw new Error('Not implemented')`

### 4. Save Scaffolding Output

- Save undefined steps list to: `temp/step-definition-scaffolds.txt`
- Create/update step definition files in output directory

### 5. Validate Scaffolds

- Run TypeScript compiler (`tsc --noEmit`) to verify scaffolds compile
- Re-run dry-run to confirm step count matches expectations
- If issues found, fix and repeat until validation passes

## Step Definition Template

```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { ICustomWorld } from "../support/world";

Given("step text here", async function (this: ICustomWorld) {
  if (!this.page) throw new Error("Page not initialized");
  // TODO: Implement this step
  throw new Error("Not implemented");
});

When(
  "Alice navigates to the {string} page",
  async function (this: ICustomWorld, pageName: string) {
    if (!this.page) throw new Error("Page not initialized");
    // TODO: Implement navigation
    throw new Error("Not implemented");
  }
);

Then(
  "Alice sees the {string} header",
  async function (this: ICustomWorld, headerText: string) {
    if (!this.page) throw new Error("Page not initialized");
    // TODO: Implement assertion
    throw new Error("Not implemented");
  }
);
```

## Common Step Patterns

### Given Steps (Setup/Preconditions)

```typescript
// User authentication
Given("Alice is an authenticated user", async function (this: ICustomWorld) {
  // Setup authenticated session
});

// Data state
Given(
  "Alice has {int} active patents",
  async function (this: ICustomWorld, count: number) {
    // MSW mock data should return this count
  }
);

// Navigation state
Given(
  "Alice is on the {string} page",
  async function (this: ICustomWorld, pageName: string) {
    // Navigate to page
  }
);
```

### When Steps (Actions)

```typescript
// Navigation
When(
  "Alice navigates to the {string} page",
  async function (this: ICustomWorld, pageName: string) {
    await this.page?.goto(`/${pageName}`);
  }
);

// Clicks
When(
  "Alice clicks the {string} button",
  async function (this: ICustomWorld, buttonText: string) {
    await this.page?.getByRole("button", { name: buttonText }).click();
  }
);

// Form inputs
When(
  "Alice enters {string} in the {string} field",
  async function (this: ICustomWorld, value: string, fieldName: string) {
    await this.page?.getByLabel(fieldName).fill(value);
  }
);

// Selections
When(
  "Alice selects {string} from the {string} dropdown",
  async function (this: ICustomWorld, option: string, dropdownName: string) {
    await this.page?.getByLabel(dropdownName).selectOption(option);
  }
);
```

### Then Steps (Assertions)

```typescript
// Visibility
Then(
  "Alice sees the {string} header",
  async function (this: ICustomWorld, headerText: string) {
    await expect(
      this.page?.getByRole("heading", { name: headerText })
    ).toBeVisible();
  }
);

// Text content
Then(
  "Alice sees {string} displayed",
  async function (this: ICustomWorld, text: string) {
    await expect(this.page?.getByText(text)).toBeVisible();
  }
);

// Element state
Then(
  "the {string} button is disabled",
  async function (this: ICustomWorld, buttonText: string) {
    await expect(
      this.page?.getByRole("button", { name: buttonText })
    ).toBeDisabled();
  }
);

// Count assertions
Then(
  "Alice sees {int} items in the list",
  async function (this: ICustomWorld, count: number) {
    await expect(this.page?.getByRole("listitem")).toHaveCount(count);
  }
);
```

### Data Table Steps

```typescript
import { DataTable } from "@cucumber/cucumber";

Then(
  "Alice sees the following items:",
  async function (this: ICustomWorld, dataTable: DataTable) {
    const expectedItems = dataTable.hashes();
    for (const item of expectedItems) {
      await expect(this.page?.getByText(item.name)).toBeVisible();
    }
  }
);
```

## Project-Specific Context

### Directory Structure

| Directory                                             | Purpose                                                   |
| ----------------------------------------------------- | --------------------------------------------------------- |
| `apps/ip-hub-frontend/features/**/*.feature`          | Gherkin feature files                                     |
| `apps/ip-hub-frontend/features/step-definitions/*.ts` | Step definition implementations                           |
| `apps/ip-hub-frontend/features/support/world.ts`      | Custom World class with Playwright Browser, Page, Context |
| `apps/ip-hub-frontend/features/support/hooks.ts`      | Before/After hooks for browser lifecycle                  |
| `apps/ip-hub-frontend/features/support/types.ts`      | TypeScript interfaces for domain models                   |
| `apps/ip-hub-frontend/features/support/helpers.ts`    | Utility functions (e.g., toTestId)                        |

### Technology Stack

| Technology         | Version | Purpose               |
| ------------------ | ------- | --------------------- |
| @cucumber/cucumber | 11.3.0  | BDD Framework         |
| Playwright         | 1.55.1  | Browser Automation    |
| TypeScript         | 5.9.3   | Language              |
| @playwright/test   | -       | Assertions (NOT Chai) |

### Cucumber Configuration

Located in `apps/ip-hub-frontend/cucumber.cjs`:

```javascript
{
  format: [
    'progress-bar',
    'json:reports/cucumber_report.json',
    'html:reports/cucumber_report.html'
  ],
  formatOptions: { snippetInterface: 'async-await' },
  paths: ['apps/ip-hub-frontend/features/**/*.feature'],
  parallel: 1
}
```

### Naming Conventions

| Convention            | Example                               |
| --------------------- | ------------------------------------- |
| Step definition files | `dashboard-steps.ts`, `user-steps.ts` |
| File naming           | kebab-case                            |
| Step functions        | async/await pattern                   |
| Element selection     | `data-testid` attributes              |

### Grouping Steps by Domain

| File                     | Steps For                                      |
| ------------------------ | ---------------------------------------------- |
| `common-steps.ts`        | Authentication, navigation, generic assertions |
| `dashboard-steps.ts`     | Dashboard-specific views and interactions      |
| `application-steps.ts`   | Patent/trademark/copyright application flows   |
| `collaboration-steps.ts` | Collaborator management, access control        |

## Best Practices

### Do

- Use async/await for all step definitions
- Import `expect` from `@playwright/test` (NOT Chai)
- Type the World context: `this: ICustomWorld`
- Check `this.page` exists before using
- Use Playwright locators (`getByRole`, `getByText`, `getByTestId`)
- Parameterize common patterns with `{string}`, `{int}`, etc.
- Group related steps in domain-specific files

### Don't

- Use synchronous step definitions
- Import assertion libraries other than Playwright's expect
- Forget to handle the case where `this.page` is undefined
- Use CSS selectors when semantic locators are available
- Create overly specific steps that can't be reused
- Put all steps in a single file

## Scaffold Output Format

The `temp/step-definition-scaffolds.txt` file should contain:

```text
# Undefined Steps from: apps/ip-hub-frontend/features/dashboard/*.feature
# Generated: [timestamp]
# Total: 25 undefined steps

## dashboard-steps.ts (15 steps)

Given('Alice is on the dashboard page', async function (this: ICustomWorld) {
  // TODO: Implement
  throw new Error('Not implemented')
})

When('Alice clicks the "View Details" button', async function (this: ICustomWorld) {
  // TODO: Implement
  throw new Error('Not implemented')
})

...

## common-steps.ts (10 steps)

Given('Alice is an authenticated user', async function (this: ICustomWorld) {
  // TODO: Implement
  throw new Error('Not implemented')
})

...
```

## Quality Checklist

### Dry Run Execution

- [ ] Dry-run command executed successfully
- [ ] Undefined steps captured from output
- [ ] Existing step definitions not duplicated

### Scaffold Generation

- [ ] Step definition files created in correct directory
- [ ] Files follow kebab-case naming convention
- [ ] Steps grouped by domain/feature
- [ ] All steps use async/await pattern
- [ ] ICustomWorld type annotation included
- [ ] Page null check included in each step

### Scaffold Quality

- [ ] Parameterized patterns used where appropriate
- [ ] Common steps extracted to `common-steps.ts`
- [ ] Placeholder `throw new Error('Not implemented')` included
- [ ] TypeScript imports are correct

### Validation

- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] Re-run dry-run shows expected step count
- [ ] Scaffold output file created at `temp/step-definition-scaffolds.txt`
- [ ] Ready for next step (step definition implementation)
