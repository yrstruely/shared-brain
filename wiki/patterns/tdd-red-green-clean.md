> **Type:** Pattern
> **Source:** `.framework/skills/fluentit-tdd-*.md`
> **Related:** [[wiki/patterns/bdd-pipeline|BDD Pipeline]], [[wiki/concepts/project-context|ProjectContext]]

# TDD Red-Green-Clean

The **Red-Green-Clean** cycle is the core implementation pattern of the framework. Every TDD skill (frontend and backend) follows this disciplined approach.

---

## The Cycle

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    RED      │ →  │   GREEN     │ →  │   CLEAN     │
│             │    │             │    │             │
│ Write tests │    │ Minimal code│    │ Refactor    │
│ that fail   │    │ to pass     │    │ with tests  │
│             │    │             │    │ as safety   │
└─────────────┘    └─────────────┘    └─────────────┘
       ↑                                    │
       └────────────────────────────────────┘
                    (repeat)
```

---

## RED — Write Failing Tests

**Goal:** Define the expected behavior before writing implementation.

**Rules:**
1. Write tests first — always
2. Tests must fail for the right reason
3. One concept per test
4. Use concrete examples, not abstractions

**Frontend Example (Playwright):**
```typescript
// components/CartItem.spec.ts
it('displays product name and price', () => {
  const wrapper = mount(CartItem, {
    props: { item: { name: 'Premium Widget', price: 29.99 } }
  });
  expect(wrapper.text()).toContain('Premium Widget');
  expect(wrapper.text()).toContain('$29.99');
});
```

**Backend Example (Jest):**
```typescript
// cart/commands/add-item.handler.spec.ts
it('adds item to cart', async () => {
  const handler = new AddItemToCartHandler(repository);
  await handler.execute({ cartId: '1', productId: '2', quantity: 1 });
  expect(cart.addItem).toHaveBeenCalledWith('2', 1);
});
```

---

## GREEN — Minimal Implementation

**Goal:** Write the simplest code that makes tests pass.

**Rules:**
1. Write only enough code to pass
2. Don't add features not tested
3. It's okay to be ugly — tests pass
4. Copy/paste is acceptable temporarily

**Frontend Example:**
```vue
<template>
  <div class="cart-item">
    <span>{{ item.name }}</span>
    <span>${{ item.price }}</span>
  </div>
</template>
```

**Backend Example:**
```typescript
async execute(command: AddItemToCartCommand): Promise<void> {
  const cart = await this.repository.findById(command.cartId);
  cart.addItem(command.productId, command.quantity);
  await this.repository.save(cart);
}
```

---

## CLEAN — Refactor

**Goal:** Improve code quality without changing behavior.

**Rules:**
1. All tests must still pass
2. One refactoring at a time
3. If tests break, revert immediately
4. Focus on: naming, duplication, complexity

**Refactoring Targets:**

| Target | Example |
|--------|---------|
| Extract component | Large component → smaller sub-components |
| Extract composable/hook | Duplicated logic → reusable function |
| Extract value object | Primitive obsession → typed object |
| Extract domain service | Complex handler → service class |
| Improve types | `any` → proper interface |

---

## Validation Gates

Between each phase, validation ensures quality:

### After RED
- ✅ Tests fail for expected reason
- ❌ Tests fail due to syntax error
- ❌ Tests pass (shouldn't happen)

### After GREEN
- ✅ All tests pass
- ✅ TypeScript compiles
- ✅ Lint passes

### After CLEAN
- ✅ All tests still pass
- ✅ Same test count as before
- ✅ TypeScript + lint still pass
- ✅ No behavioral changes

---

## Frontend vs Backend TDD

| Aspect | Frontend TDD | Backend TDD |
|--------|-------------|-------------|
| **Test types** | Unit (Vitest), Integration, E2E (Playwright) | Unit (Jest), Integration, E2E (Cucumber) |
| **RED phase** | Generate component tests | Generate handler/entity tests |
| **GREEN phase** | Implement Vue/React components | Implement CQRS handlers / MVC controllers |
| **CLEAN phase** | Extract composables, improve types | Extract value objects, domain services |
| **Architecture** | Component-based, accessibility-first | DDD: Domain → Infra → App → API |

---

## Shortcuts

For experienced users, each TDD skill supports shortcuts:

| Shortcut | Phases | Use When |
|----------|--------|----------|
| `full` | All | New feature |
| `implement` | Green + Validate | Tests already exist |
| `validate` | Validate only | Need to verify current state |
| `refactor` | Clean + Validate | Tests pass, code needs cleanup |

---

## Related

- [[wiki/patterns/bdd-pipeline|BDD Pipeline]] — What happens before TDD
- [[technologies/fluentit-tdd-frontend|fluentit-tdd-frontend]]
- [[technologies/fluentit-tdd-backend|fluentit-tdd-backend]]
- [[entities/playwright|playwright]] — Frontend E2E testing
- [[entities/cucumber|cucumber]] — Backend testing
