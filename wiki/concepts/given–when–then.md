---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [term]
aliases:
  - "GWT"
  - "Given When Then"
generation_complete: true
---


# Given–When–Then

## Definition
Given–When–Then is the fundamental pattern for writing steps in a Gherkin scenario. It provides a clear structure for behavior‑driven development (BDD) examples by separating preconditions (Given), actions or events (When), and expected outcomes (Then). This pattern makes scenarios readable, unambiguous, and suitable for automation.

## Key Characteristics
- **Three‑keyword structure**: The scenario is divided into `Given` (initial state), `When` (action or trigger), and `Then` (observable result).
- **Combining steps**: `And` and `But` can be used after any of the three keywords to chain multiple steps without repeating the keyword.
- **Asterisk list style**: An asterisk (`*`) can replace any keyword for a uniform list format.
- **Outcome‑oriented Then steps**: The advice in the source is that `Then` steps should verify observable outputs (e.g., user‑visible changes, API responses) rather than internal database state, preserving the black‑box style of BDD.

## Applications
- Writing executable scenarios in Gherkin for frameworks such as [[entities/cucumber|cucumber]], [[entities/specflow|specflow]], [[entities/behave|behave]], and [[entities/behat|behat]].
- Collaborating with non‑technical stakeholders using a universally understandable pattern.
- Structuring acceptance tests and regression suites in a declarative, behavior‑focused manner.

## Related Concepts
- [[concepts/gherkin|gherkin]] – the language that defines the Given–When–Then syntax.
- [[concepts/behaviour-driven-development|behaviour-driven-development]] – the methodology that Given–When–Then scenarios are a core part of.
- [[concepts/step-definition|step-definition]] – the code that implements each Given/When/Then step.
- [[concepts/declarative-style|declarative-style]] – the recommended style for writing scenarios, consistent with Given–When–Then.

## Related Entities
None.

## Mentions in Source

- "Given — Context — Puts the system in a known state." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]
- "When — Action — Describes an event or action." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]
- "Then — Outcome — Describes an expected outcome or result." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]