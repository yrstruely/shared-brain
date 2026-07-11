---
description: Creates API contract types (DTOs, response types) for a feature. Pure TypeScript interfaces.
argument-hint: Provide feature name and project name.
---

# API Contracts

> Creates TypeScript DTOs and response types for frontend-backend communication.

## How to Use

```
fluentit-api-contracts --project hello-world --feature user-profile
```

## What This Skill Does

1. Reads the OKF to understand the project
2. Creates DTO interfaces for requests and responses
3. Creates a frontend API composable/service

## Step-by-Step

### Step 1: Read the OKF

Read `projects/{projectName}/okf/index.md` for paths and tech stack.

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

### Step 3: Find the Feature Spec

```bash
find projects/{projectName}/specs -name "*{featureName}*" 2>/dev/null
```

Read the spec to understand what data structures are needed.

### Step 4: Create DTOs

Create a TypeScript file with interfaces:

```typescript
// {codeRoot}/{contractsPath}/dto/{featureName}.dto.ts

export interface {FeatureName}Dto {
  id: string
  name: string
  // Add fields based on spec
}

export interface Create{FeatureName}Request {
  name: string
  // Add required fields
}

export interface Update{FeatureName}Request {
  name?: string
  // Add optional fields
}
```

### Step 5: Create Response Types

```typescript
// {codeRoot}/{contractsPath}/responses/{featureName}.responses.ts

export interface Get{FeatureName}Response {
  data: {FeatureName}Dto
}

export interface Get{FeatureName}ListResponse {
  data: {FeatureName}Dto[]
  total: number
}
```

### Step 6: Create Frontend API Service

```typescript
// {codeRoot}/{frontendPath}/services/{featureName}.api.ts

export async function get{FeatureName}(id: string): Promise<{FeatureName}Dto> {
  const response = await fetch(`/api/{featureName}s/${id}`)
  return response.json()
}

export async function create{FeatureName}(data: Create{FeatureName}Request): Promise<{FeatureName}Dto> {
  const response = await fetch('/api/{featureName}s', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}
```

## Error Handling

| Problem | Response |
|---------|----------|
| No spec found | "No spec for '{featureName}'. Create one first." |
| DTOs already exist | Ask: "Overwrite? [Y/n]" |
