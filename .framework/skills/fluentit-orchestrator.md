---
description: Project orchestration skill. Detects project state, determines which skills to run, and sequences them correctly. The conductor of the framework.
argument-hint: Provide project name and optionally a goal (e.g., "implement user profile feature" or "scaffold new project")
---

# Project Orchestrator (Project-Agnostic)

> Detects project state, determines the next skill to run, and sequences the full development pipeline. The conductor of the framework.

---

## Phase 0: Load Project Context

**Goal:** Understand the project completely — its state, architecture, and what needs to happen next.

**Actions:**

1. **Load ProjectContext via RLM**

   ```typescript
   const context = await loadProjectContext(projectName);
   const { project, projectType, graph, wiki } = context;
   ```

2. **Detect project initialization state**

   ```typescript
   const isInitialized = await checkPath(`projects/${projectName}/okf/index.md`);
   if (!isInitialized) {
     return { nextSkill: 'init-project', reason: 'Project OKF not found' };
   }
   ```

3. **Detect current feature state**

   ```typescript
   const state = await detectFeatureState(projectName, featureName);
   // Returns: { hasSpecs, hasFeatures, hasFrontendSteps, hasBackendSteps,
   //            hasFrontendTests, hasBackendTests, hasImplementation }
   ```

4. **Resolve goal**

   - If user provided a goal (e.g., "implement user profile") → parse into feature scope
   - If no goal → ask user or suggest based on project backlog

---

## Phase 1: Determine Pipeline Stage

Based on detected state, determine where we are in the pipeline:

```
Pipeline Flow:

[Goal] → [Discovery] → [Design] → [Scaffold] → [BDD] → [TDD] → [Review] → [PR]

Discovery:    Domain Entity (interview) → API Contracts → Backend Module Design
Scaffold:     Backend Module → Frontend Guide setup
BDD:          Features → Frontend Steps → Backend Steps
TDD:          Frontend TDD → Backend TDD
Review:       Code Review (AI cleanup)
PR:           Pull Request Workflow
```

### State Machine

| Detected State | Missing | Next Skill | Phase |
|---|---|---|---|
| No specs | Everything | `fluentit-bdd-features` | BDD |
| Specs exist, no features | `.feature` files | `fluentit-bdd-features` | BDD |
| Features exist, no steps | Step definitions | `fluentit-bdd-frontend-steps` + `fluentit-bdd-backend-steps` | BDD |
| Steps exist, no tests | Unit tests | `fluentit-tdd-frontend` + `fluentit-tdd-backend` | TDD |
| Tests exist, failing | Implementation | `fluentit-tdd-frontend` + `fluentit-tdd-backend` | TDD |
| Tests pass, code raw | Cleanup | `fluentit-review` | Review |
| Code clean, uncommitted | Commit/PR | `fluentit-pr` | PR |
| New domain concept | Entity design | `fluentit-domain-entity` | Discovery |
| New API surface | Contracts | `fluentit-api-contracts` | Discovery |
| New backend feature | Module scaffold | `fluentit-backend-module` | Scaffold |
| New frontend feature | Component scaffold | `fluentit-frontend-guide` | Scaffold |

---

## Phase 2: Skill Selection Logic

```typescript
interface OrchestratorInput {
  projectName: string;
  goal?: string;           // e.g., "implement user profile"
  featureName?: string;    // specific feature to work on
  forcePhase?: Phase;      // override auto-detection
}

interface SkillRecommendation {
  skill: string;
  phase: Phase;
  reason: string;
  dependencies: string[];   // skills that must run first
  parallelWith?: string[];  // skills that can run concurrently
}

async function recommendNextSkill(input: OrchestratorInput): Promise<SkillRecommendation[]> {
  const context = await loadProjectContext(input.projectName);
  const state = await detectFeatureState(input.projectName, input.featureName);

  // Greenfield feature (nothing exists yet)
  if (!state.hasSpecs && !state.hasFeatures) {
    return [{
      skill: 'fluentit-bdd-features',
      phase: 'BDD',
      reason: `No features found for ${input.featureName}. Start with BDD feature generation.`,
      dependencies: [],
      parallelWith: []
    }];
  }

  // Have features, need steps
  if (state.hasFeatures && !state.hasFrontendSteps) {
    return [
      {
        skill: 'fluentit-bdd-frontend-steps',
        phase: 'BDD',
        reason: 'Features exist but frontend step definitions are missing.',
        dependencies: ['fluentit-bdd-features'],
        parallelWith: ['fluentit-bdd-backend-steps']
      },
      {
        skill: 'fluentit-bdd-backend-steps',
        phase: 'BDD',
        reason: 'Features exist but backend step definitions are missing.',
        dependencies: ['fluentit-bdd-features'],
        parallelWith: ['fluentit-bdd-frontend-steps']
      }
    ];
  }

  // Have steps, need implementation
  if (state.hasFrontendSteps && !state.hasImplementation) {
    return [
      {
        skill: 'fluentit-tdd-frontend',
        phase: 'TDD',
        reason: 'Step definitions ready. Implement frontend component.',
        dependencies: ['fluentit-bdd-frontend-steps'],
        parallelWith: ['fluentit-tdd-backend']
      },
      {
        skill: 'fluentit-tdd-backend',
        phase: 'TDD',
        reason: 'Step definitions ready. Implement backend service/aggregate.',
        dependencies: ['fluentit-bdd-backend-steps'],
        parallelWith: ['fluentit-tdd-frontend']
      }
    ];
  }

  // Implementation exists, needs cleanup
  if (state.hasImplementation && !state.isClean) {
    return [{
      skill: 'fluentit-review',
      phase: 'Review',
      reason: 'Code exists but needs AI artifact cleanup.',
      dependencies: ['fluentit-tdd-frontend', 'fluentit-tdd-backend'],
      parallelWith: []
    }];
  }

  // Everything clean, needs PR
  if (state.isClean && state.hasUncommittedChanges) {
    return [{
      skill: 'fluentit-pr',
      phase: 'PR',
      reason: 'Implementation complete and clean. Create PR.',
      dependencies: ['fluentit-review'],
      parallelWith: []
    }];
  }

  // All done
  return [{
    skill: 'none',
    phase: 'Complete',
    reason: 'Feature is fully implemented, tested, reviewed, and merged.',
    dependencies: [],
    parallelWith: []
  }];
}
```

---

## Phase 3: Execute or Recommend

### Mode A: Interactive (Default)

Present the recommendation and ask user confirmation:

```
📋 Project: ip-hub | Feature: user-profile

Detected State:
  ✅ Specs exist
  ✅ Features exist
  ❌ Frontend steps missing
  ❌ Backend steps missing
  ❌ Implementation missing

Recommended Next:
  1. Run fluentit-bdd-frontend-steps (parallel with backend)
  2. Run fluentit-bdd-backend-steps (parallel with frontend)

Dependencies: fluentit-bdd-features (✅ completed)

Proceed? [Y/n/custom]
```

### Mode B: Autopilot

Execute skills automatically without confirmation (for CI/CD or trusted workflows):

```bash
claude /framework:orchestrator --project ip-hub --feature user-profile --auto
```

### Mode C: Planning Only

Output a plan without executing:

```bash
claude /framework:orchestrator --project ip-hub --feature user-profile --plan
```

Output:
```markdown
## Execution Plan: user-profile

### Phase 1: BDD (Current)
- [ ] fluentit-bdd-frontend-steps
- [ ] fluentit-bdd-backend-steps
  → Parallel execution possible

### Phase 2: TDD
- [ ] fluentit-tdd-frontend
- [ ] fluentit-tdd-backend
  → Parallel execution possible

### Phase 3: Review
- [ ] fluentit-review

### Phase 4: PR
- [ ] fluentit-pr

Estimated: 4 phases, 6 skills, ~45 min
```

---

## Phase 4: Dependency Resolution

Handle complex dependency chains:

```typescript
// Domain entity needed before backend module?
const needsEntity = await checkDomainEntityExists(projectName, entityName);
if (!needsEntity) {
  recommendations.unshift({
    skill: 'fluentit-domain-entity',
    phase: 'Discovery',
    reason: `Domain entity '${entityName}' not found. Design it first.`,
    dependencies: [],
    parallelWith: []
  });
}

// API contracts needed before frontend/backend TDD?
const hasContracts = await checkApiContractsExist(projectName, featureName);
if (!hasContracts) {
  recommendations.unshift({
    skill: 'fluentit-api-contracts',
    phase: 'Discovery',
    reason: 'API contracts not defined. Establish contract before implementation.',
    dependencies: ['fluentit-domain-entity'],
    parallelWith: []
  });
}
```

---

## Phase 5: Post-Skill Update

After each skill completes:

1. **Update Graphify** — Index what was created
2. **Update Wiki** — Log the operation
3. **Re-detect state** — Check if we can proceed to next skill
4. **Continue or pause** — Ask user if in interactive mode

```typescript
async function onSkillComplete(result: SkillResult) {
  await graphify.index(result.createdFiles);
  await wiki.logOperation(result.skill, result.summary);
  const newState = await detectFeatureState(projectName, featureName);

  if (mode === 'auto') {
    const next = await recommendNextSkill({ projectName, featureName });
    if (next[0].skill !== 'none') {
      await executeSkill(next[0]);
    }
  }
}
```

---

## Usage

```bash
# Interactive — detect state and recommend next step
claude /framework:orchestrator --project ip-hub

# Work on specific feature
claude /framework:orchestrator --project ip-hub --feature user-profile

# Plan only (dry run)
claude /framework:orchestrator --project ip-hub --feature user-profile --plan

# Autopilot (execute without confirmation)
claude /framework:orchestrator --project ip-hub --feature user-profile --auto

# Force a specific phase
claude /framework:orchestrator --project ip-hub --feature user-profile --phase BDD

# Greenfield — scaffold everything from scratch
claude /framework:orchestrator --project ip-hub --feature user-profile --greenfield
```

---

## Skill Registry

The orchestrator knows about all framework skills:

| Skill | Phase | Can Parallel | Depends On |
|-------|-------|-------------|------------|
| `fluentit-domain-entity` | Discovery | No | — |
| `fluentit-api-contracts` | Discovery | No | `fluentit-domain-entity` |
| `fluentit-backend-module` | Scaffold | No | `fluentit-api-contracts` |
| `fluentit-frontend-guide` | Scaffold | No | `fluentit-api-contracts` |
| `fluentit-bdd-features` | BDD | No | — |
| `fluentit-bdd-frontend-steps` | BDD | Yes (backend) | `fluentit-bdd-features` |
| `fluentit-bdd-backend-steps` | BDD | Yes (frontend) | `fluentit-bdd-features` |
| `fluentit-tdd-frontend` | TDD | Yes (backend) | `fluentit-bdd-frontend-steps` |
| `fluentit-tdd-backend` | TDD | Yes (frontend) | `fluentit-bdd-backend-steps` |
| `fluentit-review` | Review | No | `fluentit-tdd-frontend`, `fluentit-tdd-backend` |
| `fluentit-pr` | PR | No | `fluentit-review` |
