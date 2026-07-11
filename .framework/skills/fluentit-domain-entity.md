---
description: Designs and implements a domain entity through structured interview. Framework-free domain code.
argument-hint: Provide feature description and project name.
---

# Domain Entity

> Designs a domain entity through a structured interview with the user.

## How to Use

```
fluentit-domain-entity --project hello-world --feature "user profile"
```

## What This Skill Does

1. Asks the user questions about the entity
2. Designs the entity structure
3. Implements it in the domain layer

## Step-by-Step

### Step 1: Read the OKF

Read `projects/{projectName}/okf/index.md` for `paths.domain`.

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

### Step 3: Interview the User

Ask 3-5 questions:

1. "What is this entity called? (e.g., User, Order, Product)"
2. "What properties does it have? (e.g., name, email, status)"
3. "Does it have statuses with transitions? (e.g., draft → active → archived)"
4. "What business rules apply? (e.g., email must be unique)"
5. "How does it relate to other entities?"

### Step 4: Design the Entity

Present the design:

```
Entity: {EntityName}

Properties:
  - id: string
  - name: string
  - status: {StatusType}

Business Rules:
  - name cannot be empty
  - status transitions: {from} → {to}

Files to create:
  - {codeRoot}/{domainPath}/entities/{name}.entity.ts
  - {codeRoot}/{domainPath}/entities/{name}.entity.spec.ts
```

Wait for user confirmation.

### Step 5: Implement

Create the entity file with:
- Constructor validation
- Business methods
- No framework dependencies

Use the Write tool to create:
```
{codeRoot}/{domainPath}/entities/{name}.entity.ts
```

Create the test file with:
- Construction tests
- Business rule tests

Use the Write tool to create:
```
{codeRoot}/{domainPath}/entities/{name}.entity.spec.ts
```

## Error Handling

| Problem | Response |
|---------|----------|
| User unsure | Suggest based on feature name and common patterns |
| Domain path missing | "Set paths.domain in the OKF" |
