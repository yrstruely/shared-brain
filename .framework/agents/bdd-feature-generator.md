# BDD Feature Generator Agent (Project-Agnostic)

> Generates Gherkin feature files from PRDs, specs, and requirements. **Ported from playbook** to use ProjectContext.

---

## Status

✅ **Ported Template** — Core structure is project-agnostic. Domain context loaded dynamically via ProjectContext.

## Source

Original: `.framework/agents/playbooks/bdd-feature-agents/agents/bdd-features-generator.md`

---

## Input

```typescript
interface FeatureGeneratorInput {
  projectName: string;
  specPath: string;              // Path to PRD/spec directory
  outputPath: string;            // Where to write .feature files
  specType?: 'ui' | 'technical' | 'combined'; // Auto-detected if not provided
  context: ProjectContext;       // From RLM loader
}
```

---

## Execution

### Phase 0: Load Context

```typescript
async function execute(input: FeatureGeneratorInput) {
  // 1. Load project context via RLM
  const context = await loadProjectContext(input.projectName);

  // 2. Query Graphify for existing entities
  const existingEntities = await graphify.query(`
    MATCH (e:DomainEntity) WHERE e.project = $project RETURN e
  `, { project: input.projectName });

  // 3. Query Wiki for patterns
  const patterns = await wiki.query(`
    Find BDD patterns for: ${context.project.techStack.frontend.framework}
  `);

  // 4. Load domain context from project config
  const domain = context.project.domain;
  const paths = context.project.paths;
```

### Phase 1: Detect Spec Type

```typescript
  // Auto-detect spec type from folder contents
  const specType = input.specType || detectSpecType(input.specPath);
  // ui | technical | combined
```

| Found | Detected Type |
|-------|---------------|
| `UI/` + `Architecture/` folders | `combined` |
| `Architecture/` only | `technical` |
| `UI/` or `Detailed Specs/` only | `ui` |

### Phase 2: Load Specifications

```typescript
  // Load specs based on type
  const specs = await loadSpecs({
    specPath: input.specPath,
    specType,
    paths: {
      visual: `${input.specPath}/UI/`,
      detailed: `${input.specPath}/Detailed Specs/`,
      architecture: `${input.specPath}/Architecture/`
    }
  });
```

### Phase 3: Generate Features

```typescript
  // Generate features using domain context from ProjectContext
  const features = await generateFeatures({
    specs,
    domain,           // Loaded dynamically from project config
    patterns,         // From wiki
    existingEntities, // From Graphify
    outputPath: input.outputPath
  });
```

---

## Domain Context (Loaded Dynamically)

Instead of hardcoded IP Hub domain, load from `ProjectContext.project.domain`:

```typescript
interface DomainConfig {
  assetTypes?: string[];        // e.g., ['patent', 'trademark', 'copyright']
  jurisdictions?: string[];     // e.g., ['Dubai/GCC', 'PCT', 'USPTO']
  currency?: string;            // e.g., 'AED'
  userRoles?: string[];         // e.g., ['Applicant', 'IP Professional']
  components?: Component[];     // Frontend component catalogue
  personas?: string[];          // e.g., ['Alice', 'Bob', 'Carol']
}
```

Example project config (`projects/ip-hub/okf/domain-config.json`):

```json
{
  "assetTypes": ["patent", "trademark", "copyright"],
  "jurisdictions": ["Dubai/GCC", "International (PCT)", "USPTO", "EPO", "EUIPO", "WIPO"],
  "currency": "AED",
  "userRoles": ["Patent Applicant", "IP Professional", "Inventor", "Legal Counsel", "Technical Writer"],
  "personas": ["Alice", "Bob", "Carol", "David", "Emma"]
}
```

---

## Gherkin Best Practices (Universal)

### Declarative Style

❌ **Imperative (avoid)**:
```gherkin
When Alice clicks the "Filing Strategy" dropdown
And Alice selects "Comprehensive" from the list
And Alice clicks "Save"
```

✅ **Declarative (preferred)**:
```gherkin
When Alice selects the "Comprehensive" filing strategy
```

### Feature Structure

```gherkin
@[feature-tag]
Feature: [Feature Name] - [Phase Description]
  In order to [business value]
  As a [user role]
  I want to [capability]

  Background:
    Given the system is available
    And [common preconditions]

  Rule: [Business rule 1]

    @frontend
    Scenario: [Happy path example]
      Given [initial context]
      When [action occurs]
      Then [expected outcome]

  Rule: [Business rule 2]
    [More scenarios...]

# Gaps Identified (requires clarification):
# 1. [Gap description and question]
```

### Tags Strategy

**Feature-Level:**
- `@[feature-number]` — Feature identifier
- `@asset-type` — Domain-specific asset type

**Scenario-Level:**
- `@frontend` — UI/UX scenarios
- `@backend` — API/business logic
- `@integration` — End-to-end
- `@wip` — Work in progress
- `@architecture-aligned` — Matches architecture spec

---

## Quality Checklist

**Structure:**
- [ ] Feature has clear business justification
- [ ] Scenarios grouped under business Rules
- [ ] Background includes common preconditions
- [ ] Appropriate tags applied

**Content:**
- [ ] 90%+ declarative style
- [ ] Concrete examples with real data
- [ ] Consistent domain terminology
- [ ] Observable outcomes in Then steps

**Coverage:**
- [ ] Happy path scenarios
- [ ] Edge cases identified
- [ ] Error scenarios considered
- [ ] Domain-specific behaviors covered

**Documentation:**
- [ ] Gaps documented at end of file
- [ ] Assumptions stated clearly
- [ ] Source specifications referenced

---

## Output

- `.feature` files in `outputPath/`
- Wiki pages for extracted domain concepts
- Updated project OKF index

---

## Example Usage

```bash
# Via framework command
/framework:bdd-features --project ip-hub --spec specs/frontend/dashboard/

# Direct agent invocation
/fluentit-bdd-features:fluentit-bdd-features @specs/frontend/dashboard/ --project ip-hub
```

---

## Changes from Original Playbook

| Aspect | Original | Ported |
|--------|----------|--------|
| Paths | Hardcoded `apps/ip-hub-frontend/` | `context.project.paths.*` |
| Domain | IP Hub patents/trademarks | Loaded from `context.project.domain` |
| Currency | Hardcoded AED | `context.project.domain.currency` |
| Components | IP Hub component catalogue | `context.project.domain.components` |
| Context loading | Manual file reads | RLM `loadProjectContext()` |
| Entity discovery | File grepping | Graphify queries |
| Patterns | None | Wiki cross-references |

---

## Next Steps

1. ✅ Template created (this file)
2. ⏳ Copy to `~/.claude/skills/bdd-features-generator.md`
3. ⏳ Test on IP Hub feature
4. ⏳ Port remaining agents using this template
