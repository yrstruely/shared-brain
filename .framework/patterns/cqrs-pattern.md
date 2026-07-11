# CQRS Command/Query Separation

> Separate read and write models for complex domains.

---

## Context

Your domain has complex business logic and high read/write ratio. Reads and writes have different performance and consistency requirements.

## Problem

- Same model for reads and writes leads to over-engineering
- Read optimizations (denormalization, projections) pollute write model
- Write model validation logic is unnecessary for reads

## Solution

Split into two models:
1. **Command Model** — Handles writes, enforces business rules
2. **Query Model** — Handles reads, optimized for performance

## Implementation (NestJS)

```typescript
// Command side
// src/cart/commands/add-item-to-cart.command.ts
export class AddItemToCartCommand {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
    public readonly quantity: number
  ) {}
}

// src/cart/commands/add-item-to-cart.handler.ts
@CommandHandler(AddItemToCartCommand)
export class AddItemToCartHandler {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(command: AddItemToCartCommand): Promise<void> {
    const cart = await this.cartRepository.findById(command.cartId);
    cart.addItem(command.productId, command.quantity);
    await this.cartRepository.save(cart);
  }
}

// Query side
// src/cart/queries/get-cart.query.ts
export class GetCartQuery {
  constructor(public readonly cartId: string) {}
}

// src/cart/queries/get-cart.handler.ts
@QueryHandler(GetCartQuery)
export class GetCartHandler {
  constructor(private readonly cartProjection: CartProjection) {}

  async execute(query: GetCartQuery): Promise<CartDto> {
    return this.cartProjection.findById(query.cartId);
  }
}

// Projection (denormalized read model)
// src/cart/projections/cart.projection.ts
@Injectable()
export class CartProjection {
  constructor(@InjectRepository(CartView) private readonly viewRepo: Repository<CartView>) {}

  async findById(cartId: string): Promise<CartDto> {
    return this.viewRepo.findOne({ where: { cartId } });
  }
}
```

## Consequences

**Pros:**
- Independent optimization of read/write models
- Clear separation of concerns
- Easier to scale read and write independently

**Cons:**
- Eventual consistency between models
- More complex architecture
- More code to maintain

## Related Patterns

- [[.framework/patterns/domain-events\|Domain Events]] — Sync command and query models
- [[.framework/patterns/repository-pattern\|Repository]] — Repositories split by command/query

## Projects Using This Pattern

- [[projects/ip-hub/okf/index\|IP Hub]] — All bounded contexts use CQRS

## Anti-Patterns to Avoid

- **Over-CQRS** — Using CQRS for simple CRUD where it's unnecessary
- **Immediate Consistency** — Trying to force strong consistency between models
