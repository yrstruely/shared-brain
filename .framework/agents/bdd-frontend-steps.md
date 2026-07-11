# BDD Frontend Steps Agent

> Generates frontend e2e step definitions from Gherkin features.

---

## Status

⏳ **Stub** — Needs porting from project-specific playbook.

---

## Input

```typescript
interface FrontendStepsInput {
  projectName: string;
  featurePath: string;     // Path to .feature files
  outputPath: string;      // Where to write step definitions
  context: ProjectContext; // From RLM loader
}
```

## Output

- Step definition files (Playwright / Cypress)
- Page object stubs
- Updated wiki with frontend patterns

---

## Process

```
1. Read .feature files from featurePath
2. Identify UI interactions (click, type, navigate, assert)
3. Generate step definitions for each interaction
4. Generate page object stubs for referenced pages
5. Write to outputPath
6. Extract frontend patterns to wiki/patterns/
```

---

## Example Output (Playwright)

```typescript
// steps/cart.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { CartPage } from '../pages/cart.page';

const cartPage = new CartPage();

Given('my cart is empty', async () => {
  await cartPage.navigate();
  await cartPage.assertEmpty();
});

When('I add {string} to my cart', async (productName: string) => {
  await cartPage.addItem(productName);
});

Then('my cart should contain {int} item(s)', async (count: number) => {
  await cartPage.assertItemCount(count);
});

Then('the cart total should be ${float}', async (total: number) => {
  await cartPage.assertTotal(total);
});
```

---

## Stack Support

| Framework | Test Runner | Status |
|-----------|-------------|--------|
| Nuxt 4 / Vue 3 | Playwright | ✅ Target |
| React / Next.js | Playwright | ⏳ Future |
| Angular | Cypress | ⏳ Future |

---

## Refactoring from Playbook

Changes needed from existing playbook:
1. Replace hardcoded `e2e/` paths with `context.project.path`
2. Add `loadProjectContext()` for techStack detection
3. Generate stack-appropriate step definitions
4. Use RLM to load page object patterns from wiki
