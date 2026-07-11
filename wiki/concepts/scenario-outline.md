---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [term]
aliases:
  - "Scenario Template"
generation_complete: true
---


# Scenario Outline

## Definition
A Scenario Outline is a Gherkin keyword that allows a single scenario to be executed multiple times with different combinations of values provided in an `Examples` table. It is a form of data-driven testing within Behaviour-Driven Development (BDD).

## Key Characteristics
- Uses placeholders (e.g., `<start>`, `<eat>`, `<left>`) in step definitions.
- The placeholders are substituted with concrete values from an accompanying `Examples` table.
- Runs the same scenario logic once per row of the `Examples` table.
- Eliminates duplication when testing a business rule with multiple input/output sets.
- Must be paired with an `Examples` section; otherwise the scenario will not execute.

## Applications
- Verifying business rules with multiple input combinations (e.g., boundary values, equivalence classes).
- Demonstrating sample data for acceptance criteria without writing separate scenarios.
- Creating compact, maintainable test suites in Gherkin-based BDD frameworks (e.g., [[entities/cucumber|cucumber]], [[entities/behat|behat]], [[entities/specflow|specflow]], [[entities/behave|behave]], [[entities/pytest-bdd|pytest-bdd]]).

## Related Concepts
- [[concepts/gherkin|gherkin]]
- [[concepts/behaviour-driven-development|behaviour-driven-development]]
- [[concepts/step-definition|step-definition]]

## Related Entities
None

## Mentions in Source

- "Scenario Outline / Scenario Template — Runs the same Scenario multiple times with different combinations of values." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]