---
name: fluentit-api-contracts
description: Creates TypeScript DTOs and response types
---

# FluentIT API Contracts

Creates TypeScript DTOs and response types for frontend-backend communication.

## Usage

```
fluentit-api-contracts --project PROJECT_NAME --feature FEATURE_NAME
```

## Example

```
fluentit-api-contracts --project hello-world --feature user-profile
```

## Output

- DTOs: `contracts/dto/user-profile.dto.ts`
- Responses: `contracts/responses/user-profile.responses.ts`
- Frontend API: `frontend/services/user-profile.api.ts`
