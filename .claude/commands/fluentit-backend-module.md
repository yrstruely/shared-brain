---
name: fluentit-backend-module
description: Scaffolds a full backend module with controller and service
---

# FluentIT Backend Module

Scaffolds a NestJS/Express module with controller, service, and tests.

## Usage

```
fluentit-backend-module --project PROJECT_NAME --feature FEATURE_NAME
```

## Example

```
fluentit-backend-module --project hello-world --feature user-profile
```

## Output

- Controller: `backend/src/user-profile/user-profile.controller.ts`
- Service: `backend/src/user-profile/user-profile.service.ts`
- Module: `backend/src/user-profile/user-profile.module.ts`
