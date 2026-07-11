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
| No specs | Everything | `dna-bdd-features` | BDD |
| Specs exist, no features | `.feature` files | `dna-bdd-features` | BDD |
| Features exist, no steps | Step definitions | `dna-bdd-frontend-steps` + `dna-bdd-backend-steps` | BDD |
| Steps exist, no tests | Unit tests | `dna-tdd-frontend` + `dna-tdd-backend` | TDD |
| Tests exist, failing | Implementation | `dna-tdd-frontend` + `dna-tdd-backend` | TDD |
| Tests pass, code raw | Cleanup | `dna-review` | Review |
| Code clean, uncommitted | Commit/PR | `dna-pr` | PR |
| New domain concept | Entity design | `dna-domain-entity` | Discovery |
| New API surface | Contracts | `dna-api-contracts` | Discovery |
| New backend feature | Module scaffold | `dna-backend-module` | Scaffold |
| New frontend feature | Component scaffold | `dna-frontend-guide` | Scaffold |

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
      skill: 'dna-bdd-features',
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
        skill: 'dna-bdd-frontend-steps',
        phase: 'BDD',
        reason: 'Features exist but frontend step definitions are missing.',
        dependencies: ['dna-bdd-features'],
        parallelWith: ['dna-bdd-backend-steps']
      },
      {
        skill: 'dna-bdd-backend-steps',
        phase: 'BDD',
        reason: 'Features exist but backend step definitions are missing.',
        dependencies: ['dna-bdd-features'],
        parallelWith: ['dna-bdd-frontend-steps']
      }
    ];
  }

  // Have steps, need implementation
  if (state.hasFrontendSteps && !state.hasImplementation) {
    return [
      {
        skill: 'dna-tdd-frontend',
        phase: 'TDD',
        reason: 'Step definitions ready. Implement frontend component.',
        dependencies: ['dna-bdd-frontend-steps'],
        parallelWith: ['dna-tdd-backend']
      },
      {
        skill: 'dna-tdd-backend',
        phase: 'TDD',
        reason: 'Step definitions ready. Implement backend service/aggregate.',
        dependencies: ['dna-bdd-backend-steps'],
        parallelWith: ['dna-tdd-frontend']
      }
    ];
  }

  // Implementation exists, needs cleanup
  if (state.hasImplementation && !state.isClean) {
    return [{
      skill: 'dna-review',
      phase: 'Review',
      reason: 'Code exists but needs AI artifact cleanup.',
      dependencies: ['dna-tdd-frontend', 'dna-tdd-backend'],
      parallelWith: []
    }];
  }

  // Everything clean, needs PR
  if (state.isClean && state.hasUncommittedChanges) {
    return [{
      skill: 'dna-pr',
      phase: 'PR',
      reason: 'Implementation complete and clean. Create PR.',
      dependencies: ['dna-review'],
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
  1. Run dna-bdd-frontend-steps (parallel with backend)
  2. Run dna-bdd-backend-steps (parallel with frontend)

Dependencies: dna-bdd-features (✅ completed)

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
- [ ] dna-bdd-frontend-steps
- [ ] dna-bdd-backend-steps
  → Parallel execution possible

### Phase 2: TDD
- [ ] dna-tdd-frontend
- [ ] dna-tdd-backend
  → Parallel execution possible

### Phase 3: Review
- [ ] dna-review

### Phase 4: PR
- [ ] dna-pr

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
    skill: 'dna-domain-entity',
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
    skill: 'dna-api-contracts',
    phase: 'Discovery',
    reason: 'API contracts not defined. Establish contract before implementation.',
    dependencies: ['dna-domain-entity'],
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
| `dna-domain-entity` | Discovery | No | — |
| `dna-api-contracts` | Discovery | No | `dna-domain-entity` |
| `dna-backend-module` | Scaffold | No | `dna-api-contracts` |
| `dna-frontend-guide` | Scaffold | No | `dna-api-contracts` |
| `dna-bdd-features` | BDD | No | — |
| `dna-bdd-frontend-steps` | BDD | Yes (backend) | `dna-bdd-features` |
| `dna-bdd-backend-steps` | BDD | Yes (frontend) | `dna-bdd-features` |
| `dna-tdd-frontend` | TDD | Yes (backend) | `dna-bdd-frontend-steps` |
| `dna-tdd-backend` | TDD | Yes (frontend) | `dna-bdd-backend-steps` |
| `dna-review` | Review | No | `dna-tdd-frontend`, `dna-tdd-backend` |
| `dna-pr` | PR | No | `dna-review` |
