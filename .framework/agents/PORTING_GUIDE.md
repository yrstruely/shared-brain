# Playbook Porting Guide

> How to refactor project-specific playbook agents into project-agnostic framework agents.

---

## Status

⏳ **In Progress** — Original playbooks copied to `.framework/agents/playbooks/`. Porting template created. Key agents need refactoring.

---

## What Changed

### Before (Project-Specific)

```markdown
# BDD Features Generator Agent

See context/monorepo-context.md for mono-repo structure.

You are playing the role of: BDD Features Generator Agent for IP Hub...

{
  "specificationFilesDirectory": "specs/frontend/<<YOUR-DIR-HERE>>",
  "FrontendReferenceFeatures": "apps/ip-hub-frontend/features/**/*.feature",
  "BackendReferenceFeatures": "apps/<<APP-NAME>>/test/e2e/features/...",
  "assetType": "patent",
  ...
}
```

**Problems:**
- Hardcoded `apps/ip-hub-frontend/` paths
- IP Hub domain context baked in
- Component catalogue specific to IP Hub
- AED currency, Dubai jurisdiction hardcoded
- No way to reuse for billing-service or other projects

### After (Project-Agnostic)

```markdown
# BDD Features Generator Agent

## Input

```typescript
interface FeatureGeneratorInput {
  projectName: string;
  specPath: string;
  outputPath: string;
  context: ProjectContext; // From RLM loader
}
```

## Process

1. Load ProjectContext via RLM
2. Query Graphify for existing entities
3. Query Wiki for domain patterns
4. Generate features using project-specific config
```

**Benefits:**
- Same agent works for any project
- Domain context loaded dynamically
- Paths resolved from ProjectContext
- Patterns shared across projects via wiki

---

## Porting Checklist (Per Agent)

### Step 1: Extract ProjectContext Dependencies

Find all hardcoded paths and replace with ProjectContext:

| Hardcoded | Replacement |
|-----------|-------------|
| `apps/ip-hub-frontend/` | `context.project.paths.frontend` |
| `apps/ip-hub-backend/` | `context.project.paths.backend` |
| `specs/frontend/` | `context.project.paths.specs.frontend` |
| `specs/backend/` | `context.project.paths.specs.backend` |
| `documentation/` | `context.project.paths.docs` |
| `context/bdd-features-generator-context.md` | `context.project.paths.agentsContext` |

### Step 2: Extract Domain Context

Find IP Hub-specific domain knowledge and replace with dynamic lookup:

| Hardcoded | Replacement |
|-----------|-------------|
| Asset types (patent, trademark, copyright) | `context.project.domain.assetTypes` |
| Jurisdictions (Dubai, PCT, USPTO) | `context.project.domain.jurisdictions` |
| Currency (AED) | `context.project.domain.currency` |
| User roles | `context.project.domain.userRoles` |
| Component catalogue | `context.project.frontend.components` |

### Step 3: Add RLM Context Loading

Add at the start of every agent:

```typescript
// Before
const features = await generateFeatures('specs/frontend/cart/');

// After
const context = await loadProjectContext(projectName);
const features = await generateFeatures({
  specPath: context.project.paths.specs.frontend,
  outputPath: context.project.paths.features,
  techStack: context.project.techStack,
  patterns: context.wiki.patterns,
  domain: context.project.domain
});
```

### Step 4: Add Graphify Queries

Replace file grepping with graph queries:

```typescript
// Before
const existingFeatures = await grep('*.feature', 'specs/frontend/');

// After
const existingFeatures = await graphify.query(`
  MATCH (f:Feature) WHERE f.project = $project RETURN f
`, { project: projectName });
```

### Step 5: Add Wiki Cross-References

Query wiki for patterns before generating:

```typescript
const patterns = await wiki.query(`
  Find patterns for: ${context.project.techStack.frontend.framework}
`);
```

---

## Agent Mapping

| Framework Agent | Playbook Source | Status |
|----------------|-----------------|--------|
| [[.framework/agents/bdd-feature-generator\|BDD Feature Generator]] | `playbooks/bdd-feature-agents/agents/bdd-features-generator.md` | ⏳ Needs porting |
| [[.framework/agents/bdd-frontend-steps\|BDD Frontend Steps]] | `playbooks/bdd-frontend-agents/agents/step-definition-implementer.md` | ⏳ Needs porting |
| [[.framework/agents/bdd-backend-steps\|BDD Backend Steps]] | `playbooks/bdd-backend-agents/agents/step-definition-implementer.md` | ⏳ Needs porting |
| [[.framework/agents/tdd-frontend\|TDD Frontend]] | `playbooks/tdd-frontend-agents/` | ⏳ Needs porting |
| [[.framework/agents/tdd-backend\|TDD Backend]] | `playbooks/tdd-backend-agents/` | ⏳ Needs porting |

---

## ProjectContext Schema

```typescript
interface ProjectContext {
  project: {
    name: string;
    type: string;
    paths: {
      root: string;
      frontend: string;
      backend: string;
      features: string;
      specs: {
        frontend: string;
        backend: string;
      };
      docs: string;
      agentsContext: string;
    };
    techStack: {
      frontend: {
        framework: string;
        state: string;
        testing: string;
      };
      backend: {
        framework: string;
        architecture: string;
        database: string;
        testing: string;
      };
    };
    domain: {
      assetTypes: string[];
      jurisdictions: string[];
      currency: string;
      userRoles: string[];
      components: Component[];
    };
  };
  wiki: {
    patterns: Pattern[];
    antiPatterns: AntiPattern[];
  };
  graph: {
    entities: DomainEntity[];
    features: Feature[];
  };
}
```

---

## Commands

```bash
# After porting, copy to Claude Code skills
mkdir -p ~/.claude/skills

# Port one agent
cp .framework/agents/playbooks/bdd-feature-agents/agents/bdd-features-generator.md \
   ~/.claude/skills/bdd-features-generator.md

# Edit to replace hardcoded paths with ProjectContext
# (see Porting Checklist above)
```

---

## Recommendation

**Don't port all agents at once.** Instead:

1. **Port one agent** (bdd-features-generator) as a template
2. **Test it** on IP Hub to verify it still works
3. **Use the template** to port remaining agents
4. **Add new projects** (billing-service) to test project-agnostic nature

This minimizes risk and gives you a working template.
