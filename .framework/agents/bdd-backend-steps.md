# BDD Backend Steps Agent

> Generates backend e2e step definitions from Gherkin features.

---

## Status

⏳ **Stub** — Needs porting from project-specific playbook.

---

## Input

```typescript
interface BackendStepsInput {
  projectName: string;
  featurePath: string;     // Path to .feature files
  outputPath: string;      // Where to write step definitions
  context: ProjectContext; // From RLM loader
}
```

## Output

- Backend step definition files (NestJS/Jest)
- API client stubs
- Test fixtures / seed data helpers

---

## Process

```
1. Read .feature files from featurePath
2. Identify API operations (GET, POST, PUT, DELETE)
3. Identify domain commands and queries
4. Generate step definitions for each operation
5. Generate API client and fixture helpers
6. Write to outputPath
7. Extract backend patterns to wiki/patterns/
```

---

## Example Output (NestJS)

```typescript
// apps/backend-e2e/steps/cart.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { TestContext } from '../support/test-context';

const ctx = new TestContext();

Given('my cart is empty', async () => {
  await ctx.authenticateAsCustomer();
  const response = await ctx.api.get('/cart');
  expect(response.data.items).toHaveLength(0);
});

When('I add {string} to my cart', async (productName: string) => {
  const product = await ctx.fixtures.findProductByName(productName);
  ctx.lastResponse = await ctx.api.post('/cart/items', {
    productId: product.id,
    quantity: 1
  });
});

Then('my cart should contain {int} item(s)', async (count: number) => {
  const response = await ctx.api.get('/cart');
  expect(response.data.items).toHaveLength(count);
});
```

---

## Stack Support

| Framework | Architecture | Status |
|-----------|--------------|--------|
| NestJS | CQRS | ✅ Target |
| NestJS | MVC | ⏳ Future |
| Express | MVC | ⏳ Future |
| Fastify | — | ⏳ Future |

---

## Refactoring from Playbook

Changes needed from existing playbook:
1. Replace hardcoded `apps/backend-e2e/` with `context.project.path`
2. Add `loadProjectContext()` for architecture detection
3. Generate CQRS-appropriate step definitions (commands vs queries)
4. Use Graphify to find existing domain entities for fixtures
