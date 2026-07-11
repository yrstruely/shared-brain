<!-- llm-wiki-log-header-start -->
# Wiki Operation Log

Every ingest, lint run, and maintenance operation is recorded here automatically. For a better experience, use the **Operation History** panel:
- Cmd+P → "View operation history"
- Or open from Settings → Auto Maintenance → Operation History

## [2026-07-11 16:05] merge-delete | Stubs merged into DNA skills · manual

**Deleted**: `.framework/skills/bdd-feature-agents.md`, `.framework/skills/tdd-implementation-agents.md`

**Merged content**:
- BDD Feature Agents → [[technologies/dna-bdd-features|BDD Feature Generator]] (feature template, MCP discussion)
- TDD Implementation Agents → [[technologies/dna-tdd-frontend|Frontend TDD]] + [[technologies/dna-tdd-backend|Backend TDD]] (agent interfaces, verification checklist)

**Updated pages**: [[technologies/bdd-feature-agents.md]], [[technologies/tdd-implementation-agents.md]], [[technologies/dna-bdd-features.md]], [[technologies/dna-tdd-frontend.md]], [[technologies/dna-tdd-backend.md]], [[technologies/index.md]], `.framework/skills/index.md`

## [2026-07-11 16:20] create | Project Orchestrator skill · manual

**Created**: `.framework/skills/dna-orchestrator.md`, [[technologies/dna-orchestrator.md]]

**Updated**: [[technologies/index.md]], [[wiki/index.md]], `.framework/skills/index.md`

**Description**: Meta-skill that detects project state, determines which skill to run next, and sequences the full development pipeline. Supports interactive, autopilot, and plan-only modes.

## [2026-07-11 16:30] format | Added Claude Code frontmatter to all skills · manual

**Updated files**: `rlm-context-loader.md`, `graphify-minimal.md`, `wiki-ingest-pipeline.md`, `index.md`

**Description**: Added `description:` and `argument-hint:` frontmatter to all framework skills for proper Claude Code skill registration. All 17 skills in `~/.claude/skills/` now validate.

## [2026-07-11 16:35] create | Project Workflow Guide · manual

**Created**: `setup-instructions/WORKFLOW.md`, [[wiki/workflow.md]]

**Updated**: [[README.md]] (linked from Quick Start and Development Pipeline sections), [[wiki/index.md]]

**Description**: Comprehensive step-by-step workflow for building projects with the framework. Covers project setup, feature development (end-to-end example with User Profile), skill sequencing, parallelization, greenfield vs brownfield, and troubleshooting.

---

## [2026-07-11 15:50] batch-add | Framework Skills to Wiki · manual · 16 pages

**Created pages**: [[technologies/dna-tdd-frontend.md]], [[technologies/dna-tdd-backend.md]], [[technologies/dna-bdd-features.md]], [[technologies/dna-bdd-frontend-steps.md]], [[technologies/dna-bdd-backend-steps.md]], [[technologies/dna-api-contracts.md]], [[technologies/dna-backend-module.md]], [[technologies/dna-domain-entity.md]], [[technologies/dna-frontend-guide.md]], [[technologies/dna-pr.md]], [[technologies/dna-review.md]], [[technologies/bdd-feature-agents.md]], [[technologies/tdd-implementation-agents.md]], [[technologies/wiki-ingest-pipeline.md]], [[technologies/skill-porting-template.md]]

**Updated pages**: [[technologies/index.md]], [[wiki/index.md]]

**Notes**: Added all 16 framework skills from `.framework/skills/` to the wiki. DNA skills (ported, project-agnostic) marked ✅. Original playbook stubs marked ⏳.

---


## [2026-07-11 13:54] ingest | BDD with Cucumber and Gherkin: A Comprehensive Reference · 890s · deepseek/deepseek-v4-flash · 11.4KB

**Created pages**：[[sources/bdd-cucumber-gherkin-reference_7dfdd4.md]], [[entities/behave.md]], [[entities/cucumber.md]], [[entities/specflow.md]], [[entities/pytest-bdd.md]], [[entities/behat.md]], [[entities/fred-brooks.md]], [[concepts/behaviour-driven-development.md]], [[concepts/gherkin.md]], [[concepts/step-definition.md]], [[concepts/cucumber-expressions.md]], [[concepts/declarative-style.md]], [[concepts/test-pyramid.md]], [[concepts/doc-strings.md]], [[concepts/background.md]], [[concepts/scenario-outline.md]], [[concepts/living-documentation.md]], [[concepts/given–when–then.md]], [[concepts/data-tables.md]], [[concepts/event-storming.md]], [[concepts/specification-by-example.md]], [[concepts/example-mapping.md]], [[concepts/gherkin-tags.md]], [[concepts/discovery.md]], [[concepts/domain-driven-design.md]], [[concepts/automation.md]], [[concepts/rule.md]], [[concepts/formulation.md]], [[concepts/imperative-style.md]], [[concepts/starting-with-automation-before-discovery.md]], [[concepts/testing-through-the-ui.md]]

**Updated pages**：



## [2026-07-11 14:04] Wiki lint report


> Wiki status overview: 31 pages total, 0 pages missing aliases, 0 duplicate pages, 8 dead links (0 involve duplicates), 0 orphan pages (0 are duplicates), 0 empty pages, 40 ungrounded quotes, 1 out-of-vocabulary tags. Lint elapsed: 53s

- [[entities/behave]] → **concepts/SpecFlow** (page does not exist)
- [[entities/behave]] → **concepts/Behat** (page does not exist)
- [[concepts/rule]] → **concepts/feature** (page does not exist)
- [[concepts/automation]] → **concepts/cucumber** (page does not exist)
- [[concepts/given–when–then]] → **concepts/cucumber** (page does not exist)
- [[concepts/test-pyramid]] → **concepts/test-driven-development** (page does not exist)
- [[concepts/test-pyramid]] → **concepts/acceptance-test-driven-development** (page does not exist)
- [[concepts/behaviour-driven-development]] → **concepts/Test-Driven-Development** (page does not exist)

### Ungrounded quotes (detected) [40]

- [[concepts/automation]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/automation]] → [[]]: "The three iterative practices: Automation — Connect specifications to the system as failing tests — Automated test suite."
- [[concepts/background]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Background — Adds context to the scenarios that follow it. Runs before each scenario in the feature."
- [[concepts/background]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Best Practice: Keep your Background section short. Don't use it to set up complicated states."
- [[concepts/behaviour-driven-development]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD is a methodology focused on discovery, collaboration, and examples — not testing. It helps teams build shared understanding of what to build before writing code."
- [[concepts/behaviour-driven-development]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/cucumber-expressions]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Cucumber Expressions — Default; simpler syntax with {parameter} patterns"
- [[concepts/data-tables]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Data Tables — For passing a list of values."
- [[concepts/declarative-style]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Scenarios should explain what, not how. Ask: 'Will this wording need to change if the implementation does?' If yes, rework it."
- [[concepts/discovery]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/discovery]] → [[]]: "The three iterative practices: Discovery — Explore what the system could do through collaborative workshops — Shared understanding."
- [[concepts/domain-driven-design]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Domain-Driven Design — BDD's natural companion; shared ubiquitous language"
- [[concepts/event-storming]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Event Storming — Collaborative discovery technique for complex domains"
- [[concepts/example-mapping]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Example Mapping — Structured conversation format for BDD discovery"
- [[concepts/formulation]] → [[]]: "The three iterative practices: Discovery — Explore what the system could do through collaborative workshops — Shared understanding."
- [[concepts/formulation]] → [[]]: "The three iterative practices: Formulation — Document examples as structured, executable specifications — Gherkin scenarios."
- [[concepts/gherkin-tags]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Tags — Place above Feature or Scenario to group related features."
- [[concepts/gherkin]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is a set of grammar rules that makes plain text structured enough for Cucumber to understand. It uses a small set of keywords to describe software behavior in plain language."
- [[concepts/gherkin]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is the lingua franca — readable by humans and computers"
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Given — Context — Puts the system in a known state."
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Then — Outcome — Describes an expected outcome or result."
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "When — Action — Describes an event or action."
- [[concepts/imperative-style]] → [[]]: "Scenarios that describe UI interactions are brittle and miss the underlying behaviour"
- [[concepts/living-documentation]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Living Documentation — Executable specs that stay current with code"
- [[concepts/rule]] → [[]]: "Feature: Highlander
  Rule: There can be only One
    Example: Only One -- More than one alive
      Given there are 3 ninjas
      When 2 ninjas meet, they will fight
      Then one ninja dies (there can be only one)"
- [[concepts/rule]] → [[]]: "Rule (Gherkin 6+) — Represents one business rule that should be implemented. Groups scenarios under a specific rule."
- [[concepts/scenario-outline]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Scenario Outline / Scenario Template — Runs the same Scenario multiple times with different combinations of values."
- [[concepts/specification-by-example]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Specification by Example — Documenting requirements as concrete examples"
- [[concepts/starting-with-automation-before-discovery]] → [[]]: "Anti-Patterns: 1. Starting with Automation Before Discovery"
- [[concepts/starting-with-automation-before-discovery]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/step-definition]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "A Step Definition is a method with an expression that links it to one or more Gherkin steps. Step definitions connect Gherkin steps to programming code — they 'hard-wire the specification to the implementation.'"
- [[concepts/test-pyramid]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD operates at the acceptance level, while TDD guides unit-level implementation."
- [[concepts/test-pyramid]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD scenarios serve as 'guide-rails' at the top of the pyramid, while lower-level TDD tests guide implementation details."
- [[concepts/testing-through-the-ui]] → [[]]: "Testing Through the UI: Scenarios that describe UI interactions are brittle and miss the underlying behaviour"
- [[entities/behat]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Behat — PHP BDD framework"
- [[entities/behave]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Behave — Python BDD framework"
- [[entities/cucumber]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Cucumber — Reference BDD framework (Java, Ruby, JavaScript, and more)"
- [[entities/cucumber]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is a set of grammar rules that makes plain text structured enough for Cucumber to understand."
- [[entities/pytest-bdd]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "pytest-bdd — BDD plugin for pytest"
- [[entities/specflow]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "SpecFlow — .NET BDD framework inspired by Cucumber"

### Pages with out-of-vocabulary tags [1]

- [[sources/bdd-cucumber-gherkin-reference_7dfdd4]] — invalid: Behaviour-Driven Development, Gherkin, Step Definition, Test Pyramid, Cucumber Expressions, Declarative Style, Scenario Outline, Background, Doc Strings, Data Tables, Given–When–Then, Living Documentation, Specification by Example, Example Mapping, Event Storming, Domain-Driven Design, Gherkin Tags, Discovery, Formulation, Automation, Rule, Imperative Style, Testing Through the UI, Starting with Automation Before Discovery

### LLM analysis

### LLM analysis
- Missing pages for important concepts: `feature`, `Test-Driven Development`, `Acceptance Test-Driven Development`, `SpecFlow` (linked as concept), `Behat` (linked as concept), `Cucumber` (linked as concept) — these are referenced but have no standalone wiki page.
- Cross-reference errors: pages such as `automation` and `given–when–then` link to `concepts/cucumber` instead of the existing entity `entities/cucumber`; `rule` links to `concepts/feature` (non-existent); `test-pyramid` links to non-existent `concepts/test-driven-development` and `concepts/acceptance-test-driven-development`.
- Out-of-vocabulary tags on source page `bdd-cucumber-gherkin-reference_7dfdd4`: the tags list contains concept/entity names (e.g., "Behaviour-Driven Development", "Gherkin") that do not match the allowed type vocabulary for `tags` field (as flagged by programmatic check).
- Ungrounded quotes: 40 quotes reference a non-existent wiki page `[[sources/articles/bdd-cucumber-gherkin-reference]]` instead of the actual source page `[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]`, breaking provenance links.
- Structure: source page uses an excessively long list of tags (24 items) that would be better represented as cross-references or in-line links to existing concept/entity pages.
- No contradictory statements or staleness issues found (all pages created on same date).


## [2026-07-11 14:06] Smart Fix All (Causality-Aware with Aliases)

## Fix Dead Links
- [[entities/behave]]: `[[concepts/SpecFlow]]` → pre-check corrected (alias match): [[entities/specflow|specflow]]
- [[entities/behave]]: `[[concepts/Behat]]` → pre-check corrected (alias match): [[entities/behat|behat]]
- [[concepts/rule]]: `[[concepts/feature]]` → corrected: [[concepts/gherkin|Gherkin]]
- [[concepts/automation]]: `[[concepts/cucumber]]` → pre-check corrected (alias match): [[entities/cucumber|cucumber]]
- [[concepts/given–when–then]]: `[[concepts/cucumber]]` → pre-check corrected (alias match): [[entities/cucumber|cucumber]]
- [[concepts/test-pyramid]]: `[[concepts/test-driven-development]]` → stub created (unfilled): wiki/concepts/test-driven-development.md — will be filled by next ingest of a real source
- [[concepts/test-pyramid]]: `[[concepts/acceptance-test-driven-development]]` → stub created (unfilled): wiki/concepts/acceptance-test-driven-development.md — will be filled by next ingest of a real source
- [[concepts/behaviour-driven-development]]: `[[concepts/Test-Driven-Development]]` → pre-check corrected (alias match): [[concepts/test-driven-development|test-driven-development]]


## [2026-07-11 15:33] Wiki lint report


> Wiki status overview: 53 pages total, 2 pages missing aliases, 0 duplicate pages, 10 dead links (0 involve duplicates), 20 orphan pages (0 are duplicates), 0 empty pages, 40 ungrounded quotes, 1 out-of-vocabulary tags. Lint elapsed: 11s

> Aliases missing: 2 page(s) without aliases

### Pages missing aliases [2]

- [[concepts/acceptance-test-driven-development]]
- [[concepts/test-driven-development]]

### Dead links (detected) [10]

- [[technologies/graphify]] → **.framework/skills/graphify-minimal** (page does not exist)
- [[technologies/rlm]] → **.framework/skills/rlm-context-loader** (page does not exist)
- [[patterns/tdd-red-green-clean]] → **.framework/skills/dna-tdd-frontend** (page does not exist)
- [[patterns/tdd-red-green-clean]] → **.framework/skills/dna-tdd-backend** (page does not exist)
- [[patterns/tdd-red-green-clean]] → **wiki/technologies/playwright** (page does not exist)
- [[patterns/tdd-red-green-clean]] → **wiki/technologies/jest** (page does not exist)
- [[patterns/bdd-pipeline]] → **.framework/skills/dna-bdd-features** (page does not exist)
- [[patterns/bdd-pipeline]] → **.framework/skills/dna-bdd-frontend-steps** (page does not exist)
- [[patterns/bdd-pipeline]] → **.framework/skills/dna-bdd-backend-steps** (page does not exist)
- [[concepts/project-context]] → **.framework/skills/rlm-context-loader** (page does not exist)

### Ungrounded quotes (detected) [40]

- [[concepts/automation]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/automation]] → [[]]: "The three iterative practices: Automation — Connect specifications to the system as failing tests — Automated test suite."
- [[concepts/background]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Background — Adds context to the scenarios that follow it. Runs before each scenario in the feature."
- [[concepts/background]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Best Practice: Keep your Background section short. Don't use it to set up complicated states."
- [[concepts/behaviour-driven-development]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD is a methodology focused on discovery, collaboration, and examples — not testing. It helps teams build shared understanding of what to build before writing code."
- [[concepts/behaviour-driven-development]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/cucumber-expressions]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Cucumber Expressions — Default; simpler syntax with {parameter} patterns"
- [[concepts/data-tables]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Data Tables — For passing a list of values."
- [[concepts/declarative-style]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Scenarios should explain what, not how. Ask: 'Will this wording need to change if the implementation does?' If yes, rework it."
- [[concepts/discovery]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/discovery]] → [[]]: "The three iterative practices: Discovery — Explore what the system could do through collaborative workshops — Shared understanding."
- [[concepts/domain-driven-design]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Domain-Driven Design — BDD's natural companion; shared ubiquitous language"
- [[concepts/event-storming]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Event Storming — Collaborative discovery technique for complex domains"
- [[concepts/example-mapping]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Example Mapping — Structured conversation format for BDD discovery"
- [[concepts/formulation]] → [[]]: "The three iterative practices: Discovery — Explore what the system could do through collaborative workshops — Shared understanding."
- [[concepts/formulation]] → [[]]: "The three iterative practices: Formulation — Document examples as structured, executable specifications — Gherkin scenarios."
- [[concepts/gherkin-tags]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Tags — Place above Feature or Scenario to group related features."
- [[concepts/gherkin]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is a set of grammar rules that makes plain text structured enough for Cucumber to understand. It uses a small set of keywords to describe software behavior in plain language."
- [[concepts/gherkin]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is the lingua franca — readable by humans and computers"
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Given — Context — Puts the system in a known state."
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Then — Outcome — Describes an expected outcome or result."
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "When — Action — Describes an event or action."
- [[concepts/imperative-style]] → [[]]: "Scenarios that describe UI interactions are brittle and miss the underlying behaviour"
- [[concepts/living-documentation]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Living Documentation — Executable specs that stay current with code"
- [[concepts/rule]] → [[]]: "Feature: Highlander
  Rule: There can be only One
    Example: Only One -- More than one alive
      Given there are 3 ninjas
      When 2 ninjas meet, they will fight
      Then one ninja dies (there can be only one)"
- [[concepts/rule]] → [[]]: "Rule (Gherkin 6+) — Represents one business rule that should be implemented. Groups scenarios under a specific rule."
- [[concepts/scenario-outline]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Scenario Outline / Scenario Template — Runs the same Scenario multiple times with different combinations of values."
- [[concepts/specification-by-example]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Specification by Example — Documenting requirements as concrete examples"
- [[concepts/starting-with-automation-before-discovery]] → [[]]: "Anti-Patterns: 1. Starting with Automation Before Discovery"
- [[concepts/starting-with-automation-before-discovery]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/step-definition]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "A Step Definition is a method with an expression that links it to one or more Gherkin steps. Step definitions connect Gherkin steps to programming code — they 'hard-wire the specification to the implementation.'"
- [[concepts/test-pyramid]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD operates at the acceptance level, while TDD guides unit-level implementation."
- [[concepts/test-pyramid]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD scenarios serve as 'guide-rails' at the top of the pyramid, while lower-level TDD tests guide implementation details."
- [[concepts/testing-through-the-ui]] → [[]]: "Testing Through the UI: Scenarios that describe UI interactions are brittle and miss the underlying behaviour"
- [[entities/behat]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Behat — PHP BDD framework"
- [[entities/behave]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Behave — Python BDD framework"
- [[entities/cucumber]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Cucumber — Reference BDD framework (Java, Ruby, JavaScript, and more)"
- [[entities/cucumber]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is a set of grammar rules that makes plain text structured enough for Cucumber to understand."
- [[entities/pytest-bdd]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "pytest-bdd — BDD plugin for pytest"
- [[entities/specflow]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "SpecFlow — .NET BDD framework inspired by Cucumber"

### Pages with out-of-vocabulary tags [1]

- [[sources/bdd-cucumber-gherkin-reference_7dfdd4]] — invalid: Behaviour-Driven Development, Gherkin, Step Definition, Test Pyramid, Cucumber Expressions, Declarative Style, Scenario Outline, Background, Doc Strings, Data Tables, Given–When–Then, Living Documentation, Specification by Example, Example Mapping, Event Storming, Domain-Driven Design, Gherkin Tags, Discovery, Formulation, Automation, Rule, Imperative Style, Testing Through the UI, Starting with Automation Before Discovery

### Orphan pages (detected) [20]

- [[technologies/skill-porting-template]] — no other Wiki pages link here
- [[technologies/wiki-ingest-pipeline]] — no other Wiki pages link here
- [[technologies/tdd-implementation-agents]] — no other Wiki pages link here
- [[technologies/bdd-feature-agents]] — no other Wiki pages link here
- [[technologies/dna-review]] — no other Wiki pages link here
- [[technologies/dna-pr]] — no other Wiki pages link here
- [[technologies/dna-frontend-guide]] — no other Wiki pages link here
- [[technologies/dna-domain-entity]] — no other Wiki pages link here
- [[technologies/dna-backend-module]] — no other Wiki pages link here
- [[technologies/dna-api-contracts]] — no other Wiki pages link here
- [[technologies/dna-bdd-backend-steps]] — no other Wiki pages link here
- [[technologies/dna-bdd-frontend-steps]] — no other Wiki pages link here
- [[technologies/dna-bdd-features]] — no other Wiki pages link here
- [[technologies/dna-tdd-backend]] — no other Wiki pages link here
- [[technologies/dna-tdd-frontend]] — no other Wiki pages link here
- [[technologies/graphify]] — no other Wiki pages link here
- [[technologies/rlm]] — no other Wiki pages link here
- [[patterns/tdd-red-green-clean]] — no other Wiki pages link here
- [[patterns/bdd-pipeline]] — no other Wiki pages link here
- [[concepts/project-context]] — no other Wiki pages link here

### LLM analysis

### LLM analysis
- [[technologies/dna-bdd-features]], [[technologies/dna-bdd-frontend-steps]], [[technologies/dna-bdd-backend-steps]], [[technologies/dna-tdd-frontend]], [[technologies/dna-tdd-backend]], [[technologies/dna-domain-entity]], [[technologies/dna-api-contracts]], [[technologies/dna-backend-module]], [[technologies/dna-frontend-guide]], [[technologies/dna-pr]], [[technologies/dna-review]], [[technologies/wiki-ingest-pipeline]], [[technologies/skill-porting-template]] — Type field says `skill` or `reference` but the Wiki Schema only allows `entity`, `concept`, `technology`, `source`, `pattern` per the Index structure. These should be corrected to `technology` or the schema should be applied. The Index lists them under "Technologies" with type: skill, which conflicts with the fact that the frontmatter for entities like fred-brooks has tags: [person] (an entity_type). This is a structural inconsistency.
- [[technologies/graphify]] and [[technologies/rlm]] are orphaned (no inbound links) and have dead inbound references from [[patterns/tdd-red-green-clean]] and [[patterns/bdd-pipeline]] which do not exist. These pages should be integrated or removed.
- [[concepts/project-context]] is orphaned and referenced from a dead link; it should have a standalone page if it's a concept, or be removed.
- [[concepts/acceptance-test-driven-development]] and [[concepts/test-driven-development]] lack aliases, which may reduce discoverability given that these are important BDD-adjacent concepts.
- No contradictions detected between pages based on the sample content — all concept definitions appear consistent (e.g., declarative-style, automation, discovery, formulation all align with the BDD source).
- No staleness detected — all pages have `updated: 2026-07-11` and the source document is current.
- Missing standalone pages: The dead links in [[patterns/tdd-red-green-clean]] reference [[technologies/playwright]] and [[technologies/jest]] — these are important testing tools without Wiki pages. Consider adding them.
- Cross-references are adequate within the entity/concept network (e.g., cucumber→gherkin, behat→cucumber), but the technologies section is poorly cross-linked — no inbound links from concepts or entities to any technology page except indirectly via sources.


## [2026-07-11 15:42] Smart Fix All (Causality-Aware with Aliases)

## Complete Aliases
- [[concepts/acceptance-test-driven-development]]: added 3 aliases (total 3)
- [[concepts/test-driven-development]]: added 5 aliases (total 5)

## Fix Dead Links
- [[technologies/graphify]]: `[[.framework/skills/graphify-minimal]]` → corrected: [[technologies/graphify|graphify]]
- [[technologies/rlm]]: `[[.framework/skills/rlm-context-loader]]` → corrected: [[technologies/rlm|rlm-context-loader]]
- [[patterns/tdd-red-green-clean]]: `[[.framework/skills/dna-tdd-frontend]]` → pre-check corrected (alias match): [[technologies/dna-tdd-frontend|dna-tdd-frontend]]
- [[patterns/tdd-red-green-clean]]: `[[.framework/skills/dna-tdd-backend]]` → pre-check corrected (alias match): [[technologies/dna-tdd-backend|dna-tdd-backend]]
- [[patterns/tdd-red-green-clean]]: `[[wiki/technologies/playwright]]` → stub created (unfilled): wiki/entities/playwright.md — will be filled by next ingest of a real source
- [[patterns/tdd-red-green-clean]]: `[[wiki/technologies/jest]]` → corrected: [[entities/cucumber|cucumber]]
- [[patterns/bdd-pipeline]]: `[[.framework/skills/dna-bdd-features]]` → pre-check corrected (alias match): [[technologies/dna-bdd-features|dna-bdd-features]]
- [[patterns/bdd-pipeline]]: `[[.framework/skills/dna-bdd-frontend-steps]]` → pre-check corrected (alias match): [[technologies/dna-bdd-frontend-steps|dna-bdd-frontend-steps]]
- [[patterns/bdd-pipeline]]: `[[.framework/skills/dna-bdd-backend-steps]]` → pre-check corrected (alias match): [[technologies/dna-bdd-backend-steps|dna-bdd-backend-steps]]
- [[concepts/project-context]]: `[[.framework/skills/rlm-context-loader]]` → stub created (unfilled): wiki/concepts/rlm-context-loader.md — will be filled by next ingest of a real source

## Link Orphan Pages
- [[technologies/skill-porting-template]]: no suitable linking targets found
- [[technologies/wiki-ingest-pipeline]]: no suitable linking targets found
- [[technologies/tdd-implementation-agents]] linked from: [[wiki/entities/cucumber.md]], [[wiki/concepts/test-driven-development.md]]
- [[technologies/bdd-feature-agents]] linked from: [[wiki/concepts/formulation.md]], [[wiki/concepts/living-documentation.md]], [[wiki/concepts/specification-by-example.md]]
- [[technologies/dna-review]]: no suitable linking targets found
- [[technologies/dna-pr]] linked from: [[wiki/concepts/test-driven-development.md]], [[wiki/concepts/living-documentation.md]]
- [[technologies/dna-frontend-guide]]: no suitable linking targets found
- [[technologies/dna-domain-entity]] linked from: [[wiki/concepts/domain-driven-design.md]], [[wiki/concepts/event-storming.md]], [[wiki/concepts/project-context.md]]
- [[technologies/dna-backend-module]] linked from: [[wiki/concepts/domain-driven-design.md]], [[wiki/concepts/acceptance-test-driven-development.md]], [[wiki/concepts/test-driven-development.md]]
- [[technologies/dna-api-contracts]]: no suitable linking targets found
- [[technologies/dna-bdd-backend-steps]]: no suitable linking targets found
- [[technologies/dna-bdd-frontend-steps]]: no suitable linking targets found
- [[technologies/dna-bdd-features]]: no suitable linking targets found
- [[technologies/dna-tdd-backend]]: no suitable linking targets found
- [[technologies/dna-tdd-frontend]] linked from: [[wiki/concepts/test-driven-development.md]], [[wiki/concepts/acceptance-test-driven-development.md]], [[wiki/concepts/testing-through-the-ui.md]]
- [[technologies/graphify]]: no suitable linking targets found
- [[technologies/rlm]] linked from: [[wiki/concepts/project-context.md]]
- [[patterns/tdd-red-green-clean]]: no suitable linking targets found
- [[patterns/bdd-pipeline]]: no suitable linking targets found
- [[concepts/project-context]]: no suitable linking targets found


## [2026-07-11 15:44] Wiki lint report


> Wiki status overview: 56 pages total, 3 pages missing aliases, 0 duplicate pages, 29 dead links (0 involve duplicates), 12 orphan pages (0 are duplicates), 0 empty pages, 40 ungrounded quotes, 1 out-of-vocabulary tags. Lint elapsed: 31s

> Aliases missing: 3 page(s) without aliases

### Pages missing aliases [3]

- [[entities/playwright]]
- [[concepts/rlm-context-loader]]
- [[concepts/project-context]]

### Dead links (detected) [29]

- [[entities/playwright]] → **sources/tdd-red-green-clean** (page does not exist)
- [[entities/cucumber]] → **concepts/tdd-implementation-agents** (page does not exist)
- [[technologies/dna-orchestrator]] → **wiki/technologies/dna-domain-entity\** (page does not exist)
- [[technologies/dna-orchestrator]] → **wiki/technologies/dna-api-contracts\** (page does not exist)
- [[technologies/dna-orchestrator]] → **wiki/technologies/dna-backend-module\** (page does not exist)
- [[technologies/dna-orchestrator]] → **wiki/technologies/dna-frontend-guide\** (page does not exist)
- [[technologies/dna-orchestrator]] → **wiki/technologies/dna-bdd-features\** (page does not exist)
- [[technologies/dna-orchestrator]] → **wiki/technologies/dna-bdd-frontend-steps\** (page does not exist)
- [[technologies/dna-orchestrator]] → **wiki/technologies/dna-bdd-backend-steps\** (page does not exist)
- [[technologies/dna-orchestrator]] → **wiki/technologies/dna-tdd-frontend\** (page does not exist)
- [[technologies/dna-orchestrator]] → **wiki/technologies/dna-tdd-backend\** (page does not exist)
- [[technologies/dna-orchestrator]] → **wiki/technologies/dna-review\** (page does not exist)
- [[technologies/dna-orchestrator]] → **wiki/technologies/dna-pr\** (page does not exist)
- [[concepts/project-context]] → **concepts/domain-entity** (page does not exist)
- [[concepts/project-context]] → **technologies/rlm-context-loader** (page does not exist)
- [[concepts/acceptance-test-driven-development]] → **entities/backend-module** (page does not exist)
- [[concepts/acceptance-test-driven-development]] → **skills/frontend-tdd-implementation** (page does not exist)
- [[concepts/test-driven-development]] → **concepts/tdd-implementation-agents** (page does not exist)
- [[concepts/test-driven-development]] → **entities/pull-request-workflow** (page does not exist)
- [[concepts/test-driven-development]] → **entities/backend-module** (page does not exist)
- [[concepts/test-driven-development]] → **skills/frontend-tdd-implementation** (page does not exist)
- [[concepts/testing-through-the-ui]] → **skills/frontend-tdd-implementation** (page does not exist)
- [[concepts/formulation]] → **skills/bdd-feature-agents** (page does not exist)
- [[concepts/domain-driven-design]] → **concepts/domain-entity** (page does not exist)
- [[concepts/domain-driven-design]] → **entities/backend-module** (page does not exist)
- [[concepts/specification-by-example]] → **skills/bdd-feature-agents** (page does not exist)
- [[concepts/event-storming]] → **concepts/domain-entity** (page does not exist)
- [[concepts/living-documentation]] → **skills/bdd-feature-agents** (page does not exist)
- [[concepts/living-documentation]] → **entities/pull-request-workflow** (page does not exist)

### Ungrounded quotes (detected) [40]

- [[concepts/automation]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/automation]] → [[]]: "The three iterative practices: Automation — Connect specifications to the system as failing tests — Automated test suite."
- [[concepts/background]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Background — Adds context to the scenarios that follow it. Runs before each scenario in the feature."
- [[concepts/background]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Best Practice: Keep your Background section short. Don't use it to set up complicated states."
- [[concepts/behaviour-driven-development]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD is a methodology focused on discovery, collaboration, and examples — not testing. It helps teams build shared understanding of what to build before writing code."
- [[concepts/behaviour-driven-development]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/cucumber-expressions]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Cucumber Expressions — Default; simpler syntax with {parameter} patterns"
- [[concepts/data-tables]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Data Tables — For passing a list of values."
- [[concepts/declarative-style]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Scenarios should explain what, not how. Ask: 'Will this wording need to change if the implementation does?' If yes, rework it."
- [[concepts/discovery]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/discovery]] → [[]]: "The three iterative practices: Discovery — Explore what the system could do through collaborative workshops — Shared understanding."
- [[concepts/domain-driven-design]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Domain-Driven Design — BDD's natural companion; shared ubiquitous language"
- [[concepts/event-storming]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Event Storming — Collaborative discovery technique for complex domains"
- [[concepts/example-mapping]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Example Mapping — Structured conversation format for BDD discovery"
- [[concepts/formulation]] → [[]]: "The three iterative practices: Discovery — Explore what the system could do through collaborative workshops — Shared understanding."
- [[concepts/formulation]] → [[]]: "The three iterative practices: Formulation — Document examples as structured, executable specifications — Gherkin scenarios."
- [[concepts/gherkin-tags]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Tags — Place above Feature or Scenario to group related features."
- [[concepts/gherkin]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is a set of grammar rules that makes plain text structured enough for Cucumber to understand. It uses a small set of keywords to describe software behavior in plain language."
- [[concepts/gherkin]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is the lingua franca — readable by humans and computers"
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Given — Context — Puts the system in a known state."
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Then — Outcome — Describes an expected outcome or result."
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "When — Action — Describes an event or action."
- [[concepts/imperative-style]] → [[]]: "Scenarios that describe UI interactions are brittle and miss the underlying behaviour"
- [[concepts/living-documentation]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Living Documentation — Executable specs that stay current with code"
- [[concepts/rule]] → [[]]: "Feature: Highlander
  Rule: There can be only One
    Example: Only One -- More than one alive
      Given there are 3 ninjas
      When 2 ninjas meet, they will fight
      Then one ninja dies (there can be only one)"
- [[concepts/rule]] → [[]]: "Rule (Gherkin 6+) — Represents one business rule that should be implemented. Groups scenarios under a specific rule."
- [[concepts/scenario-outline]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Scenario Outline / Scenario Template — Runs the same Scenario multiple times with different combinations of values."
- [[concepts/specification-by-example]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Specification by Example — Documenting requirements as concrete examples"
- [[concepts/starting-with-automation-before-discovery]] → [[]]: "Anti-Patterns: 1. Starting with Automation Before Discovery"
- [[concepts/starting-with-automation-before-discovery]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/step-definition]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "A Step Definition is a method with an expression that links it to one or more Gherkin steps. Step definitions connect Gherkin steps to programming code — they 'hard-wire the specification to the implementation.'"
- [[concepts/test-pyramid]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD operates at the acceptance level, while TDD guides unit-level implementation."
- [[concepts/test-pyramid]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD scenarios serve as 'guide-rails' at the top of the pyramid, while lower-level TDD tests guide implementation details."
- [[concepts/testing-through-the-ui]] → [[]]: "Testing Through the UI: Scenarios that describe UI interactions are brittle and miss the underlying behaviour"
- [[entities/behat]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Behat — PHP BDD framework"
- [[entities/behave]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Behave — Python BDD framework"
- [[entities/cucumber]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Cucumber — Reference BDD framework (Java, Ruby, JavaScript, and more)"
- [[entities/cucumber]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is a set of grammar rules that makes plain text structured enough for Cucumber to understand."
- [[entities/pytest-bdd]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "pytest-bdd — BDD plugin for pytest"
- [[entities/specflow]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "SpecFlow — .NET BDD framework inspired by Cucumber"

### Pages with out-of-vocabulary tags [1]

- [[sources/bdd-cucumber-gherkin-reference_7dfdd4]] — invalid: Behaviour-Driven Development, Gherkin, Step Definition, Test Pyramid, Cucumber Expressions, Declarative Style, Scenario Outline, Background, Doc Strings, Data Tables, Given–When–Then, Living Documentation, Specification by Example, Example Mapping, Event Storming, Domain-Driven Design, Gherkin Tags, Discovery, Formulation, Automation, Rule, Imperative Style, Testing Through the UI, Starting with Automation Before Discovery

### Orphan pages (detected) [12]

- [[technologies/dna-orchestrator]] — no other Wiki pages link here
- [[technologies/skill-porting-template]] — no other Wiki pages link here
- [[technologies/wiki-ingest-pipeline]] — no other Wiki pages link here
- [[technologies/tdd-implementation-agents]] — no other Wiki pages link here
- [[technologies/bdd-feature-agents]] — no other Wiki pages link here
- [[technologies/dna-review]] — no other Wiki pages link here
- [[technologies/dna-pr]] — no other Wiki pages link here
- [[technologies/dna-frontend-guide]] — no other Wiki pages link here
- [[technologies/dna-domain-entity]] — no other Wiki pages link here
- [[technologies/dna-backend-module]] — no other Wiki pages link here
- [[technologies/dna-api-contracts]] — no other Wiki pages link here
- [[patterns/bdd-pipeline]] — no other Wiki pages link here

### LLM analysis

### LLM analysis

- **Contradiction: Pages missing aliases [3]** — The programmatic check identified [[entities/playwright]], [[concepts/rlm-context-loader]], and [[concepts/project-context]] as missing aliases. This is inconsistent with other entity pages which consistently include aliases. Likely stub pages that need completion.

- **Contradiction: [[entities/cucumber]] has dead link to [[concepts/tdd-implementation-agents]]** — This page is listed in the orphan list, meaning no pages link to it, yet [[entities/cucumber]] references it. The dead link scan correctly flagged this.

- **Staleness: [[concepts/rule]] page content appears to be placeholder/copied text** — The page contains a full Gherkin example ("Feature: Highlander...") which seems copied directly from reference material without proper context or attribution to a source. Not updated with original source citation.

- **Missing: No page for "Mythical Man-Month" or "IBM System/360"** — [[entities/fred-brooks]] mentions these as major achievements but they lack standalone pages, despite being significant concepts in software engineering literature.

- **Missing: No page for "Behaviour-Driven Development" sub-practices** — While [[concepts/behaviour-driven-development]] exists, the three iterative practices (discovery, formulation, automation) are well-covered individually but their interconnection and workflow are not explicitly documented on any single page with cross-references between them.

- **Missing: No page for "Step Definition" as a concept** — [[concepts/step-definition]] exists but could benefit from linking to specific programming language implementations (e.g., Behat, pytest-bdd, SpecFlow). Currently only has general description.

- **Structure: [[concepts/index]] has unusual description** — The page description is "Domain concepts, architectural principles, and theoretical foundations." which does not match the expected format of other index pages. Likely a placeholder or incorrectly formatted.

- **Structure: Cross-reference inconsistency** — [[entities/specflow]] references [[concepts/Behaviour-Driven Development]] with capitalized "Behaviour-Driven Development" while the actual page is [[concepts/behaviour-driven-development]] (lowercase). This is a dead link and should use proper case formatting.

- **Missing: No page for common BDD tools/languages** — The source [[sources/bdd-cucumber-gherkin-reference_7dfdd4]] mentions Java, Ruby, JavaScript support for Cucumber, but no pages exist for these ecosystems (e.g., "cucumber-java", "cucumber-ruby").

- **Structure: [[concepts/project-context]] has no type assigned** — Unlike all other concept pages which include `type: concept` in frontmatter, this page is missing it. The index shows it without type specification.


## [2026-07-11 15:50] Smart Fix All (Causality-Aware with Aliases)

## Complete Aliases
- [[concepts/rlm-context-loader]]: added 3 aliases (total 3)
- [[concepts/project-context]]: added 5 aliases (total 5)

## Fix Dead Links
- [[entities/playwright]]: `[[sources/tdd-red-green-clean]]` → pre-check corrected (alias match): [[patterns/tdd-red-green-clean|tdd-red-green-clean]]
- [[entities/cucumber]]: `[[concepts/tdd-implementation-agents]]` → pre-check corrected (alias match): [[technologies/tdd-implementation-agents|tdd-implementation-agents]]
- [[technologies/dna-orchestrator]]: `[[wiki/technologies/dna-domain-entity\]]` → corrected: [[technologies/dna-domain-entity|dna-domain-entity]]
- [[technologies/dna-orchestrator]]: `[[wiki/technologies/dna-api-contracts\]]` → corrected: [[technologies/dna-api-contracts|dna-api-contracts]]
- [[technologies/dna-orchestrator]]: `[[wiki/technologies/dna-backend-module\]]` → corrected: [[technologies/dna-backend-module|dna-backend-module]]
- [[technologies/dna-orchestrator]]: `[[wiki/technologies/dna-frontend-guide\]]` → corrected: [[technologies/dna-frontend-guide|dna-frontend-guide]]
- [[technologies/dna-orchestrator]]: `[[wiki/technologies/dna-bdd-features\]]` → corrected: [[technologies/dna-bdd-features|dna-bdd-features]]
- [[technologies/dna-orchestrator]]: `[[wiki/technologies/dna-bdd-frontend-steps\]]` → corrected: [[technologies/dna-bdd-frontend-steps|dna-bdd-frontend-steps]]
- [[technologies/dna-orchestrator]]: `[[wiki/technologies/dna-bdd-backend-steps\]]` → corrected: [[technologies/dna-bdd-backend-steps|dna-bdd-backend-steps]]
- [[technologies/dna-orchestrator]]: `[[wiki/technologies/dna-tdd-frontend\]]` → corrected: [[technologies/dna-tdd-frontend|dna-tdd-frontend]]
- [[technologies/dna-orchestrator]]: `[[wiki/technologies/dna-tdd-backend\]]` → corrected: [[technologies/dna-tdd-backend|dna-tdd-backend]]
- [[technologies/dna-orchestrator]]: `[[wiki/technologies/dna-review\]]` → corrected: [[technologies/dna-review|dna-review]]
- [[technologies/dna-orchestrator]]: `[[wiki/technologies/dna-pr\]]` → corrected: [[technologies/dna-pr|dna-pr]]
- [[concepts/project-context]]: `[[concepts/domain-entity]]` → stub created (unfilled): wiki/concepts/domain-entity.md — will be filled by next ingest of a real source
- [[concepts/project-context]]: `[[technologies/rlm-context-loader]]` → pre-check corrected (alias match): [[concepts/rlm-context-loader|rlm-context-loader]]
- [[concepts/acceptance-test-driven-development]]: `[[entities/backend-module]]` → corrected: [[technologies/dna-backend-module|Backend Module]]
- [[concepts/acceptance-test-driven-development]]: `[[skills/frontend-tdd-implementation]]` → corrected: [[skills/frontend-tdd-implementation]]
- [[concepts/test-driven-development]]: `[[concepts/tdd-implementation-agents]]` → pre-check corrected (alias match): [[technologies/tdd-implementation-agents|tdd-implementation-agents]]
- [[concepts/test-driven-development]]: `[[entities/pull-request-workflow]]` → stub created (unfilled): wiki/entities/pull-request-workflow.md — will be filled by next ingest of a real source
- [[concepts/test-driven-development]]: `[[entities/backend-module]]` → stub created (unfilled): wiki/entities/backend-module.md — will be filled by next ingest of a real source
- [[concepts/test-driven-development]]: `[[skills/frontend-tdd-implementation]]` → stub created (unfilled): wiki/concepts/skillsfrontend-tdd-implementation.md — will be filled by next ingest of a real source
- [[concepts/testing-through-the-ui]]: `[[skills/frontend-tdd-implementation]]` → corrected: [[concepts/skillsfrontend-tdd-implementation|skillsfrontend-tdd-implementation]]
- [[concepts/formulation]]: `[[skills/bdd-feature-agents]]` → pre-check corrected (alias match): [[technologies/bdd-feature-agents|bdd-feature-agents]]
- [[concepts/domain-driven-design]]: `[[concepts/domain-entity]]` → pre-check corrected (alias match): [[concepts/domain-entity|domain-entity]]
- [[concepts/domain-driven-design]]: `[[entities/backend-module]]` → pre-check corrected (alias match): [[entities/backend-module|backend-module]]
- [[concepts/specification-by-example]]: `[[skills/bdd-feature-agents]]` → pre-check corrected (alias match): [[technologies/bdd-feature-agents|bdd-feature-agents]]
- [[concepts/event-storming]]: `[[concepts/domain-entity]]` → pre-check corrected (alias match): [[concepts/domain-entity|domain-entity]]
- [[concepts/living-documentation]]: `[[skills/bdd-feature-agents]]` → pre-check corrected (alias match): [[technologies/bdd-feature-agents|bdd-feature-agents]]
- [[concepts/living-documentation]]: `[[entities/pull-request-workflow]]` → pre-check corrected (alias match): [[entities/pull-request-workflow|pull-request-workflow]]

## Link Orphan Pages
- [[technologies/dna-orchestrator]] linked from: [[wiki/concepts/rlm-context-loader.md]], [[wiki/concepts/project-context.md]], [[wiki/concepts/acceptance-test-driven-development.md]]
- [[technologies/skill-porting-template]]: no suitable linking targets found
- [[technologies/wiki-ingest-pipeline]]: no suitable linking targets found
- [[technologies/tdd-implementation-agents]]: no suitable linking targets found
- [[technologies/bdd-feature-agents]]: no suitable linking targets found
- [[technologies/dna-review]] linked from: [[wiki/concepts/acceptance-test-driven-development.md]], [[wiki/concepts/test-driven-development.md]], [[wiki/concepts/living-documentation.md]]
- [[technologies/dna-pr]]: no suitable linking targets found
- [[technologies/dna-frontend-guide]]: no suitable linking targets found
- [[technologies/dna-domain-entity]] linked from: [[wiki/concepts/domain-driven-design.md]], [[wiki/concepts/event-storming.md]], [[wiki/concepts/rule.md]]
- [[technologies/dna-backend-module]] linked from: [[wiki/concepts/domain-driven-design.md]], [[wiki/concepts/rlm-context-loader.md]], [[wiki/concepts/project-context.md]]
- [[technologies/dna-api-contracts]]: no suitable linking targets found
- [[patterns/bdd-pipeline]]: no suitable linking targets found


## [2026-07-11 21:06] Wiki lint report


> Wiki status overview: 61 pages total, 5 pages missing aliases, 0 duplicate pages, 15 dead links (0 involve duplicates), 5 orphan pages (0 are duplicates), 0 empty pages, 40 ungrounded quotes, 1 out-of-vocabulary tags. Lint elapsed: 51s

> Aliases missing: 5 page(s) without aliases

### Pages missing aliases [5]

- [[entities/backend-module]]
- [[entities/pull-request-workflow]]
- [[entities/playwright]]
- [[concepts/skillsfrontend-tdd-implementation]]
- [[concepts/domain-entity]]

### Dead links (detected) [15]

- [[workflow]] → **.framework/skills/index** (page does not exist)
- [[entities/playwright]] → **sources/tdd-red-green-clean** (page does not exist)
- [[concepts/rlm-context-loader]] → **Project Orchestrator** (page does not exist)
- [[concepts/rlm-context-loader]] → **skills/fluentit-backend-module** (page does not exist)
- [[concepts/project-context]] → **Project Orchestrator** (page does not exist)
- [[concepts/project-context]] → **skills/fluentit-backend-module** (page does not exist)
- [[concepts/acceptance-test-driven-development]] → **skills/frontend-tdd-implementation** (page does not exist)
- [[concepts/acceptance-test-driven-development]] → **Project Orchestrator** (page does not exist)
- [[concepts/acceptance-test-driven-development]] → **skills/fluentit-review** (page does not exist)
- [[concepts/test-driven-development]] → **skills/fluentit-review** (page does not exist)
- [[concepts/rule]] → **skills/fluentit-domain-entity** (page does not exist)
- [[concepts/domain-driven-design]] → **skills/fluentit-domain-entity** (page does not exist)
- [[concepts/domain-driven-design]] → **skills/fluentit-backend-module** (page does not exist)
- [[concepts/event-storming]] → **skills/fluentit-domain-entity** (page does not exist)
- [[concepts/living-documentation]] → **skills/fluentit-review** (page does not exist)

### Ungrounded quotes (detected) [40]

- [[concepts/automation]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/automation]] → [[]]: "The three iterative practices: Automation — Connect specifications to the system as failing tests — Automated test suite."
- [[concepts/background]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Background — Adds context to the scenarios that follow it. Runs before each scenario in the feature."
- [[concepts/background]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Best Practice: Keep your Background section short. Don't use it to set up complicated states."
- [[concepts/behaviour-driven-development]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD is a methodology focused on discovery, collaboration, and examples — not testing. It helps teams build shared understanding of what to build before writing code."
- [[concepts/behaviour-driven-development]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/cucumber-expressions]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Cucumber Expressions — Default; simpler syntax with {parameter} patterns"
- [[concepts/data-tables]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Data Tables — For passing a list of values."
- [[concepts/declarative-style]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Scenarios should explain what, not how. Ask: 'Will this wording need to change if the implementation does?' If yes, rework it."
- [[concepts/discovery]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/discovery]] → [[]]: "The three iterative practices: Discovery — Explore what the system could do through collaborative workshops — Shared understanding."
- [[concepts/domain-driven-design]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Domain-Driven Design — BDD's natural companion; shared ubiquitous language"
- [[concepts/event-storming]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Event Storming — Collaborative discovery technique for complex domains"
- [[concepts/example-mapping]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Example Mapping — Structured conversation format for BDD discovery"
- [[concepts/formulation]] → [[]]: "The three iterative practices: Discovery — Explore what the system could do through collaborative workshops — Shared understanding."
- [[concepts/formulation]] → [[]]: "The three iterative practices: Formulation — Document examples as structured, executable specifications — Gherkin scenarios."
- [[concepts/gherkin-tags]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Tags — Place above Feature or Scenario to group related features."
- [[concepts/gherkin]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is a set of grammar rules that makes plain text structured enough for Cucumber to understand. It uses a small set of keywords to describe software behavior in plain language."
- [[concepts/gherkin]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is the lingua franca — readable by humans and computers"
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Given — Context — Puts the system in a known state."
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Then — Outcome — Describes an expected outcome or result."
- [[concepts/given–when–then]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "When — Action — Describes an event or action."
- [[concepts/imperative-style]] → [[]]: "Scenarios that describe UI interactions are brittle and miss the underlying behaviour"
- [[concepts/living-documentation]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Living Documentation — Executable specs that stay current with code"
- [[concepts/rule]] → [[]]: "Feature: Highlander
  Rule: There can be only One
    Example: Only One -- More than one alive
      Given there are 3 ninjas
      When 2 ninjas meet, they will fight
      Then one ninja dies (there can be only one)"
- [[concepts/rule]] → [[]]: "Rule (Gherkin 6+) — Represents one business rule that should be implemented. Groups scenarios under a specific rule."
- [[concepts/scenario-outline]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Scenario Outline / Scenario Template — Runs the same Scenario multiple times with different combinations of values."
- [[concepts/specification-by-example]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Specification by Example — Documenting requirements as concrete examples"
- [[concepts/starting-with-automation-before-discovery]] → [[]]: "Anti-Patterns: 1. Starting with Automation Before Discovery"
- [[concepts/starting-with-automation-before-discovery]] → [[]]: "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."
- [[concepts/step-definition]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "A Step Definition is a method with an expression that links it to one or more Gherkin steps. Step definitions connect Gherkin steps to programming code — they 'hard-wire the specification to the implementation.'"
- [[concepts/test-pyramid]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD operates at the acceptance level, while TDD guides unit-level implementation."
- [[concepts/test-pyramid]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "BDD scenarios serve as 'guide-rails' at the top of the pyramid, while lower-level TDD tests guide implementation details."
- [[concepts/testing-through-the-ui]] → [[]]: "Testing Through the UI: Scenarios that describe UI interactions are brittle and miss the underlying behaviour"
- [[entities/behat]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Behat — PHP BDD framework"
- [[entities/behave]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Behave — Python BDD framework"
- [[entities/cucumber]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Cucumber — Reference BDD framework (Java, Ruby, JavaScript, and more)"
- [[entities/cucumber]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "Gherkin is a set of grammar rules that makes plain text structured enough for Cucumber to understand."
- [[entities/pytest-bdd]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "pytest-bdd — BDD plugin for pytest"
- [[entities/specflow]] → [[sources/articles/bdd-cucumber-gherkin-reference]]: "SpecFlow — .NET BDD framework inspired by Cucumber"

### Pages with out-of-vocabulary tags [1]

- [[sources/bdd-cucumber-gherkin-reference_7dfdd4]] — invalid: Behaviour-Driven Development, Gherkin, Step Definition, Test Pyramid, Cucumber Expressions, Declarative Style, Scenario Outline, Background, Doc Strings, Data Tables, Given–When–Then, Living Documentation, Specification by Example, Example Mapping, Event Storming, Domain-Driven Design, Gherkin Tags, Discovery, Formulation, Automation, Rule, Imperative Style, Testing Through the UI, Starting with Automation Before Discovery

### Orphan pages (detected) [5]

- [[workflow]] — no other Wiki pages link here
- [[technologies/fluentit-orchestrator]] — no other Wiki pages link here
- [[technologies/skill-porting-template]] — no other Wiki pages link here
- [[technologies/wiki-ingest-pipeline]] — no other Wiki pages link here
- [[patterns/bdd-pipeline]] — no other Wiki pages link here

### LLM analysis

### LLM analysis

- **Missing pages (important concepts without standalone pages):** Several concepts like "skills/fluentit-backend-module", "skills/fluentit-review", "skills/frontend-tdd-implementation", and "Project Orchestrator" are referenced by multiple wiki pages (e.g., `rule`, `domain-driven-design`, `acceptance-test-driven-development`) but do not have their own pages. These are critical for structural completeness of the framework documentation.
- **Naming inconsistency:** The page `[[concepts/skillsfrontend-tdd-implementation]]` appears to be a concatenation error — it should likely be `skills/frontend-tdd-implementation` to match the pattern of other skill references (e.g., `skills/fluentit-review`). This causes broken navigation and confusion.
- **Tag vocabulary violation:** The source page `[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]` uses tags like "Behaviour-Driven Development", "Gherkin", "Step Definition" etc. that are not in the allowed tag vocabulary (allowed only entity/concept types). This violates schema rules and will fail frontmatter validation.
- **Cross-reference structure:** The `workflow` page lists a pipeline arrow `Discovery → Design → Scaffold → BDD → TDD → Review → PR` but the intermediate steps (Scaffold, Design) are not defined as pages, and no links exist to explain them. This could confuse readers.
- **No contradictions** found between pages — definitions of BDD, TDD, Gherkin, etc. are consistent across the sampled content.
- **No staleness** detected — all pages show recent creation/update dates (within the 90-day threshold).


## [2026-07-11 21:10] Smart Fix All (Causality-Aware with Aliases)

## Complete Aliases
- [[entities/pull-request-workflow]]: added 6 aliases (total 6)
- [[entities/backend-module]]: added 5 aliases (total 5)
- [[entities/playwright]]: added 6 aliases (total 6)
- [[concepts/skillsfrontend-tdd-implementation]]: added 4 aliases (total 4)

## Fix Dead Links
- [[workflow]]: `[[.framework/skills/index]]` → corrected: [[concepts/skillsfrontend-tdd-implementation|Framework Skills]]
- [[entities/playwright]]: `[[sources/tdd-red-green-clean]]` → pre-check corrected (alias match): [[patterns/tdd-red-green-clean|tdd-red-green-clean]]
- [[concepts/rlm-context-loader]]: `[[Project Orchestrator]]` → stub created (unfilled): wiki/entities/project-orchestrator.md — will be filled by next ingest of a real source
- [[concepts/rlm-context-loader]]: `[[skills/fluentit-backend-module]]` → pre-check corrected (alias match): [[technologies/fluentit-backend-module|fluentit-backend-module]]
- [[concepts/project-context]]: `[[Project Orchestrator]]` → corrected: [[entities/project-orchestrator|Project Orchestrator]]
- [[concepts/project-context]]: `[[skills/fluentit-backend-module]]` → pre-check corrected (alias match): [[technologies/fluentit-backend-module|fluentit-backend-module]]
- [[concepts/acceptance-test-driven-development]]: `[[skills/frontend-tdd-implementation]]` → corrected: [[concepts/skillsfrontend-tdd-implementation|skillsfrontend-tdd-implementation]]
- [[concepts/acceptance-test-driven-development]]: `[[Project Orchestrator]]` → corrected: [[entities/project-orchestrator|Project Orchestrator]]
- [[concepts/acceptance-test-driven-development]]: `[[skills/fluentit-review]]` → pre-check corrected (alias match): [[technologies/fluentit-review|fluentit-review]]
- [[concepts/test-driven-development]]: `[[skills/fluentit-review]]` → pre-check corrected (alias match): [[technologies/fluentit-review|fluentit-review]]
- [[concepts/rule]]: `[[skills/fluentit-domain-entity]]` → pre-check corrected (alias match): [[technologies/fluentit-domain-entity|fluentit-domain-entity]]
- [[concepts/domain-driven-design]]: `[[skills/fluentit-domain-entity]]` → pre-check corrected (alias match): [[technologies/fluentit-domain-entity|fluentit-domain-entity]]
- [[concepts/domain-driven-design]]: `[[skills/fluentit-backend-module]]` → pre-check corrected (alias match): [[technologies/fluentit-backend-module|fluentit-backend-module]]
- [[concepts/event-storming]]: `[[skills/fluentit-domain-entity]]` → pre-check corrected (alias match): [[technologies/fluentit-domain-entity|fluentit-domain-entity]]
- [[concepts/living-documentation]]: `[[skills/fluentit-review]]` → pre-check corrected (alias match): [[technologies/fluentit-review|fluentit-review]]

## Link Orphan Pages
- [[workflow]]: no suitable linking targets found
- [[technologies/fluentit-orchestrator]]: no suitable linking targets found
- [[technologies/skill-porting-template]] linked from: [[wiki/concepts/rlm-context-loader.md]], [[wiki/concepts/project-context.md]]
- [[technologies/wiki-ingest-pipeline]]: no suitable linking targets found
- [[patterns/bdd-pipeline]] linked from: [[wiki/concepts/acceptance-test-driven-development.md]], [[wiki/concepts/test-driven-development.md]], [[wiki/concepts/project-context.md]]
