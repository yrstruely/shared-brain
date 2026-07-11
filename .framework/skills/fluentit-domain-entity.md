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

### Step 2: Interview the User

Ask 3-5 questions:

1. "What is this entity called? (e.g., User, Order, Product)"
2. "What properties does it have? (e.g., name, email, status)"
3. "Does it have statuses with transitions? (e.g., draft → active → archived)"
4. "What business rules apply? (e.g., email must be unique)"
5. "How does it relate to other entities?"

### Step 3: Design the Entity

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
  - {domainPath}/entities/{name}.entity.ts
  - {domainPath}/entities/{name}.entity.spec.ts
```

Wait for user confirmation.

### Step 4: Implement

Create the entity file with:
- Constructor validation
- Business methods
- No framework dependencies

Create the test file with:
- Construction tests
- Business rule tests

## Error Handling

| Problem | Response |
|---------|----------|
| User unsure | Suggest based on feature name and common patterns |
| Domain path missing | "Set paths.domain in the OKF" |
