# Domain Events

> Decoupled communication between bounded contexts.

---

## Context

Multiple aggregates or bounded contexts need to react to state changes without tight coupling.

## Problem

- Direct method calls create spaghetti dependencies
- Services need to know about each other
- Side effects are hidden in transaction boundaries

## Solution

Publish **Domain Events** from aggregates. Other bounded contexts subscribe and react asynchronously.

## Implementation (NestJS)

```typescript
// src/shared/events/domain-event.ts
export abstract class DomainEvent {
  readonly occurredOn: Date = new Date();
  abstract readonly eventType: string;
}

// src/cart/events/cart-checked-out.event.ts
export class CartCheckedOutEvent extends DomainEvent {
  readonly eventType = 'cart.checked-out';
  constructor(
    public readonly cartId: string,
    public readonly items: CartItemDto[],
    public readonly total: Money
  ) { super(); }
}

// src/cart/entities/cart.entity.ts
export class Cart {
  private _domainEvents: DomainEvent[] = [];

  checkout(): void {
    // ... validation ...
    this._status = CartStatus.CHECKED_OUT;
    this._domainEvents.push(new CartCheckedOutEvent(
      this._id,
      this._items.map(i => i.toDto()),
      this.total
    ));
  }

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }

  clearEvents(): void {
    this._domainEvents = [];
  }
}

// src/orders/handlers/cart-checked-out.handler.ts
@EventsHandler(CartCheckedOutEvent)
export class CartCheckedOutHandler {
  constructor(private readonly orderService: OrderService) {}

  async handle(event: CartCheckedOutEvent): Promise<void> {
    await this.orderService.createOrder({
      cartId: event.cartId,
      items: event.items,
      total: event.total
    });
  }
}
```

## Event Bus Integration

```typescript
// src/shared/events/event-publisher.ts
@Injectable()
export class EventPublisher {
  constructor(private readonly eventBus: EventBus) {}

  async publishEvents(aggregate: AggregateRoot): Promise<void> {
    const events = aggregate.domainEvents;
    aggregate.clearEvents();

    for (const event of events) {
      await this.eventBus.publish(event);
    }
  }
}
```

## Related Patterns

- [[.framework/patterns/aggregate-root\|Aggregate Root]] — Events originate from aggregates
- [[.framework/patterns/cqrs-pattern\|CQRS]] — Events sync read models

## Projects Using This Pattern

- [[projects/ip-hub/okf/index\|IP Hub]] — Cart → Order, Order → Fulfillment
