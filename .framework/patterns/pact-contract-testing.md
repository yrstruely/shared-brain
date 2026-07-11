# Pact Contract Testing

> Consumer-driven contract testing for microservices.

---

## Context

Multiple services communicate via APIs. Changes in one service can break consumers.

## Problem

- Integration tests are slow and flaky
- API changes break consumers without warning
- Teams don't know what other services depend on

## Solution

**Pact** — Consumer-driven contract testing:
1. **Consumer** defines expected interactions (contract)
2. **Provider** verifies it can satisfy the contract
3. **Pact Broker** stores and shares contracts

## Implementation

### Consumer Test (Frontend / API Client)

```typescript
// tests/pact/cart-consumer.spec.ts
import { Pact } from '@pact-foundation/pact';

const provider = new Pact({
  consumer: 'web-app',
  provider: 'cart-service',
  port: 1234
});

describe('Cart API Consumer Contract', () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  it('gets cart by id', async () => {
    await provider.addInteraction({
      state: 'cart exists',
      uponReceiving: 'get cart by id',
      withRequest: {
        method: 'GET',
        path: '/cart/cart-1'
      },
      willRespondWith: {
        status: 200,
        body: {
          id: 'cart-1',
          items: [],
          total: 0
        }
      }
    });

    const client = new CartClient('http://localhost:1234');
    const cart = await client.getCart('cart-1');
    expect(cart.id).toBe('cart-1');
  });
});
```

### Provider Verification

```typescript
// src/cart/cart.provider.spec.ts
import { Verifier } from '@pact-foundation/pact';

describe('Cart API Provider Verification', () => {
  it('verifies consumer contracts', async () => {
    await new Verifier({
      provider: 'cart-service',
      providerBaseUrl: 'http://localhost:3000',
      pactBrokerUrl: 'https://pact.ip-hub.internal',
      publishVerificationResult: true,
      providerVersion: process.env.GIT_COMMIT
    }).verifyProvider();
  });
});
```

## Pact Broker

```yaml
# docker-compose.yml
services:
  pact-broker:
    image: pactfoundation/pact-broker
    ports:
      - "9292:9292"
    environment:
      PACT_BROKER_DATABASE_URL: postgres://pact@db/pact
```

## Related Patterns

- [[.framework/patterns/cqrs-pattern\|CQRS]] — APIs expose command/query contracts
- [[.framework/patterns/domain-events\|Domain Events]] — Async communication contracts

## Projects Using This Pattern

- [[projects/ip-hub/okf/index\|IP Hub]] — All service-to-service communication
