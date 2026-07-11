---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [method]
aliases:
  - "BDD"
generation_complete: true
---


# Behaviour-Driven Development

## Definition
Behaviour-Driven Development (BDD) is a software development methodology that focuses on discovery, collaboration, and concrete examples, rather than just testing. It aims to build shared understanding among team members before writing code by using a ubiquitous domain language to describe behaviour, not implementation. BDD consists of three iterative practices: Discovery, Formulation, and Automation.

## Key Characteristics
- **Discovery**: Collaborative workshops (e.g., Example Mapping) to explore what the system could do, using concrete examples.
- **Formulation**: Documentation of discovered examples as structured scenarios in Gherkin (Given-When-Then format).
- **Automation**: Connection of formulated specifications to code as automated, failing acceptance tests that drive development.
- **Ubiquitous Language**: All parties (business, developers, testers) use a shared, domain-specific vocabulary to avoid ambiguity.
- **Shift-Left Focus**: Emphasis on clarifying requirements and design before implementation, reducing rework.
- **Acceptance Level**: Operates at the acceptance level of the test pyramid, complementing unit-level Test-Driven Development (TDD).

## Applications
- **Cross-functional Requirement Workshops**: Teams use Example Mapping or Specification by Example to align on feature behaviour.
- **Automated Acceptance Testing**: Gherkin scenarios are turned into executable tests using BDD tools, serving as living documentation.
- **Agile and DevOps Pipelines**: BDD automation is integrated into CI/CD pipelines to catch regressions early and ensure behaviour matches specifications.
- **Domain-Driven Design (DDD) Alignment**: BDD's ubiquitous language supports DDD’s bounded contexts and aggregates.
- **Legacy System Documentation**: Gherkin scenarios can document existing behaviour during refactoring or migration.

## Related Concepts
- [[concepts/Gherkin|Gherkin]]
- [[concepts/Step-Definition|Step Definition]]
- [[concepts/Test-Pyramid|Test Pyramid]]
- [[concepts/test-driven-development|test-driven-development]]

## Related Entities
- [[entities/cucumber|cucumber]]
- [[entities/specflow|specflow]]
- [[entities/behave|behave]]
- [[entities/behat|behat]]
- [[entities/pytest-bdd|pytest-bdd]]

## Mentions in Source

- "BDD is a methodology focused on discovery, collaboration, and examples — not testing. It helps teams build shared understanding of what to build before writing code." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]
- "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]