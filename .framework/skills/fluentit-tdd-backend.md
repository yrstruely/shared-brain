---
description: Implements backend features from BDD specs using TDD (Red → Green → Clean). Generates tests, then implements NestJS/Express controllers and services.
argument-hint: Provide the project name and feature name (e.g., --project hello-world --feature welcome)
---

# Backend TDD Implementation

> Red → Green → Clean cycle for backend features. Generates tests, then implements the controller and service.

## How to Use

```
fluentit-tdd-backend --project hello-world --feature welcome
```

## What This Skill Does

1. **Reads the OKF** to understand the project tech stack
2. **Reads the feature file** to understand what to implement
3. **Generates failing tests** (Red)
4. **Implements the controller + service** to make tests pass (Green)
5. **Runs tests** to confirm

## Step-by-Step Instructions

### Step 1: Read the OKF

Use the Read tool to open `projects/{projectName}/okf/index.md`.

Extract:
- `techStack.backend` — NestJS, Express, Fastify, etc.
- `paths.backend` — where backend code lives
- `paths.tests` — where tests live

If OKF doesn't exist, STOP and tell the user to create it.

### Step 2: Find the Feature File

Use the Bash tool:
```bash
find projects/{projectName}/features -name "*{featureName}*.feature" 2>/dev/null
```

Use the Read tool to read the matching `.feature` file.

If no feature file found, STOP:
> "No feature file found for '{featureName}'. Run fluentit-bdd-features first."

### Step 3: Check Existing Code

```bash
# Check for existing controller
find projects/{projectName}/{backendPath} -name "*{featureName}*.controller.*" 2>/dev/null

# Check for existing service
find projects/{projectName}/{backendPath} -name "*{featureName}*.service.*" 2>/dev/null

# Check for existing tests
find projects/{projectName}/{backendPath} -name "*{featureName}*.spec.*" 2>/dev/null
```

### Step 4: Generate Tests (Red)

Create a controller test based on the `@backend` scenarios in the feature file.

**For NestJS/Jest:**
```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { WelcomeController } from './welcome.controller'
import { WelcomeService } from './welcome.service'

describe('WelcomeController', () => {
  let controller: WelcomeController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WelcomeController],
      providers: [WelcomeService],
    }).compile()

    controller = module.get<WelcomeController>(WelcomeController)
  })

  describe('GET /welcome', () => {
    it('returns welcome message', () => {
      const result = controller.getWelcome()
      expect(result).toEqual({ message: 'Hello, World!' })
    })
  })
})
```

Use the Write tool to create the test file at:
```
projects/{projectName}/{backendPath}/{featureName}/{featureName}.controller.spec.ts
```

### Step 5: Run Tests (Confirm Red)

```bash
cd projects/{projectName}/{backendPath} && npx jest {featureName}.controller.spec.ts 2>&1
```

Tests should **fail** because the controller and service don't exist.

### Step 6: Implement Service (Green)

Create a minimal service:

```typescript
import { Injectable } from '@nestjs/common'

@Injectable()
export class WelcomeService {
  getWelcome(): { message: string } {
    return { message: 'Hello, World!' }
  }
}
```

Use the Write tool:
```
projects/{projectName}/{backendPath}/{featureName}/{featureName}.service.ts
```

### Step 7: Implement Controller (Green)

Create a minimal controller:

```typescript
import { Controller, Get } from '@nestjs/common'
import { WelcomeService } from './welcome.service'

@Controller('welcome')
export class WelcomeController {
  constructor(private readonly service: WelcomeService) {}

  @Get()
  getWelcome() {
    return this.service.getWelcome()
  }
}
```

Use the Write tool:
```
projects/{projectName}/{backendPath}/{featureName}/{featureName}.controller.ts
```

### Step 8: Register in Module

Read the AppModule:
```
projects/{projectName}/{backendPath}/app.module.ts
```

Add the new module/controller. If there's a dedicated module file, add it there. Otherwise, add to AppModule.

### Step 9: Run Tests (Confirm Green)

```bash
cd projects/{projectName}/{backendPath} && npx jest {featureName}.controller.spec.ts 2>&1
```

Tests should now **pass**.

### Step 10: Report Results

```
✅ Backend TDD Complete: {featureName}

Tests: PASS
Controller: projects/{projectName}/{backendPath}/{featureName}/{featureName}.controller.ts
Service: projects/{projectName}/{backendPath}/{featureName}/{featureName}.service.ts

Next steps:
  - Review the controller and service
  - Run: fluentit-review --project {projectName}
  - Or run: fluentit-tdd-frontend --project {projectName} --feature {featureName}
```

## Error Handling

| Problem | Response |
|---------|----------|
| Feature file not found | "Run fluentit-bdd-features first." |
| Controller already exists | Ask: "Overwrite? [Y/n]" |
| Tests already pass | "Component may already be implemented." |
| Tests fail after implementation | Debug: check service injection, return types, imports. |
| Module registration fails | Check imports, providers array, controller array. |
| No test framework | "Configure Jest/Vitest first." |

## Important Notes

- This skill **writes files** (tests + controller + service + module updates).
- Implementation should be minimal — just enough to make tests pass.
- Follow the project's backend framework (NestJS, Express, etc.) from the OKF.
- For NestJS: use DI, DTOs, and proper module structure.
- For Express: use routes, middleware, and controllers as appropriate.
