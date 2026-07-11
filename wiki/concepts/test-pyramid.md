---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: []
tags: [method]
aliases:
  - "test automation pyramid"
generation_complete: true
---


# Test Pyramid

## Definition
The Test Pyramid is a model for organizing automated tests that contextualizes the role of Behaviour-Driven Development (BDD). It illustrates that BDD scenarios operate at the acceptance level (top of the pyramid), which has few tests but high value, while unit-level TDD tests form the base (many tests, fast, detailed), and integration tests occupy the middle layer. The model emphasizes that BDD serves as "guide-rails" at the top, guiding business behaviour, while lower-level TDD tests guide implementation details.

## Key Characteristics
- Hierarchical structure: unit tests at base (many, fast, fine-grained), integration tests in middle (fewer, slower), acceptance/BDD tests at top (few, high-value, coarse-grained)
- BDD scenarios at the top validate business behaviour without implementation specifics
- Complements TDD by adding a business-focused layer; does not replace it
- Helps teams balance test coverage across different levels of abstraction
- Encourages strategic placement of automated tests to maximize feedback and minimize maintenance

## Applications
- Guiding test automation strategy in agile and BDD-driven projects
- Communicating test allocation and risk to stakeholders
- Deciding where to invest automation effort based on test value and speed
- Designing a balanced suite that includes unit, integration, and acceptance tests

## Related Concepts
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]] – BDD scenarios occupy the top layer of the pyramid
- [[concepts/test-driven-development|test-driven-development]] – TDD forms the base of the pyramid with unit tests
- [[concepts/acceptance-test-driven-development|acceptance-test-driven-development]] – ATDD is closely related to the acceptance-level tests in the pyramid

## Related Entities
*None*

## Mentions in Source

- "BDD operates at the acceptance level, while TDD guides unit-level implementation." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]
- "BDD scenarios serve as 'guide-rails' at the top of the pyramid, while lower-level TDD tests guide implementation details." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]