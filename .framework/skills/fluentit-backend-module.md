---
description: Scaffolds a full backend module with controller, service, and tests.
argument-hint: Provide feature name and project name.
---

# Backend Module

> Scaffolds a NestJS/Express module with controller, service, and module registration.

## How to Use

```
fluentit-backend-module --project hello-world --feature user-profile
```

## What This Skill Does

1. Reads the OKF for backend path and framework
2. Creates controller, service, and module files
3. Registers the module in AppModule

## Step-by-Step

### Step 1: Read the OKF

Read `projects/{projectName}/okf/index.md` for `paths.backend` and `techStack.backend`.

### Step 2: Check Existing Files

```bash
find projects/{projectName}/{backendPath} -name "*{featureName}*" 2>/dev/null
```

### Step 3: Create Service

```typescript
// {backendPath}/{featureName}/{featureName}.service.ts

import { Injectable } from '@nestjs/common'

@Injectable()
export class {FeatureName}Service {
  // Add methods based on spec
}
```

### Step 4: Create Controller

```typescript
// {backendPath}/{featureName}/{featureName}.controller.ts

import { Controller, Get, Post } from '@nestjs/common'
import { {FeatureName}Service } from './{featureName}.service'

@Controller('{featureName}s')
export class {FeatureName}Controller {
  constructor(private readonly service: {FeatureName}Service) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }
}
```

### Step 5: Create Module

```typescript
// {backendPath}/{featureName}/{featureName}.module.ts

import { Module } from '@nestjs/common'
import { {FeatureName}Controller } from './{featureName}.controller'
import { {FeatureName}Service } from './{featureName}.service'

@Module({
  controllers: [{FeatureName}Controller],
  providers: [{FeatureName}Service],
})
export class {FeatureName}Module {}
```

### Step 6: Register in AppModule

Read `app.module.ts`, add the import.

## Error Handling

| Problem | Response |
|---------|----------|
| Module already exists | Ask: "Overwrite? [Y/n]" |
| AppModule not found | "Backend not properly scaffolded." |
