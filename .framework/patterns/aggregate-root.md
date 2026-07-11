# Aggregate Root

> Consistency boundary for domain entities.

---

## Context

A cluster of domain objects must be treated as a single unit for data changes.

## Problem

- Invariants span multiple entities
- Partial updates leave system in inconsistent state
- It's unclear which entity "owns" the consistency rules

## Solution

Designate one entity as the **Aggregate Root**. All external references go through the root. The root enforces invariants for the entire aggregate.

## Implementation (TypeScript)

```typescript
// src/cart/entities/cart.entity.ts
export class Cart {
  private constructor(
    private readonly _id: string,
    private _items: CartItem[] = [],
    private _status: CartStatus = CartStatus.ACTIVE
  ) {}

  static create(id: string): Cart {
    return new Cart(id);
  }

  // Aggregate Root enforces invariants
  addItem(productId: string, quantity: number, price: Money): void {
    if (quantity <= 0) {
      throw new DomainError('Quantity must be positive');
    }

    if (this._status !== CartStatus.ACTIVE) {
      throw new DomainError('Cannot modify a checked-out cart');
    }

    const existingItem = this._items.find(i => i.productId === productId);
    if (existingItem) {
      existingItem.increaseQuantity(quantity);
    } else {
      this._items.push(CartItem.create(productId, quantity, price));
    }

    this.validateInvariants();
  }

  removeItem(productId: string): void {
    this._items = this._items.filter(i => i.productId !== productId);
    this.validateInvariants();
  }

  checkout(): void {
    if (this._items.length === 0) {
      throw new DomainError('Cannot checkout an empty cart');
    }
    this._status = CartStatus.CHECKED_OUT;
    this.addDomainEvent(new CartCheckedOutEvent(this._id));
  }

  private validateInvariants(): void {
    // Cart must not exceed 50 items
    const totalQuantity = this._items.reduce((sum, i) => sum + i.quantity, 0);
    if (totalQuantity > 50) {
      throw new DomainError('Cart cannot contain more than 50 items');
    }
  }

  get id(): string { return this._id; }
  get items(): readonly CartItem[] { return this._items; }
  get status(): CartStatus { return this._status; }
  get total(): Money {
    return this._items.reduce((sum, i) => sum.add(i.subtotal), Money.zero());
  }
}
```

## Rules

1. **Root only** — External code references only the aggregate root
2. **Transactional boundary** — One transaction = one aggregate
3. **Invariants inside** — All business rules live in the aggregate
4. **Events out** — Use domain events to communicate with other aggregates

## Related Patterns

- [[.framework/patterns/repository-pattern\|Repository]] — One repository per aggregate root
- [[.framework/patterns/domain-events\|Domain Events]] — Communicate between aggregates

## Projects Using This Pattern

- [[projects/ip-hub/okf/index\|IP Hub]] — Cart, Order, Product aggregates
