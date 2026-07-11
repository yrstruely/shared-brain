# Framework Agents

> Project-agnostic BDD/TDD agents. Each agent receives `ProjectContext` instead of hardcoded paths.

---

## Agent Registry

### [[.framework/agents/bdd-feature-generator\|BDD Feature Generator]]
Generates Gherkin feature files from PRDs, specs, and requirements.

### [[.framework/agents/bdd-frontend-steps\|BDD Frontend Steps]]
Generates frontend e2e step definitions from Gherkin features.

### [[.framework/agents/bdd-backend-steps\|BDD Backend Steps]]
Generates backend e2e step definitions from Gherkin features.

### [[.framework/agents/tdd-frontend\|TDD Frontend]]
Implements frontend components using TDD (RED → GREEN → CLEAN).

### [[.framework/agents/tdd-backend\|TDD Backend]]
Implements backend services/handlers using TDD (RED → GREEN → CLEAN).

---

## Agent Contract

Every agent follows this execution model:

```
1. Receive Task + ProjectContext
2. Load RLM context (~15k tokens)
3. Query Graphify for relationships
4. Query Wiki for patterns
5. Execute core logic
6. Write outputs (code + wiki updates)
7. Trigger Graphify reindex
```

---

## ProjectContext Schema

```typescript
interface ProjectContext {
  project: {
    name: string;
    type: string;
    path: string;
    techStack: TechStack;
    sources: {
      prds: string;
      rfcs: string;
      meetingNotes: string;
    };
  };
  okf: {
    index: string;
    boundedContexts: string;
    adrs: string;
  };
  graph: {
    entities: DomainEntity[];
    features: Feature[];
    tests: Test[];
  };
  wiki: {
    patterns: Pattern[];
    antiPatterns: AntiPattern[];
    technologies: Technology[];
  };
}
```

---

## Execution Order

```
BDD Feature Generator
    ↓
BDD Frontend Steps ←→ BDD Backend Steps (parallel)
    ↓
TDD Frontend ←→ TDD Backend (parallel)
    ↓
Graphify Reindex
```

---

## Status

| Agent | Status | Notes |
|-------|--------|-------|
| BDD Feature Generator | ⏳ Stub | Needs playbook port |
| BDD Frontend Steps | ⏳ Stub | Needs playbook port |
| BDD Backend Steps | ⏳ Stub | Needs playbook port |
| TDD Frontend | ⏳ Stub | Needs playbook port |
| TDD Backend | ⏳ Stub | Needs playbook port |
