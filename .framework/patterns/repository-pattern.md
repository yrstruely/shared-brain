# Repository with Unit of Work

> Abstract data access with transaction boundary management.

---

## Context

You need to persist domain aggregates while maintaining consistency across multiple operations.

## Problem

- Direct database calls leak persistence concerns into domain logic
- Multiple related operations need atomic transaction boundaries
- Testing is hard when persistence is tightly coupled

## Solution

1. **Repository** — Abstracts collection-like access to aggregates
2. **Unit of Work** — Tracks changes and commits atomically

## Implementation (NestJS + TypeORM)

```typescript
// src/shared/repositories/repository.interface.ts
export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

// src/cart/repositories/cart.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { IRepository } from '../../shared/repositories/repository.interface';

@Injectable()
export class CartRepository implements IRepository<Cart> {
  constructor(
    @InjectRepository(Cart)
    private readonly repo: Repository<Cart>
  ) {}

  async findById(id: string): Promise<Cart | null> {
    return this.repo.findOne({ where: { id }, relations: ['items'] });
  }

  async save(entity: Cart): Promise<void> {
    await this.repo.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
```

## Consequences

**Pros:**
- Domain logic is persistence-agnostic
- Easy to swap implementations (test doubles)
- Transaction boundaries are explicit

**Cons:**
- Additional abstraction layer
- Potential N+1 query issues without careful eager loading

## Related Patterns

- [[.framework/patterns/aggregate-root\|Aggregate Root]] — Repository manages aggregates
- [[.framework/patterns/cqrs-pattern\|CQRS]] — Repositories can be split by command/query

## Projects Using This Pattern

- [[projects/ip-hub/okf/index\|IP Hub]] — Cart, Order, Product repositories

## Anti-Patterns to Avoid

- **Anemic Repository** — Repository with only CRUD, no domain logic
- **Leaky Abstraction** — Returning ORM entities instead of domain objects
