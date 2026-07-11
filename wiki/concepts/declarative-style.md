---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [method]
aliases:
  - "declarative BDD style"
  - "declarative Gherkin style"
generation_complete: true
---


# Declarative Style

## Definition
Declarative Style is a method for writing Gherkin scenarios that focuses on describing **what** behaviour should occur, rather than **how** the system implements it. It contrasts with the imperative style, which dictates low-level UI interactions such as typing into fields and clicking buttons. The source strongly advocates for this style as a best practice in Behaviour-Driven Development.

## Key Characteristics
- **Domain language:** Uses business‑familiar terms instead of technical UI details.
- **Abstraction of implementation:** Hides concrete steps like “type ‘username’ into the login field” behind higher‑level statements like “When Free Frieda logs in with her valid credentials”.
- **Resilience to change:** Scenarios remain valid when the UI is redesigned, since the steps do not reference specific widgets.
- **Clear business intent:** Communicates the purpose of the scenario rather than the mechanics of execution.
- **Alignment with BDD principles:** Reinforces the core BDD goal of fostering collaboration between stakeholders through readable, unambiguous examples.

## Applications
- Writing feature files in Gherkin for BDD frameworks such as [[entities/cucumber|Cucumber]], [[entities/specflow|SpecFlow]], [[entities/behave|Behave]], [[entities/behat|Behat]], or [[entities/pytest-bdd|pytest-bdd]].
- Creating acceptance tests that are executable documentation understandable by non‑technical domain experts.
- Designing step definitions that translate declarative scenario steps into implementation‑specific automation code (see [[concepts/step-definition|step-definition]]).

## Related Concepts
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]]
- [[concepts/gherkin|Gherkin]]

## Related Entities
_(None listed)_

## Mentions in Source

- "Scenarios should explain what, not how. Ask: 'Will this wording need to change if the implementation does?' If yes, rework it." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]