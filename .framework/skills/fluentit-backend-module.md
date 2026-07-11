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

### Step 2: Resolve the Code Path

Check if the OKF has a `codePaths` field.

**If `codePaths` is present:**
1. Determine the machine identifier in this priority:
   - Environment variable `FLUENTIT_MACHINE`
   - Local config file `~/.fluentit/machine.json` (read with Bash: `cat ~/.fluentit/machine.json 2>/dev/null || echo "{}"`)
   - Hostname: `hostname` command
2. Find the entry in `codePaths` where `machine` matches the identifier.
3. If found, set `{codeRoot}` to that entry's `path`.
4. If not found, STOP and tell the user:
   > "No code path configured for machine '{machineId}' in project '{projectName}'. Please provide the path, or add this to the OKF:\n> codePaths:\n>   - machine: '{machineId}'\n>     path: '<your path here>'"

**If `codePaths` is absent:**
- The project is vault-local. Set `{codeRoot}` = `projects/{projectName}/`.

**From now on, use:**
- `projects/{projectName}/` for OKF, specs, and documentation (vault side)
- `{codeRoot}/` for features, code, tests, and git operations (code side)

### Step 3: Check Existing Files

```bash
find {codeRoot}/{backendPath} -name "*{featureName}*" 2>/dev/null
```

### Step 4: Create Service

```typescript
// {codeRoot}/{backendPath}/{featureName}/{featureName}.service.ts

import { Injectable } from '@nestjs/common'

@Injectable()
export class {FeatureName}Service {
  // Add methods based on spec
}
```

### Step 5: Create Controller

```typescript
// {codeRoot}/{backendPath}/{featureName}/{featureName}.controller.ts

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

### Step 6: Create Module

```typescript
// {codeRoot}/{backendPath}/{featureName}/{featureName}.module.ts

import { Module } from '@nestjs/common'
import { {FeatureName}Controller } from './{featureName}.controller'
import { {FeatureName}Service } from './{featureName}.service'

@Module({
  controllers: [{FeatureName}Controller],
  providers: [{FeatureName}Service],
})
export class {FeatureName}Module {}
```

### Step 7: Register in AppModule

Read `{codeRoot}/{backendPath}/app.module.ts`, add the import.

## Error Handling

| Problem | Response |
|---------|----------|
| Module already exists | Ask: "Overwrite? [Y/n]" |
| AppModule not found | "Backend not properly scaffolded." |
